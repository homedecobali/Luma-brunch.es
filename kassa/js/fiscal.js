/* LUMA Kassa – fiscale laag: facturas simplificadas, Verifactu-voorbereiding en UBL-export.

   Uitgangspunten (Real Decreto 1007/2023 + Orden HAC/1177/2024, "Veri*factu"):
   - Elke afgerekende bon wordt een onveranderlijk registro de alta (TipoFactura F2 = factura simplificada).
   - Elk registro bevat de SHA-256 "huella" van zichzelf, gekoppeld aan de huella van het vorige registro (keten).
   - Fouten herstel je met een factura rectificativa (R5), nooit door te wissen of te wijzigen.
   - Op de bon: QR-code naar de AEAT-controle + de tekst "VERI*FACTU" zodra verzenden aan staat.
   - Er bestaat bewust GEEN functie om verkopen buiten de registratie te houden.

   Bedragen intern in centen (integers) om afrondingsfouten te voorkomen. Prijzen zijn incl. IVA. */
(function () {
  const C = () => LK.CONFIG;

  /* ---------- SHA-256 (eigen implementatie, werkt ook zonder crypto.subtle / offline) ---------- */
  const K = new Uint32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);
  function sha256Hex(str) {
    const bytes = new TextEncoder().encode(str);
    const len = bytes.length, bitLen = len * 8;
    const total = ((len + 9 + 63) >> 6) << 6;
    const m = new Uint8Array(total); m.set(bytes); m[len] = 0x80;
    const dv = new DataView(m.buffer);
    dv.setUint32(total - 4, bitLen >>> 0); dv.setUint32(total - 8, Math.floor(bitLen / 2 ** 32));
    const H = new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
    const W = new Uint32Array(64);
    const rotr = (x, n) => (x >>> n) | (x << (32 - n));
    for (let o = 0; o < total; o += 64) {
      for (let i = 0; i < 16; i++) W[i] = dv.getUint32(o + i * 4);
      for (let i = 16; i < 64; i++) {
        const s0 = rotr(W[i-15],7) ^ rotr(W[i-15],18) ^ (W[i-15] >>> 3);
        const s1 = rotr(W[i-2],17) ^ rotr(W[i-2],19) ^ (W[i-2] >>> 10);
        W[i] = (W[i-16] + s0 + W[i-7] + s1) >>> 0;
      }
      let [a,b,c,d,e,f,g,h] = H;
      for (let i = 0; i < 64; i++) {
        const S1 = rotr(e,6) ^ rotr(e,11) ^ rotr(e,25), ch = (e & f) ^ (~e & g);
        const t1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
        const S0 = rotr(a,2) ^ rotr(a,13) ^ rotr(a,22), mj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + mj) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      H[0]+=a; H[1]+=b; H[2]+=c; H[3]+=d; H[4]+=e; H[5]+=f; H[6]+=g; H[7]+=h;
    }
    return [...H].map((x) => x.toString(16).padStart(8, "0")).join("").toUpperCase();
  }

  /* ---------- helpers ---------- */
  const pad = (n, l = 2) => String(n).padStart(l, "0");
  const dec = (cents) => (cents / 100).toFixed(2);                       // 1234 -> "12.34"
  const ddmmyyyy = (d) => `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
  const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  function isoWithOffset(d) {
    const off = -d.getTimezoneOffset(), s = off >= 0 ? "+" : "-", a = Math.abs(off);
    return `${dayKey(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}${s}${pad(Math.floor(a / 60))}:${pad(a % 60)}`;
  }
  const xmlEsc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));

  function vatFor(catId, nameEs) {
    const v = C().vat;
    return v.byItem[catId + ":" + nameEs] ?? v.byCategory[catId] ?? v.default;
  }
  function lineTotal(l) { return (l.unit + (l.extras || []).reduce((s, e) => s + e.p, 0)) * l.qty; }

  /* Btw-uitsplitsing per tarief. Prijzen incl. IVA: grondslag = bruto / (1 + tarief). */
  function taxBreakdown(lines) {
    const by = {};
    for (const l of lines) by[l.vat] = (by[l.vat] || 0) + lineTotal(l);
    return Object.keys(by).map(Number).sort((a, b) => a - b).map((rate) => {
      const gross = by[rate], base = Math.round(gross / (1 + rate / 100));
      return { rate, base, cuota: gross - base, gross };
    });
  }

  /* Huella volgens AEAT-specificatie (registro de alta). */
  function huellaAlta(r, prev) {
    const s = `IDEmisorFactura=${r.issuer}&NumSerieFactura=${r.id}&FechaExpedicionFactura=${r.dateEs}` +
      `&TipoFactura=${r.type}&CuotaTotal=${dec(r.cuotaTotal)}&ImporteTotal=${dec(r.total)}` +
      `&Huella=${prev || ""}&FechaHoraHusoGenRegistro=${r.genAt}`;
    return sha256Hex(s);
  }

  /* Bonnen worden strikt na elkaar uitgegeven (keten mag niet vertakken). */
  let chain = Promise.resolve();

  function issue({ lines, table, staff, payment, when, rectifies }) {
    const job = chain.then(() => {
      const d = when ? new Date(when) : new Date();
      const isRect = !!rectifies;
      const series = isRect ? C().series.rectificativa : C().series.ticket;
      const year = d.getFullYear();
      const n = LK.db.nextSeq(`num:${series}${year}`);
      const taxes = taxBreakdown(lines);
      const r = {
        seq: LK.db.nextSeq("chain"),
        id: `${series}${year}-${pad(n, 6)}`,
        series, number: n, type: isRect ? "R5" : "F2",
        issuer: C().business.nif,
        issuedAt: d.toISOString(), day: dayKey(d), dateEs: ddmmyyyy(d), genAt: isoWithOffset(d),
        table: table ? { id: table.id, label: table.label } : null,
        staff: { id: staff.id, name: staff.name },
        lines: lines.map((l) => ({ ...l, total: lineTotal(l) })),
        taxes,
        total: taxes.reduce((s, t) => s + t.gross, 0),
        cuotaTotal: taxes.reduce((s, t) => s + t.cuota, 0),
        payment,
        rectifies: rectifies || null,
        prevId: LK.db.kv("vf:lastId") || null,
        prevHash: LK.db.kv("vf:lastHash") || "",
        sync: "pending",
        software: C().verifactu.software
      };
      r.hash = huellaAlta(r, r.prevHash);
      LK.db.put("records", r);
      LK.db.kv("vf:lastHash", r.hash);
      LK.db.kv("vf:lastId", r.id);
      LK.db.enqueue("record", { id: r.id });
      return r;
    });
    chain = job.catch(() => {});
    return job;
  }

  /* Creditbon (factura rectificativa R5) die een bon volledig terugdraait. */
  function rectify(orig, staff, reason) {
    const lines = orig.lines.map((l) => ({ ...l, qty: -l.qty }));
    return issue({ lines, table: orig.table, staff, rectifies: { id: orig.id, reason: reason || "" },
      payment: { method: orig.payment.method, given: -orig.total, change: 0 } });
  }
  const rectifiedBy = (id) => LK.db.all("records").find((r) => r.rectifies && r.rectifies.id === id);

  function qrUrl(r) {
    const vf = C().verifactu;
    const base = vf.qrBase[vf.env];
    return `${base}?nif=${encodeURIComponent(r.issuer)}&numserie=${encodeURIComponent(r.id)}&fecha=${r.dateEs}&importe=${dec(r.total)}`;
  }
  function qrSvg(text) {
    if (typeof qrcode !== "function") return "";
    const q = qrcode(0, "M"); q.addData(text); q.make();
    return q.createSvgTag({ cellSize: 3, margin: 0, scalable: true });
  }

  /* Ketencontrole: herberekent alle huellas. Handig voor de eigenaar en bij een inspectie. */
  function verifyChain() {
    const all = LK.db.all("records").sort((a, b) => a.seq - b.seq);
    let prev = "", bad = [];
    for (const r of all) {
      if (r.prevHash !== prev || huellaAlta(r, r.prevHash) !== r.hash) bad.push(r.id);
      prev = r.hash;
    }
    return { count: all.length, ok: bad.length === 0, bad };
  }

  /* ---------- Exports (voorbereiding, nog nergens naartoe gestuurd) ---------- */

  /* Registro de alta zoals het later naar de AEAT gaat (SuministroLR.xsd, vereenvoudigd). */
  function verifactuXml(r) {
    const b = C().business;
    const desglose = r.taxes.map((t) => `
        <sum1:DetalleDesglose>
          <sum1:Impuesto>01</sum1:Impuesto>
          <sum1:ClaveRegimen>01</sum1:ClaveRegimen>
          <sum1:CalificacionOperacion>S1</sum1:CalificacionOperacion>
          <sum1:TipoImpositivo>${t.rate.toFixed(2)}</sum1:TipoImpositivo>
          <sum1:BaseImponibleOimporteNoSujeto>${dec(t.base)}</sum1:BaseImponibleOimporteNoSujeto>
          <sum1:CuotaRepercutida>${dec(t.cuota)}</sum1:CuotaRepercutida>
        </sum1:DetalleDesglose>`).join("");
    const rect = r.rectifies ? `
      <sum1:TipoRectificativa>I</sum1:TipoRectificativa>
      <sum1:FacturasRectificadas><sum1:IDFacturaRectificada>
        <sum1:IDEmisorFactura>${xmlEsc(r.issuer)}</sum1:IDEmisorFactura>
        <sum1:NumSerieFactura>${xmlEsc(r.rectifies.id)}</sum1:NumSerieFactura>
      </sum1:IDFacturaRectificada></sum1:FacturasRectificadas>` : "";
    const enc = r.prevHash ? `
        <sum1:RegistroAnterior>
          <sum1:IDEmisorFactura>${xmlEsc(r.issuer)}</sum1:IDEmisorFactura>
          <sum1:NumSerieFactura>${xmlEsc(r.prevId || "")}</sum1:NumSerieFactura>
          <sum1:Huella>${r.prevHash}</sum1:Huella>
        </sum1:RegistroAnterior>` : `<sum1:PrimerRegistro>S</sum1:PrimerRegistro>`;
    return `<sum1:RegistroAlta xmlns:sum1="https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tike/cont/ws/SuministroInformacion.xsd">
  <sum1:IDVersion>1.0</sum1:IDVersion>
  <sum1:IDFactura>
    <sum1:IDEmisorFactura>${xmlEsc(r.issuer)}</sum1:IDEmisorFactura>
    <sum1:NumSerieFactura>${xmlEsc(r.id)}</sum1:NumSerieFactura>
    <sum1:FechaExpedicionFactura>${r.dateEs}</sum1:FechaExpedicionFactura>
  </sum1:IDFactura>
  <sum1:NombreRazonEmisor>${xmlEsc(b.legalName)}</sum1:NombreRazonEmisor>
  <sum1:TipoFactura>${r.type}</sum1:TipoFactura>${rect}
  <sum1:DescripcionOperacion>Venta hostelería</sum1:DescripcionOperacion>
  <sum1:FacturaSinIdentifDestinatarioArt61d>S</sum1:FacturaSinIdentifDestinatarioArt61d>
  <sum1:Desglose>${desglose}
  </sum1:Desglose>
  <sum1:CuotaTotal>${dec(r.cuotaTotal)}</sum1:CuotaTotal>
  <sum1:ImporteTotal>${dec(r.total)}</sum1:ImporteTotal>
  <sum1:Encadenamiento>${enc}
  </sum1:Encadenamiento>
  <sum1:SistemaInformatico>
    <sum1:NombreSistemaInformatico>${xmlEsc(r.software.name)}</sum1:NombreSistemaInformatico>
    <sum1:IdSistemaInformatico>${xmlEsc(r.software.id)}</sum1:IdSistemaInformatico>
    <sum1:Version>${xmlEsc(r.software.version)}</sum1:Version>
  </sum1:SistemaInformatico>
  <sum1:FechaHoraHusoGenRegistro>${r.genAt}</sum1:FechaHoraHusoGenRegistro>
  <sum1:TipoHuella>01</sum1:TipoHuella>
  <sum1:Huella>${r.hash}</sum1:Huella>
</sum1:RegistroAlta>`;
  }

  /* UBL 2.1 (Invoice / CreditNote) voor e-facturatie, zonder klantgegevens. */
  function ubl(r) {
    const b = C().business, credit = !!r.rectifies, root = credit ? "CreditNote" : "Invoice";
    const abs = (c) => dec(Math.abs(c));
    const lines = r.lines.map((l, i) => {
      const net = Math.round(Math.abs(l.total) / (1 + l.vat / 100));
      const name = l.name[0] + (l.extras && l.extras.length ? " + " + l.extras.map((e) => e.t[0]).join(", ") : "");
      return `
  <cac:${root}Line>
    <cbc:ID>${i + 1}</cbc:ID>
    <cbc:${credit ? "CreditedQuantity" : "InvoicedQuantity"} unitCode="C62">${Math.abs(l.qty)}</cbc:${credit ? "CreditedQuantity" : "InvoicedQuantity"}>
    <cbc:LineExtensionAmount currencyID="EUR">${dec(net)}</cbc:LineExtensionAmount>
    <cac:Item><cbc:Name>${xmlEsc(name)}</cbc:Name>
      <cac:ClassifiedTaxCategory><cbc:ID>S</cbc:ID><cbc:Percent>${l.vat}</cbc:Percent><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:ClassifiedTaxCategory>
    </cac:Item>
    <cac:Price><cbc:PriceAmount currencyID="EUR">${dec(Math.round(net / Math.abs(l.qty)))}</cbc:PriceAmount></cac:Price>
  </cac:${root}Line>`;
    }).join("");
    const base = r.taxes.reduce((s, t) => s + t.base, 0);
    return `<?xml version="1.0" encoding="UTF-8"?>
<${root} xmlns="urn:oasis:names:specification:ubl:schema:xsd:${root}-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
  <cbc:ID>${xmlEsc(r.id)}</cbc:ID>
  <cbc:IssueDate>${r.day}</cbc:IssueDate>
  <cbc:IssueTime>${r.genAt.slice(11, 19)}</cbc:IssueTime>${credit ? "" : `
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>`}
  <cbc:Note>Factura simplificada${credit ? " rectificativa de " + xmlEsc(r.rectifies.id) : ""}</cbc:Note>
  <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>${credit ? `
  <cac:BillingReference><cac:InvoiceDocumentReference><cbc:ID>${xmlEsc(r.rectifies.id)}</cbc:ID></cac:InvoiceDocumentReference></cac:BillingReference>` : ""}
  <cac:AccountingSupplierParty><cac:Party>
    <cac:PostalAddress><cbc:StreetName>${xmlEsc(b.address)}</cbc:StreetName><cbc:CityName>${xmlEsc(b.city)}</cbc:CityName><cac:Country><cbc:IdentificationCode>ES</cbc:IdentificationCode></cac:Country></cac:PostalAddress>
    <cac:PartyTaxScheme><cbc:CompanyID>ES${xmlEsc(b.nif)}</cbc:CompanyID><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:PartyTaxScheme>
    <cac:PartyLegalEntity><cbc:RegistrationName>${xmlEsc(b.legalName)}</cbc:RegistrationName></cac:PartyLegalEntity>
  </cac:Party></cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty><cac:Party><cac:PartyLegalEntity><cbc:RegistrationName>Consumidor final</cbc:RegistrationName></cac:PartyLegalEntity></cac:Party></cac:AccountingCustomerParty>
  <cac:PaymentMeans><cbc:PaymentMeansCode>${r.payment.method === "cash" ? "10" : "48"}</cbc:PaymentMeansCode></cac:PaymentMeans>
  <cac:TaxTotal><cbc:TaxAmount currencyID="EUR">${abs(r.cuotaTotal)}</cbc:TaxAmount>${r.taxes.map((t) => `
    <cac:TaxSubtotal><cbc:TaxableAmount currencyID="EUR">${abs(t.base)}</cbc:TaxableAmount><cbc:TaxAmount currencyID="EUR">${abs(t.cuota)}</cbc:TaxAmount>
      <cac:TaxCategory><cbc:ID>S</cbc:ID><cbc:Percent>${t.rate}</cbc:Percent><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal>`).join("")}
  </cac:TaxTotal>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="EUR">${abs(base)}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="EUR">${abs(base)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="EUR">${abs(r.total)}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="EUR">${abs(r.total)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>${lines}
</${root}>`;
  }

  LK.fiscal = { sha256Hex, dec, dayKey, ddmmyyyy, isoWithOffset, vatFor, lineTotal, taxBreakdown,
    issue, rectify, rectifiedBy, qrUrl, qrSvg, verifyChain, verifactuXml, ubl, huellaAlta };
})();
