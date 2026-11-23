/* LUMA Kassa – interface (tablet in landschap, touch). Geen framework, geen build-stap. */
(function () {
  "use strict";
  const CFG = LK.CONFIG, F = LK.fiscal, db = LK.db;
  const A_ = window.LK_ASSETS || "../assets/";   // menukaart en foto's komen uit de website (één bron)
  const LANGS = ["es", "en", "nl"], LI = { es: 0, en: 1, nl: 2 };
  const LOCALE = { es: "es-ES", en: "en-IE", nl: "nl-NL" };
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const toCents = (s) => Math.round(parseFloat(String(s).replace(",", ".")) * 100);

  let lang = "es";
  try { const s = localStorage.getItem("luma-kassa-lang"); if (LANGS.includes(s)) lang = s; } catch (e) {}
  const t = (k, vars) => { let s = (LK.T[lang] && LK.T[lang][k]) ?? LK.T.es[k] ?? k; if (vars) for (const v in vars) s = s.replace("{" + v + "}", vars[v]); return s; };
  const tr = (arr) => arr[LI[lang]] || arr[0];
  const money = (c, l = lang) => new Intl.NumberFormat(LOCALE[l], { style: "currency", currency: "EUR" }).format(c / 100);
  const hhmm = (d) => { d = new Date(d); return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); };

  /* ---------- iconen ---------- */
  const I = {
    tables: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><circle cx="17.5" cy="17.5" r="3.5"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/></svg>',
    cash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v.01M18 15v.01"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M7 12.5l3.2 3L17 9"/></svg>',
    left: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    person: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0z"/></svg>',
    edit: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20h4L19 9l-4-4L4 16v4z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    doc: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7"/></svg>',
    terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><rect x="8.5" y="5" width="7" height="5" rx="1"/><path d="M9 14h.01M12 14h.01M15 14h.01M9 17h.01M12 17h.01M15 17h.01"/></svg>'
  };

  /* ---------- kaart ---------- */
  const PRODUCTS = [], CATS = [];
  (window.LUMA_MENU || []).forEach((c) => {
    CATS.push({ id: c.id, t: c.t });
    c.i.forEach((it, idx) => {
      const p = { key: c.id + ":" + idx, cat: c.id, name: [it[0], it[1], it[2]], price: toCents(it[3]),
        tags: (it[7] || "").split(" ").filter(Boolean), photo: CFG.itemPhotos[c.id + ":" + it[0]] || null, sizes: null };
      const m = /^Grande €(\d+),(\d{2})$/.exec(it[4] || "");
      if (m) p.sizes = [{ id: "n", t: ["Normal", "Regular", "Normaal"], p: p.price }, { id: "g", t: ["Grande", "Large", "Groot"], p: +m[1] * 100 + +m[2] }];
      p.vat = F.vatFor(c.id, it[0]);
      p.search = norm(p.name.join(" "));
      PRODUCTS.push(p);
    });
  });
  const prodByKey = (k) => PRODUCTS.find((p) => p.key === k);

  /* ---------- toestand ---------- */
  const S = { user: null, view: "floor", zone: "in", tableId: null, sel: null, cat: CATS[0] && CATS[0].id, q: "",
    editing: false, editSel: null, rep: { mode: "day", date: new Date() } };
  LK.session = S;

  const layout = () => db.kv("layout") || CFG.tables;
  const tableById = (id) => layout().find((x) => x.id === id);
  const orders = () => db.all("orders");
  const orderFor = (id) => db.get("orders", id);
  const orderTotal = (o) => o.lines.reduce((s, l) => s + F.lineTotal(l), 0);
  const staffById = (id) => CFG.staff.find((s) => s.id === id);
  const perm = (k) => S.user && CFG.can[S.user.role][k];
  const initials = (n) => n.slice(0, 1).toUpperCase();
  const tableLabel = (o) => o.table.takeaway ? t("takeaway") + " " + o.table.label : t("table") + " " + o.table.label;
  const minsOpen = (o) => Math.floor((Date.now() - new Date(o.openedAt)) / 60000);

  function saveOrder(o) {
    o.updatedAt = new Date().toISOString();
    db.put("orders", o);
    db.enqueue("order", { id: o.id, lines: o.lines.length });
  }

  /* ---------- toast & modal ---------- */
  let toastTimer;
  function toast(msg) {
    let el = $(".toast"); if (!el) { el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = msg; el.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => (el.hidden = true), 1800);
  }
  function modal(html, cls = "") {
    closeModal();
    const s = document.createElement("div"); s.className = "scrim"; s.id = "modal";
    s.innerHTML = `<div class="sheet ${cls}" role="dialog" aria-modal="true">${html}</div>`;
    s.addEventListener("click", (e) => { if (e.target === s) closeModal(); });
    document.body.appendChild(s);
    return s;
  }
  function closeModal() { const m = $("#modal"); if (m) m.remove(); }
  const head = (title) => `<header><h3>${esc(title)}</h3><button class="x" data-act="close" aria-label="${esc(t("cancel"))}">${I.x}</button></header>`;

  /* ================= LOGIN ================= */
  let loginSel = null, pin = "";
  function renderLogin() {
    const el = $("#login"); el.hidden = false; $("#app").hidden = true;
    el.innerHTML = `
      <div class="side">
        <div class="arch"><img class="mark" src="${A_}img/mark-cream.png" alt=""><img class="word" src="${A_}img/wordmark-cream.png" alt="LUMA Brunch"></div>
        <h1>${esc(t("login_side"))}</h1>
        <p>${esc(t("login_sub"))}</p>
        <div class="seg" role="group" aria-label="Idioma">${LANGS.map((l) => `<button data-act="lang" data-l="${l}" aria-pressed="${l === lang}">${l.toUpperCase()}</button>`).join("")}</div>
      </div>
      <div class="panel">
        <h2>${esc(t("login_t"))}</h2>
        <p class="hint">${esc(t("login_hint"))}</p>
        <div class="staff-grid">${CFG.staff.map((s) => `
          <button class="staff-btn" data-act="pick" data-id="${s.id}" aria-pressed="${loginSel === s.id}">
            <span class="av" style="background:${s.color}">${initials(s.name)}</span><b>${esc(s.name)}</b><small>${esc(t("role_" + s.role))}</small>
          </button>`).join("")}</div>
        <div class="pinbox">
          <div class="pin-dots" id="dots">${[0, 1, 2, 3].map((i) => `<i class="${i < pin.length ? "on" : ""}"></i>`).join("")}</div>
          <div class="msg" id="pinmsg"></div>
          <div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-act="pin" data-d="${n}">${n}</button>`).join("")}
            <button class="fn" data-act="pinclr">${esc(t("clear"))}</button><button data-act="pin" data-d="0">0</button><button class="fn" data-act="pinback" aria-label="⌫">⌫</button></div>
          <p class="hint" style="margin:4px 0 0;text-align:center">${esc(t("pin_demo"))}</p>
        </div>
      </div>`;
  }
  function pinInput(d) {
    if (!loginSel) { $("#pinmsg").textContent = t("login_hint"); return; }
    if (pin.length >= 4) return;
    pin += d; updateDots();
    if (pin.length === 4) setTimeout(tryLogin, 120);
  }
  function updateDots() { const el = $("#dots"); if (el) el.innerHTML = [0, 1, 2, 3].map((i) => `<i class="${i < pin.length ? "on" : ""}"></i>`).join(""); }
  function tryLogin() {
    const s = staffById(loginSel);
    if (s && s.pin === pin) {
      S.user = s; pin = ""; loginSel = null;
      try { sessionStorage.setItem("luma-kassa-user", s.id); } catch (e) {}
      db.log("login", { staff: s.id });
      S.view = "floor"; renderApp();
    } else {
      pin = ""; updateDots(); const d = $("#dots"); d.classList.remove("shake"); void d.offsetWidth; d.classList.add("shake");
      $("#pinmsg").textContent = t("pin_wrong");
    }
  }
  function logout() {
    db.log("logout", { staff: S.user && S.user.id });
    S.user = null; S.editing = false; closeModal();
    try { sessionStorage.removeItem("luma-kassa-user"); } catch (e) {}
    renderLogin();
  }

  /* ================= APP SHELL ================= */
  function renderApp() {
    $("#login").hidden = true; $("#app").hidden = false;
    document.documentElement.lang = lang;
    renderTop(); renderView();
  }
  function renderTop() {
    const u = S.user, q = db.pending();
    $("#top").innerHTML = `
      <div class="brand"><img class="mark" src="${A_}img/mark-cream.png" alt="LUMA"><img class="word" src="${A_}img/wordmark-cream.png" alt=""><span class="tag">Caja</span></div>
      <nav class="nav">
        <button data-act="view" data-v="floor" aria-current="${S.view === "floor" || S.view === "order"}">${I.tables}${esc(t("nav_tables"))}</button>
        <button data-act="view" data-v="reports" aria-current="${S.view === "reports"}">${I.chart}${esc(t("nav_reports"))}</button>
      </nav>
      <div class="spacer"></div>
      <span class="pill ${LK.sync.online ? "" : "off"}" title="${q} ${esc(t("queue"))}"><span class="dot"></span>${esc(LK.sync.online ? t("online") : t("offline"))}${q ? ` · ${q} ${esc(t("queue_n"))}` : ""}</span>
      <div class="seg" role="group" aria-label="Idioma">${LANGS.map((l) => `<button data-act="lang" data-l="${l}" aria-pressed="${l === lang}">${l.toUpperCase()}</button>`).join("")}</div>
      <span class="clock num" id="clock">${hhmm(new Date())}</span>
      <div class="user"><span class="av" style="background:${u.color};box-shadow:0 0 0 2px var(--cream)">${initials(u.name)}</span>
        <span class="who">${esc(u.name)}<small>${esc(t("role_" + u.role))}</small></span>
        <button class="out" data-act="logout">${esc(t("logout"))}</button></div>`;
    $("#demo").textContent = t("demo");
  }
  function renderView() {
    const m = $("#main");
    if (S.view === "floor") m.innerHTML = floorHtml();
    else if (S.view === "order") m.innerHTML = orderHtml();
    else m.innerHTML = reportsHtml();
    if (S.view === "floor" && S.editing) bindDrag();
    if (S.view === "order") { const q = $("#q"); if (q && S.q) q.value = S.q; const sl = $(".line.sel"); if (sl) sl.scrollIntoView({ block: "nearest" }); }
  }
  function go(view) { S.view = view; S.editing = false; renderTop(); renderView(); }

  /* ================= PLATTEGROND ================= */
  function floorHtml() {
    const os = orders().sort((a, b) => a.openedAt.localeCompare(b.openedAt));
    const z = CFG.zones.find((x) => x.id === S.zone);
    const tables = layout().filter((x) => x.zone === S.zone);
    const editBar = S.editing ? (() => {
      const sel = S.editSel && tableById(S.editSel);
      return `<div class="edit-bar">
        <button class="sm btn-ghost" data-act="addtbl" data-shape="round">+ ${esc(t("add_round"))}</button>
        <button class="sm btn-ghost" data-act="addtbl" data-shape="sq">+ ${esc(t("add_square"))}</button>
        ${sel ? `<span style="font-weight:800;margin-left:6px">${esc(t("table"))} ${esc(sel.id)}</span>
          <button class="sm btn-line" data-act="seats" data-d="-1">− ${I.person}</button><span class="num" style="font-weight:800">${sel.seats}</span><button class="sm btn-line" data-act="seats" data-d="1">+ ${I.person}</button>
          <button class="sm btn-line" data-act="renametbl">${I.edit}${esc(t("rename"))}</button>
          <button class="sm btn-bad" data-act="deltbl">${esc(t("delete"))}</button>` : `<span class="note-box">${esc(t("edit_hint"))}</span>`}
        <button class="sm btn-green" data-act="editdone" style="margin-left:auto">${esc(t("done"))}</button></div>`;
    })() : "";
    return `<section class="view floor">
      <aside class="open-list">
        <header><h3>${esc(t("open_tickets"))} <span class="num" style="color:var(--muted);font-size:15px">(${os.length})</span></h3>
          <button class="big-btn btn-gold" data-act="takeaway">${I.bag}${esc(t("new_takeaway"))}</button></header>
        <div class="open-items">${os.length ? os.map((o) => {
          const st = staffById(o.staffId);
          return `<button class="oi" data-act="open" data-id="${esc(o.id)}">
            <span class="tname ${o.table.takeaway ? "ta" : ""}">${o.table.takeaway ? I.bag.replace("<svg", '<svg width="22" height="22"') : esc(o.table.label)}</span>
            <b>${esc(tableLabel(o))}</b><span class="amt num">${money(orderTotal(o))}</span>
            <small>${minsOpen(o)} ${t("min")} · ${o.lines.reduce((s, l) => s + l.qty, 0)} ${esc(t("items"))} · ${esc(st ? st.name : "")}</small></button>`;
        }).join("") : `<div class="empty-note">${esc(t("none_open"))}</div>`}</div>
      </aside>
      <div class="plan-wrap">
        <div class="plan-tools">
          <div class="zones" role="group">${CFG.zones.map((zz) => `<button data-act="zone" data-z="${zz.id}" aria-pressed="${zz.id === S.zone}">${esc(tr(zz.t))} <span class="num" style="opacity:.7">${orders().filter((o) => !o.table.takeaway && (tableById(o.table.id) || {}).zone === zz.id).length}/${layout().filter((x) => x.zone === zz.id).length}</span></button>`).join("")}</div>
          ${S.editing ? "" : `<div class="legend"><span><i></i>${esc(t("free"))}</span><span><i class="busy"></i>${esc(t("busy"))}</span><span><i class="long"></i>${esc(t("long", { m: CFG.longTableMinutes }))}</span></div>
          ${perm("layout") ? `<button class="sm btn-line" style="height:42px;padding:0 14px;border-radius:12px;font-weight:700;display:flex;gap:6px;align-items:center" data-act="edit">${I.edit}${esc(t("edit_layout"))}</button>` : ""}`}
          ${editBar}
        </div>
        <div class="plan ${S.zone === "out" ? "terrace" : ""} ${S.editing ? "editing" : ""}" id="plan">
          <span class="zone-label">${esc(tr(z.t))}</span>
          ${z.fixtures.map((f) => `<div class="fixture" style="left:${f.x}%;top:${f.y}%;width:${f.w}%;height:${f.h}%">${esc(tr(f.label))}</div>`).join("")}
          ${tables.map((tb) => {
            const o = orderFor(tb.id);
            const cls = o ? (minsOpen(o) >= CFG.longTableMinutes ? "busy long" : "busy") : "";
            return `<button class="tbl ${tb.shape === "round" ? "round" : ""} ${cls} ${S.editing && S.editSel === tb.id ? "sel" : ""}" data-act="table" data-id="${esc(tb.id)}"
              style="left:${tb.x}%;top:${tb.y}%;width:${tb.w}px;height:${tb.h}px" aria-label="${esc(t("table"))} ${esc(tb.id)}">
              <span class="n">${esc(tb.id)}</span>
              ${o ? `<span class="amt num">${money(orderTotal(o))}</span><span class="s">${minsOpen(o)} ${t("min")} · ${esc((staffById(o.staffId) || {}).name || "")}</span>`
                  : `<span class="s">${I.person}${tb.seats}</span>`}
            </button>`;
          }).join("")}
        </div>
      </div></section>`;
  }

  function openTable(id) {
    const tb = tableById(id);
    let o = orderFor(id);
    if (!o) o = { id, table: { id, label: id }, lines: [], openedAt: new Date().toISOString(), staffId: S.user.id };
    openOrder(o);
  }
  function openOrder(o) {
    S.current = o; S.tableId = o.id; S.sel = null; S.q = "";
    S.view = "order"; renderTop(); renderView();
  }
  function newTakeaway() {
    const n = db.nextSeq("takeaway:" + F.dayKey(new Date()));
    const id = "L" + n;
    openOrder({ id: "TA-" + F.dayKey(new Date()) + "-" + n, table: { id, label: id, takeaway: true }, lines: [], openedAt: new Date().toISOString(), staffId: S.user.id });
  }

  /* plattegrond bewerken: slepen met pointer events */
  function bindDrag() {
    const plan = $("#plan"); if (!plan) return;
    let drag = null;
    plan.addEventListener("pointerdown", (e) => {
      const el = e.target.closest(".tbl"); if (!el) return;
      e.preventDefault();
      drag = { id: el.dataset.id, el, sx: e.clientX, sy: e.clientY, moved: false };
      el.setPointerCapture(e.pointerId);
    });
    plan.addEventListener("pointermove", (e) => {
      if (!drag) return;
      if (Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) > 6) drag.moved = true;
      if (!drag.moved) return;
      const r = plan.getBoundingClientRect();
      const x = Math.max(3, Math.min(97, ((e.clientX - r.left) / r.width) * 100));
      const y = Math.max(5, Math.min(95, ((e.clientY - r.top) / r.height) * 100));
      drag.el.style.left = x + "%"; drag.el.style.top = y + "%"; drag.x = x; drag.y = y;
    });
    const end = () => {
      if (!drag) return;
      const L = layout().map((x) => ({ ...x }));
      const tb = L.find((x) => x.id === drag.id);
      if (drag.moved && tb) { tb.x = Math.round(drag.x * 10) / 10; tb.y = Math.round(drag.y * 10) / 10; db.kv("layout", L); }
      S.editSel = drag.id; drag = null; renderView();
    };
    plan.addEventListener("pointerup", end);
    plan.addEventListener("pointercancel", end);
  }
  function editTable(fn) {
    const L = layout().map((x) => ({ ...x }));
    const tb = L.find((x) => x.id === S.editSel); if (!tb) return;
    if (fn(tb, L) === false) return;
    db.kv("layout", L); db.log("layout", { table: tb.id }); renderView();
  }

  /* ================= BESTELLEN ================= */
  function orderHtml() {
    const o = S.current, tot = orderTotal(o);
    const list = S.q ? PRODUCTS.filter((p) => norm(S.q).split(/\s+/).every((w) => p.search.includes(w))) : PRODUCTS.filter((p) => p.cat === S.cat);
    const counts = {}; o.lines.forEach((l) => (counts[l.key] = (counts[l.key] || 0) + l.qty));
    const taxes = F.taxBreakdown(o.lines);
    return `<section class="view order">
      <nav class="cats" aria-label="Categorías">${CATS.map((c) => `<button data-act="cat" data-c="${c.id}" aria-pressed="${!S.q && c.id === S.cat}">${esc(tr(c.t))}</button>`).join("")}</nav>
      <div class="prods">
        <div class="prod-head"><label class="search">${I.search}<input id="q" type="search" placeholder="${esc(t("search"))}" autocomplete="off" value="${esc(S.q)}"></label></div>
        <div class="prod-grid">${list.map((p) => {
          const ph = p.photo || CFG.catPhotos[p.cat];
          const phCls = p.photo ? "" : ph ? "cat" : "none";
          return `<button class="prod" data-act="add" data-k="${p.key}">
            <span class="ph ${phCls}" ${ph ? `style="background-image:url(${A_}img/fotos/${ph}-s.jpg)"` : ""}></span>
            <span class="tg">${p.tags.includes("v") ? '<b class="b b-v">V</b>' : p.tags.includes("vg") ? '<b class="b">VG</b>' : ""}${p.tags.includes("p") ? '<b class="b">P</b>' : ""}</span>
            ${counts[p.key] ? `<span class="cnt num">${counts[p.key]}</span>` : ""}
            <span class="body"><span class="nm">${esc(tr(p.name))}</span><span class="pr num">${money(p.price)}${p.sizes ? `<span class="sz">+ ${esc(t("large"))}</span>` : ""}</span></span>
          </button>`;
        }).join("")}</div>
      </div>
      <aside class="ticket">
        <header><span class="tname ${o.table.takeaway ? "ta" : ""}">${o.table.takeaway ? I.bag.replace("<svg", '<svg width="24" height="24"') : esc(o.table.label)}</span>
          <div><h3>${esc(tableLabel(o))}</h3><small>${esc(t("open_by"))} ${esc((staffById(o.staffId) || S.user).name)} · ${hhmm(o.openedAt)}</small></div>
          <button class="x" data-act="back" aria-label="${esc(t("back"))}">${I.x}</button></header>
        <div class="lines">${o.lines.length ? o.lines.map((l) => {
          const sel = S.sel === l.lid;
          return `<div class="line ${sel ? "sel" : ""}" data-act="selline" data-id="${l.lid}" role="button" tabindex="0">
            <span class="q num">${l.qty}</span><span class="nm">${esc(tr(l.name))}${l.size ? ` <small style="color:var(--muted)">(${esc(tr(l.size.t))})</small>` : ""}</span><span class="p num">${money(F.lineTotal(l))}</span>
            ${l.extras && l.extras.length ? `<span class="ex">+ ${l.extras.map((e) => esc(tr(e.t))).join(", ")}</span>` : ""}
            ${l.note ? `<span class="note">“${esc(l.note)}”</span>` : ""}
            ${sel ? `<div class="line-actions">
              <button data-act="qty" data-d="-1" aria-label="−1">−</button><button data-act="qty" data-d="1" aria-label="+1">+</button>
              ${CFG.extrasForCat[l.cat] ? `<button data-act="extras">+ ${esc(t("extra"))}</button>` : ""}
              <button data-act="note">${I.edit}${esc(t("note"))}</button>
              <button class="del" data-act="rmline">${esc(t("remove"))}</button></div>` : ""}
          </div>`;
        }).join("") : `<div class="empty-note">${esc(t("empty_ticket"))}</div>`}</div>
        <div class="totals">
          ${taxes.map((x) => `<div class="r num"><span>${esc(t("base"))} ${x.rate}% ${money(x.base)}</span><span>IVA ${money(x.cuota)}</span></div>`).join("")}
          <div class="r big num"><span>${esc(t("total"))}</span><span>${money(tot)}</span></div>
        </div>
        <div class="tk-actions">
          <button class="big-btn btn-ghost" data-act="back">${esc(t("back"))}</button>
          <button class="big-btn btn-line" data-act="move" ${o.lines.length ? "" : "disabled"}>${esc(t("move"))}</button>
          <button class="big-btn btn-gold pay" data-act="pay" ${o.lines.length ? "" : "disabled"}>${esc(t("pay"))} · <span class="num">${money(tot)}</span></button>
        </div>
      </aside></section>`;
  }

  function addProduct(p, size) {
    const o = S.current;
    const unit = size ? size.p : p.price;
    let l = o.lines.find((x) => x.key === p.key && (x.size ? x.size.id : null) === (size ? size.id : null) && !(x.extras && x.extras.length) && !x.note);
    if (l) l.qty++;
    else {
      l = { lid: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), key: p.key, cat: p.cat, name: p.name, unit, qty: 1, extras: [], note: "", vat: p.vat, size: size ? { id: size.id, t: size.t } : null };
      o.lines.push(l);
    }
    S.sel = l.lid;
    saveOrder(o); renderView();
  }
  function curLine() { return S.current && S.current.lines.find((l) => l.lid === S.sel); }

  function sizeSheet(p) {
    modal(`${head(tr(p.name))}<div class="bd"><div class="opt-grid">${p.sizes.map((s) => `<button class="opt" data-act="size" data-k="${p.key}" data-s="${s.id}"><span>${esc(tr(s.t))}</span><span class="num">${money(s.p)}</span></button>`).join("")}</div></div>`);
  }
  function extrasSheet() {
    const l = curLine(); if (!l) return;
    const list = CFG.extras[CFG.extrasForCat[l.cat]] || [];
    modal(`${head(t("extra") + " · " + tr(l.name))}<div class="bd"><div class="opt-grid">${list.map((e) => {
      const on = l.extras.some((x) => x.id === e.id);
      return `<button class="opt" data-act="togextra" data-e="${e.id}" aria-pressed="${on}"><span>${esc(tr(e.t))}</span><span class="num">+ ${money(Math.round(e.p * 100))}</span></button>`;
    }).join("")}</div><button class="big-btn btn-green" data-act="close">${esc(t("done"))}</button></div>`);
  }
  function noteSheet() {
    const l = curLine(); if (!l) return;
    const quick = { es: ["Sin cebolla", "Sin gluten", "Para compartir", "Poco hielo", "Muy caliente", "Sin azúcar"], en: ["No onion", "Gluten free", "To share", "Little ice", "Extra hot", "No sugar"], nl: ["Zonder ui", "Glutenvrij", "Om te delen", "Weinig ijs", "Extra heet", "Zonder suiker"] }[lang];
    modal(`${head(t("note") + " · " + tr(l.name))}<div class="bd">
      <div class="field"><label for="notein">${esc(t("note"))}</label><input id="notein" value="${esc(l.note)}" placeholder="${esc(t("note_ph"))}" maxlength="80"></div>
      <div class="chips">${quick.map((q) => `<button data-act="quicknote" data-v="${esc(q)}">${esc(q)}</button>`).join("")}</div>
      <div class="row-btns"><button class="big-btn btn-ghost" data-act="close">${esc(t("cancel"))}</button><button class="big-btn btn-green" data-act="savenote">${esc(t("save"))}</button></div></div>`);
  }
  function moveSheet() {
    const o = S.current;
    const z = CFG.zones;
    modal(`${head(t("move_t"))}<div class="bd">${z.map((zz) => `<div class="field"><label>${esc(tr(zz.t))}</label><div class="chips">${layout().filter((x) => x.zone === zz.id && x.id !== o.id).map((x) => `<button data-act="moveto" data-id="${esc(x.id)}" style="${orderFor(x.id) ? "background:var(--green);color:var(--cream)" : ""}">${esc(t("table"))} ${esc(x.id)}</button>`).join("")}</div></div>`).join("")}
      <p class="note-box">${esc(t("merge_q"))}</p></div>`);
  }
  function moveTo(id) {
    const o = S.current, target = orderFor(id);
    const wasSaved = !!orderFor(o.id);
    let n;
    if (target) { target.lines.push(...o.lines); n = target; }
    else n = { ...o, id, table: { id, label: id } };
    if (wasSaved) db.del("orders", o.id);
    saveOrder(n); db.log("move", { from: o.id, to: id });
    closeModal(); toast(t("moved") + " " + t("table") + " " + id);
    S.current = n; S.tableId = id; renderView();
  }

  /* ================= AFREKENEN ================= */
  const P = { method: "card", given: "" };
  function paySheet() {
    P.method = "card"; P.given = "";
    renderPay();
  }
  function renderPay() {
    const o = S.current, tot = orderTotal(o);
    const given = P.given ? Math.round(parseFloat(P.given.replace(",", ".")) * 100) : 0;
    const change = given - tot;
    const notes = [500, 1000, 2000, 5000].filter((n) => n >= tot).slice(0, 4);
    const html = `${head(t("pay_t") + " · " + tableLabel(o))}<div class="bd"><div class="pay-grid">
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="pay-total"><small>${esc(t("total"))} · ${esc(t("vat_incl"))}</small><b class="num">${money(tot)}</b>
          <span style="font-size:13px;opacity:.85">${F.taxBreakdown(o.lines).map((x) => `IVA ${x.rate}%: ${money(x.cuota)}`).join(" · ")}</span></div>
        <div class="field"><label>${esc(t("method"))}</label>
          <div class="methods"><button class="method" data-act="pmeth" data-m="card" aria-pressed="${P.method === "card"}">${I.card}${esc(t("card"))}</button>
          <button class="method" data-act="pmeth" data-m="cash" aria-pressed="${P.method === "cash"}">${I.cash}${esc(t("cash"))}</button></div></div>
      </div>
      ${P.method === "card" ? `<div style="display:flex;flex-direction:column;gap:14px">
          <div class="pin-wait">${I.terminal}<b style="color:var(--ink);font-size:17px">${esc(t("card_wait"))}</b><span>${esc(t("card_note"))}</span><b class="num" style="font:600 30px var(--f-display);color:var(--green)">${money(tot)}</b></div>
          <button class="big-btn btn-green" style="height:66px;font-size:19px" data-act="confirmpay">${I.ok.replace("<svg", '<svg width="26" height="26"')}${esc(t("card_ok"))}</button></div>`
      : `<div class="cash-box">
          <div class="cash-disp"><span style="font-weight:700;color:var(--muted)">${esc(t("given"))}</span><b class="num">${given ? money(given) : "—"}</b></div>
          <div class="notes"><button data-act="cashq" data-v="${tot}">${esc(t("exact"))}</button>${notes.map((n) => `<button data-act="cashq" data-v="${n}">${n / 100} €</button>`).join("")}</div>
          <div class="pad wide">${["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "⌫"].map((d) => `<button class="${d === "⌫" || d === "," ? "fn" : ""}" data-act="cashd" data-d="${d}">${d}</button>`).join("")}</div>
          <div class="change ${given && change < 0 ? "short" : ""}"><span>${esc(given && change < 0 ? t("short") : t("change"))}</span><b class="num">${given ? money(Math.abs(change)) : "—"}</b></div>
          <button class="big-btn btn-green" style="height:62px;font-size:18px" data-act="confirmpay" ${given >= tot ? "" : "disabled"}>${esc(t("cash_ok"))}</button>
        </div>`}
    </div></div>`;
    const m = $("#modal");
    if (m) m.querySelector(".sheet").innerHTML = html; else modal(html, "wide");
  }
  let paying = false;
  async function confirmPay() {
    if (paying) return; paying = true;
    try {
      const o = S.current, tot = orderTotal(o);
      const given = P.method === "cash" ? Math.round(parseFloat(P.given.replace(",", ".")) * 100) : tot;
      const rec = await F.issue({ lines: o.lines, table: o.table, staff: S.user, payment: { method: P.method, given, change: given - tot } });
      if (orderFor(o.id)) db.del("orders", o.id);
      db.log("paid", { record: rec.id, order: o.id });
      S.current = null; S.view = "floor";
      renderTop(); renderView();
      showReceipt(rec, true);
    } finally { paying = false; }
  }

  /* ================= BON ================= */
  function receiptHtml(r) {
    const b = CFG.business, vf = CFG.verifactu;
    const isR = !!r.rectifies;
    return `<div class="receipt" id="receipt">
      <div class="c"><img class="logo" src="${A_}img/wordmark-green.png" alt="LUMA Brunch"></div>
      <div class="c"><b>${esc(b.legalName)}</b><br>NIF ${esc(b.nif)}<br>${esc(b.address)}<br>${esc(b.city)}</div>
      <hr>
      <div class="c"><b>${isR ? "FACTURA SIMPLIFICADA RECTIFICATIVA" : "FACTURA SIMPLIFICADA"}</b></div>
      <div class="rw"><span>Nº ${esc(r.id)}</span><span>${r.dateEs.replace(/-/g, "/")} ${hhmm(r.issuedAt)}</span></div>
      ${isR ? `<div>Rectifica: ${esc(r.rectifies.id)}${r.rectifies.reason ? " (" + esc(r.rectifies.reason) + ")" : ""}</div>` : ""}
      <div class="rw"><span>${r.table ? (r.table.takeaway ? "Para llevar " : "Mesa ") + esc(r.table.label) : ""}</span><span>Le atendió: ${esc(r.staff.name)}</span></div>
      <hr>
      ${r.lines.map((l) => `<div class="rw"><span>${l.qty} x ${esc(l.name[0])}${l.size ? " (" + esc(l.size.t[0]) + ")" : ""}</span><span class="num">${F.dec(l.total).replace(".", ",")}</span></div>
        ${l.extras && l.extras.length ? `<div style="padding-left:2ch">+ ${l.extras.map((e) => esc(e.t[0])).join(", ")}</div>` : ""}`).join("")}
      <hr>
      <div class="rw tot"><span>TOTAL</span><span class="num">${money(r.total, "es")}</span></div>
      <table><thead><tr><th>IVA</th><th>Base</th><th>Cuota</th><th>Total</th></tr></thead><tbody>
        ${r.taxes.map((x) => `<tr><td>${x.rate}%</td><td>${F.dec(x.base).replace(".", ",")}</td><td>${F.dec(x.cuota).replace(".", ",")}</td><td>${F.dec(x.gross).replace(".", ",")}</td></tr>`).join("")}
      </tbody></table>
      <hr>
      ${r.payment.method === "cash"
        ? `<div class="rw"><span>Efectivo</span><span class="num">${F.dec(r.payment.given).replace(".", ",")}</span></div><div class="rw"><span>Cambio</span><span class="num">${F.dec(r.payment.change).replace(".", ",")}</span></div>`
        : `<div class="rw"><span>Tarjeta</span><span class="num">${F.dec(r.total).replace(".", ",")}</span></div>`}
      <div>IVA incluido</div>
      <div class="qr">${F.qrSvg(F.qrUrl(r))}</div>
      <div class="c">${vf.enabled ? '<span class="vf">VERI*FACTU</span><br>' : ""}Factura verificable en la sede<br>electrónica de la AEAT</div>
      ${vf.env !== "produccion" || !vf.enabled ? `<div class="test">MODO PRUEBA · SIN VALIDEZ FISCAL</div>` : ""}
      <div class="c small">Huella ${r.hash.slice(0, 16)}…</div>
      <hr>
      <div class="c">¡Gracias por venir a Luma!<br>Sin reservas, entra cuando quieras.<br>Instagram @lumabrunch</div>
    </div>`;
  }
  function showReceipt(r, fresh) {
    const void_ = F.rectifiedBy(r.id);
    const html = `${head(fresh ? t("paid") : t("receipt") + " " + r.id)}<div class="bd"><div class="receipt-stage">
      ${receiptHtml(r)}
      <div class="r-side">
        ${fresh ? `<div class="ok-badge">${I.ok}${esc(t("paid"))} · <span class="num">${money(r.total)}</span></div>
          ${r.payment.method === "cash" ? `<div class="pay-total" style="background:var(--gold);color:var(--green-ink)"><small style="color:var(--green-ink)">${esc(t("change"))}</small><b class="num">${money(r.payment.change)}</b></div>` : ""}` : ""}
        <dl class="kv">
          <dt>${esc(t("rec_no"))}</dt><dd>${esc(r.id)} · ${r.type}</dd>
          <dt>${esc(t("staff"))}</dt><dd>${esc(r.staff.name)}</dd>
          <dt>${esc(t("rec_state"))}</dt><dd><span class="state pend">${esc(t("st_pending"))}</span></dd>
          ${void_ ? `<dt>${esc(t("st_void"))}</dt><dd><span class="state void">${esc(void_.id)}</span></dd>` : ""}
          <dt>${esc(t("rec_hash"))}</dt><dd class="mono">${r.hash}</dd>
          <dt>${esc(t("rec_prev"))}</dt><dd class="mono">${r.prevHash || "—"}</dd>
        </dl>
        <div class="row-btns"><button class="big-btn btn-line" data-act="xml" data-kind="ubl" data-id="${esc(r.id)}">${I.doc}${esc(t("show_ubl"))}</button>
          <button class="big-btn btn-line" data-act="xml" data-kind="vf" data-id="${esc(r.id)}">${I.doc}${esc(t("show_vf"))}</button></div>
        <button class="big-btn btn-ghost" disabled title="${esc(t("print_off"))}">${esc(t("print_off"))}</button>
        ${!fresh && !r.rectifies && !void_ && perm("rectify") ? `<button class="big-btn btn-bad" data-act="rectify" data-id="${esc(r.id)}">${esc(t("rectify"))}</button>` : ""}
        <button class="big-btn btn-green" data-act="close">${esc(t("new_sale"))}</button>
      </div></div></div>`;
    modal(html, "wide");
  }
  function rectifySheet(id) {
    const r = db.get("records", id);
    modal(`${head(t("rectify"))}<div class="bd"><p style="margin:0">${esc(t("rectify_q"))}</p>
      <dl class="kv"><dt>${esc(t("rec_no"))}</dt><dd>${esc(r.id)}</dd><dt>${esc(t("amount"))}</dt><dd class="num">${money(r.total)}</dd></dl>
      <div class="field"><label for="rreason">${esc(t("rectify_reason"))}</label><input id="rreason" maxlength="80"></div>
      <div class="row-btns"><button class="big-btn btn-ghost" data-act="close">${esc(t("cancel"))}</button><button class="big-btn btn-bad" data-act="dorectify" data-id="${esc(id)}">${esc(t("rectify_go"))}</button></div></div>`);
  }
  function exportSheet(title, text) {
    modal(`${head(title)}<div class="bd"><p class="note-box" style="margin:0">${esc(t("exp_note"))}</p>
      <div class="field"><textarea id="exptext" readonly rows="16">${esc(text)}</textarea></div>
      <button class="big-btn btn-green" data-act="copy">${esc(t("copy"))}</button></div>`, "wide");
  }

  /* ================= RAPPORTEN ================= */
  function periodOf() {
    const d = new Date(S.rep.date); d.setHours(0, 0, 0, 0);
    if (S.rep.mode === "day") { const e = new Date(d); e.setDate(e.getDate() + 1); return { from: d, to: e, days: [new Date(d)] }; }
    const dow = (d.getDay() + 6) % 7; const from = new Date(d); from.setDate(d.getDate() - dow);
    const to = new Date(from); to.setDate(from.getDate() + 7);
    const days = []; for (let i = 0; i < 7; i++) { const x = new Date(from); x.setDate(from.getDate() + i); days.push(x); }
    return { from, to, days };
  }
  function weekNo(d) { const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const n = x.getUTCDay() || 7; x.setUTCDate(x.getUTCDate() + 4 - n); const y = new Date(Date.UTC(x.getUTCFullYear(), 0, 1)); return Math.ceil(((x - y) / 864e5 + 1) / 7); }
  function stats(recs) {
    const s = { total: 0, tickets: 0, cash: 0, card: 0, rect: 0, rectN: 0, staff: {}, vat: {}, prod: {} };
    for (const r of recs) {
      s.total += r.total;
      if (r.type === "F2") s.tickets++; else { s.rect += r.total; s.rectN++; }
      s[r.payment.method === "cash" ? "cash" : "card"] += r.total;
      const st = s.staff[r.staff.id] || (s.staff[r.staff.id] = { name: r.staff.name, n: 0, total: 0, cash: 0, card: 0 });
      if (r.type === "F2") st.n++; st.total += r.total; st[r.payment.method === "cash" ? "cash" : "card"] += r.total;
      for (const x of r.taxes) { const v = s.vat[x.rate] || (s.vat[x.rate] = { base: 0, cuota: 0, gross: 0 }); v.base += x.base; v.cuota += x.cuota; v.gross += x.gross; }
      for (const l of r.lines) { const k = l.name[0] + (l.size ? " (" + l.size.t[0] + ")" : ""); const p = s.prod[k] || (s.prod[k] = { name: l.name, size: l.size, qty: 0, total: 0 }); p.qty += l.qty; p.total += l.total; }
    }
    return s;
  }
  function reportsHtml() {
    if (S.rep.mode === "week" && !perm("week")) S.rep.mode = "day";
    const { from, to, days } = periodOf();
    const recs = db.all("records").filter((r) => { const d = new Date(r.issuedAt); return d >= from && d < to; }).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
    const s = stats(recs);
    const isToday = F.dayKey(from) === F.dayKey(new Date());
    const fmtD = (d, o) => d.toLocaleDateString(LOCALE[lang], o);
    const label = S.rep.mode === "day"
      ? (isToday ? t("today") + " · " : "") + fmtD(from, { weekday: "long", day: "numeric", month: "long" })
      : `${t("week")} ${weekNo(from)} · ${fmtD(days[0], { day: "numeric", month: "short" })} – ${fmtD(days[6], { day: "numeric", month: "short" })}`;
    const closing = S.rep.mode === "day" ? db.get("closings", F.dayKey(from)) : null;
    const chain = F.verifyChain();
    const staffRows = Object.values(s.staff).sort((a, b) => b.total - a.total);
    const prodRows = Object.values(s.prod).filter((p) => p.qty > 0).sort((a, b) => b.qty - a.qty).slice(0, 10);
    const maxQ = prodRows.length ? prodRows[0].qty : 1;
    let bars = "";
    if (S.rep.mode === "week") {
      const per = days.map((d) => recs.filter((r) => r.day === F.dayKey(d)).reduce((a, r) => a + r.total, 0));
      const mx = Math.max(1, ...per);
      bars = `<div class="card span7"><h4>${esc(t("by_day"))}<small>${esc(t("k_sales"))}</small></h4>
        <div class="bars">${per.map((v, i) => `<div class="bar ${F.dayKey(days[i]) === F.dayKey(new Date()) ? "today" : ""}"><b class="num">${v ? money(v).replace(/[,.]00(?=\s?€|$)/, "") : days[i].getDay() === 0 ? "—" : ""}</b><i style="height:${(v / mx) * 100}%"></i></div>`).join("")}</div>
        <div class="bars-x">${days.map((d) => `<span>${esc(fmtD(d, { weekday: "short", day: "numeric" }))}</span>`).join("")}</div></div>`;
    }
    const kpi = (k, v, cls = "", em = "") => `<div class="kpi ${cls}"><small>${esc(t(k))}</small><b class="num">${v}</b>${em ? `<em>${em}</em>` : ""}</div>`;
    return `<section class="view reports">
      <div class="rep-head">
        <h2>${esc(t("rep_t"))}</h2>
        <div class="zones" role="group"><button data-act="rmode" data-m="day" aria-pressed="${S.rep.mode === "day"}">${esc(t("day"))}</button>
          <button data-act="rmode" data-m="week" aria-pressed="${S.rep.mode === "week"}" ${perm("week") ? "" : `disabled title="${esc(t("no_week"))}"`}>${perm("week") ? "" : I.lock}${esc(t("week"))}</button></div>
        <div class="datenav"><button data-act="rnav" data-d="-1" aria-label="◀">${I.left}</button><span class="lbl">${esc(label)}</span><button data-act="rnav" data-d="1" aria-label="▶">${I.right}</button>
          ${isToday ? "" : `<button data-act="rtoday" style="width:auto;padding:0 14px;font-weight:800">${esc(t("today"))}</button>`}</div>
        <div class="acts">
          <button class="btn-line" data-act="exp" data-kind="csv">${I.doc}${esc(t("exp_csv"))}</button>
          <button class="btn-line" data-act="exp" data-kind="vf">${I.doc}${esc(t("exp_vf"))}</button>
          ${S.rep.mode === "day" && perm("close") && !closing ? `<button class="btn-gold" data-act="closeday">${I.lock}${esc(t("close_day"))}</button>` : ""}
        </div>
      </div>
      <div class="rep-body">
        ${S.rep.mode === "day" ? (closing
          ? `<div class="closed-banner">${I.lock}${esc(t("z_done", { t: hhmm(closing.at), n: closing.by, d: (closing.diff > 0 ? "+" : "") + money(closing.diff) }))}</div>`
          : `<div class="closed-banner open">${esc(t("x_open"))}</div>`) : ""}
        ${kpi("k_sales", money(s.total), "main", esc(t("vat_incl")))}
        ${kpi("k_tickets", s.tickets)}
        ${kpi("k_avg", s.tickets ? money(Math.round((s.total - s.rect) / s.tickets)) : "—")}
        ${kpi("k_card", money(s.card), "", s.total ? Math.round((s.card / s.total) * 100) + "%" : "")}
        ${kpi("k_cash", money(s.cash), "", s.total ? Math.round((s.cash / s.total) * 100) + "%" : "")}
        ${kpi("k_rect", s.rectN ? money(s.rect) : "0", "", s.rectN ? s.rectN + "×" : "")}
        ${bars}
        <div class="card ${S.rep.mode === "week" ? "span5" : "span7"}"><h4>${esc(t("by_staff"))}</h4><div class="tbl-wrap"><table class="t num">
          <thead><tr><th>${esc(t("staff"))}</th><th class="r">${esc(t("n"))}</th><th class="r">${esc(t("k_card"))}</th><th class="r">${esc(t("k_cash"))}</th><th class="r">${esc(t("amount"))}</th></tr></thead>
          <tbody>${staffRows.map((x) => `<tr><td><b>${esc(x.name)}</b></td><td class="r">${x.n}</td><td class="r">${money(x.card)}</td><td class="r">${money(x.cash)}</td><td class="r"><b>${money(x.total)}</b></td></tr>`).join("") || `<tr><td colspan="5" class="empty-note">${esc(t("no_data"))}</td></tr>`}</tbody>
          ${staffRows.length ? `<tfoot><tr><td>${esc(t("total"))}</td><td class="r">${s.tickets}</td><td class="r">${money(s.card)}</td><td class="r">${money(s.cash)}</td><td class="r">${money(s.total)}</td></tr></tfoot>` : ""}</table></div></div>
        <div class="card ${S.rep.mode === "week" ? "span6" : "span5"}"><h4>${esc(t("by_vat"))}</h4><div class="tbl-wrap"><table class="t num">
          <thead><tr><th>${esc(t("rate"))}</th><th class="r">${esc(t("base"))}</th><th class="r">${esc(t("cuota"))}</th><th class="r">${esc(t("total"))}</th></tr></thead>
          <tbody>${Object.entries(s.vat).map(([k, v]) => `<tr><td>${k}%</td><td class="r">${money(v.base)}</td><td class="r">${money(v.cuota)}</td><td class="r"><b>${money(v.gross)}</b></td></tr>`).join("") || `<tr><td colspan="4" class="empty-note">${esc(t("no_data"))}</td></tr>`}</tbody></table></div>
          <p class="note-box" style="margin:0">${chain.ok ? "✓ " + esc(t("chain_ok", { n: chain.count })) : "⚠ " + esc(t("chain_bad", { n: chain.bad.length }))}</p></div>
        <div class="card ${S.rep.mode === "week" ? "span6" : "span4"}"><h4>${esc(t("top"))}</h4>${prodRows.map((p) => `<div style="display:grid;grid-template-columns:1fr auto auto;gap:4px 12px;align-items:center">
            <span style="font-weight:700;font-size:14px">${esc(tr(p.name))}${p.size ? ` <small style="color:var(--muted)">(${esc(tr(p.size.t))})</small>` : ""}</span><span class="num" style="color:var(--muted);font-size:13px">${money(p.total)}</span><b class="num">${p.qty}×</b>
            <div class="meter" style="grid-column:1/-1"><i style="width:${(p.qty / maxQ) * 100}%"></i></div></div>`).join("") || `<div class="empty-note">${esc(t("no_data"))}</div>`}</div>
        <div class="card ${S.rep.mode === "week" ? "span12" : "span8"}" style="align-self:start"><h4>${esc(t("trans"))}<small>${recs.length}</small></h4><div class="tbl-wrap"><table class="t num">
          <thead><tr><th>${esc(t("time"))}</th><th>${esc(t("nr"))}</th><th>${esc(t("where"))}</th><th>${esc(t("staff"))}</th><th>${esc(t("method"))}</th><th class="r">${esc(t("amount"))}</th><th></th></tr></thead>
          <tbody>${recs.slice(0, 300).map((r) => {
            const v = F.rectifiedBy(r.id);
            return `<tr class="click" data-act="showrec" data-id="${esc(r.id)}"><td>${S.rep.mode === "week" ? esc(fmtD(new Date(r.issuedAt), { weekday: "short" })) + " " : ""}${hhmm(r.issuedAt)}</td><td>${esc(r.id)}</td>
              <td>${r.table ? esc(r.table.takeaway ? t("takeaway") : t("table") + " " + r.table.label) : "—"}</td><td>${esc(r.staff.name)}</td><td>${esc(r.payment.method === "cash" ? t("cash") : t("card"))}</td>
              <td class="r"><b>${money(r.total)}</b></td><td>${r.type === "R5" ? `<span class="state void">R5 → ${esc(r.rectifies.id)}</span>` : v ? `<span class="state void">${esc(t("st_void"))} ${esc(v.id)}</span>` : `<span class="state pend">${esc(t("st_pending"))}</span>`}</td></tr>`;
          }).join("") || `<tr><td colspan="7" class="empty-note">${esc(t("no_data"))}</td></tr>`}</tbody></table></div></div>
        <div class="span12" style="display:flex;justify-content:flex-end"><button class="big-btn btn-ghost" data-act="reset" style="height:44px;font-size:14px">${esc(t("reset"))}</button></div>
      </div></section>`;
  }
  function closeDaySheet() {
    const { from, to } = periodOf();
    const recs = db.all("records").filter((r) => { const d = new Date(r.issuedAt); return d >= from && d < to; });
    const cash = recs.filter((r) => r.payment.method === "cash").reduce((a, r) => a + r.total, 0);
    const float = Math.round(CFG.openingFloat * 100), exp = float + cash;
    S.close = { day: F.dayKey(from), cash, float, exp, counted: "" };
    renderClose();
  }
  function renderClose() {
    const c = S.close, counted = c.counted ? Math.round(parseFloat(c.counted.replace(",", ".")) * 100) : null;
    const diff = counted == null ? null : counted - c.exp;
    const html = `${head(t("close_t"))}<div class="bd"><div class="pay-grid">
      <dl class="kv" style="font-size:16px;align-content:start">
        <dt>${esc(t("float"))}</dt><dd class="num">${money(c.float)}</dd>
        <dt>${esc(t("cash_sales"))}</dt><dd class="num">${money(c.cash)}</dd>
        <dt>${esc(t("expected"))}</dt><dd class="num" style="font-size:20px">${money(c.exp)}</dd>
        <dt>${esc(t("counted"))}</dt><dd class="num" style="font-size:20px">${counted == null ? "—" : money(counted)}</dd>
        <dt>${esc(t("diff"))}</dt><dd class="num" style="font-size:20px;color:${diff == null ? "inherit" : diff === 0 ? "var(--ok)" : "var(--bad)"}">${diff == null ? "—" : (diff > 0 ? "+" : "") + money(diff)}</dd>
      </dl>
      <div class="cash-box">
        <div class="pad wide">${["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "⌫"].map((d) => `<button class="${d === "⌫" || d === "," ? "fn" : ""}" data-act="closed" data-d="${d}">${d}</button>`).join("")}</div>
        <button class="big-btn btn-gold" style="height:62px" data-act="doclose" ${counted == null ? "disabled" : ""}>${I.lock}${esc(t("close_go"))}</button>
      </div></div></div>`;
    const m = $("#modal"); if (m) m.querySelector(".sheet").innerHTML = html; else modal(html, "wide");
  }
  function numEntry(cur, d) {
    if (d === "⌫") return cur.slice(0, -1);
    if (d === ",") return cur.includes(",") ? cur : (cur || "0") + ",";
    if (cur.includes(",") && cur.split(",")[1].length >= 2) return cur;
    if (cur.replace(",", "").length >= 7) return cur;
    return cur === "0" ? d : cur + d;
  }
  function exportText(kind) {
    const { from, to } = periodOf();
    const recs = db.all("records").filter((r) => { const d = new Date(r.issuedAt); return d >= from && d < to; }).sort((a, b) => a.issuedAt.localeCompare(b.issuedAt));
    if (kind === "csv") {
      const rows = [["numero", "tipo", "fecha", "hora", "mesa", "empleado", "pago", "base", "iva", "total", "rectifica", "huella"]];
      recs.forEach((r) => rows.push([r.id, r.type, r.dateEs, hhmm(r.issuedAt), r.table ? r.table.label : "", r.staff.name, r.payment.method === "cash" ? "efectivo" : "tarjeta",
        F.dec(r.total - r.cuotaTotal), F.dec(r.cuotaTotal), F.dec(r.total), r.rectifies ? r.rectifies.id : "", r.hash]));
      return rows.map((x) => x.map((v) => /[;"\n]/.test(v) ? '"' + String(v).replace(/"/g, '""') + '"' : v).join(";")).join("\n");
    }
    return `<?xml version="1.0" encoding="UTF-8"?>\n<!-- ${recs.length} registros · ${F.dayKey(from)} – ${F.dayKey(new Date(to - 1))} -->\n<RegistroFactura>\n` + recs.map((r) => F.verifactuXml(r)).join("\n") + `\n</RegistroFactura>`;
  }

  /* ================= EVENTS ================= */
  const A = {
    lang: (el) => { lang = el.dataset.l; try { localStorage.setItem("luma-kassa-lang", lang); } catch (e) {} document.documentElement.lang = lang; S.user ? renderApp() : renderLogin(); },
    pick: (el) => { loginSel = el.dataset.id; pin = ""; document.querySelectorAll(".staff-btn").forEach((b) => b.setAttribute("aria-pressed", b.dataset.id === loginSel)); updateDots(); $("#pinmsg").textContent = ""; },
    pin: (el) => pinInput(el.dataset.d),
    pinclr: () => { pin = ""; updateDots(); },
    pinback: () => { pin = pin.slice(0, -1); updateDots(); },
    logout,
    view: (el) => go(el.dataset.v),
    zone: (el) => { S.zone = el.dataset.z; S.editSel = null; renderView(); },
    table: (el) => { if (S.editing) { S.editSel = el.dataset.id; renderView(); } else openTable(el.dataset.id); },
    open: (el) => openOrder(orderFor(el.dataset.id)),
    takeaway: newTakeaway,
    edit: () => { S.editing = true; S.editSel = null; renderView(); },
    editdone: () => { S.editing = false; S.editSel = null; renderView(); },
    addtbl: (el) => {
      const L = layout().map((x) => ({ ...x }));
      let n = L.length + 1; while (L.some((x) => x.id === String(n))) n++;
      const round = el.dataset.shape === "round";
      L.push({ id: String(n), zone: S.zone, x: 50, y: 45, w: round ? 112 : 130, h: round ? 112 : 100, seats: round ? 2 : 4, shape: round ? "round" : "sq" });
      db.kv("layout", L); S.editSel = String(n); renderView();
    },
    seats: (el) => editTable((tb) => { tb.seats = Math.max(1, Math.min(12, tb.seats + +el.dataset.d)); const g = tb.shape === "round" ? 86 + tb.seats * 8 : 90 + tb.seats * 18; tb.w = tb.shape === "round" ? Math.min(150, g) : Math.min(240, g); tb.h = tb.shape === "round" ? tb.w : Math.min(110, 80 + tb.seats * 4); }),
    renametbl: () => {
      const tb = tableById(S.editSel); if (!tb) return;
      modal(`${head(t("rename"))}<div class="bd"><div class="field"><label for="tname">${esc(t("table"))}</label><input id="tname" value="${esc(tb.id)}" maxlength="4"></div>
        <div class="row-btns"><button class="big-btn btn-ghost" data-act="close">${esc(t("cancel"))}</button><button class="big-btn btn-green" data-act="dorename">${esc(t("save"))}</button></div></div>`);
      setTimeout(() => $("#tname") && $("#tname").select(), 30);
    },
    dorename: () => {
      const v = ($("#tname").value || "").trim().toUpperCase(); if (!v) return;
      if (orderFor(S.editSel)) { toast(t("cant_delete")); return; }
      if (layout().some((x) => x.id === v && x.id !== S.editSel)) return;
      editTable((tb) => { tb.id = v; }); S.editSel = v; closeModal(); renderView();
    },
    deltbl: () => { if (orderFor(S.editSel)) { toast(t("cant_delete")); return; } const L = layout().filter((x) => x.id !== S.editSel); db.kv("layout", L); S.editSel = null; renderView(); },
    cat: (el) => { S.cat = el.dataset.c; S.q = ""; renderView(); },
    add: (el) => { const p = prodByKey(el.dataset.k); if (p.sizes) sizeSheet(p); else addProduct(p); },
    size: (el) => { const p = prodByKey(el.dataset.k); closeModal(); addProduct(p, p.sizes.find((s) => s.id === el.dataset.s)); },
    selline: (el, e) => { if (e.target.closest(".line-actions")) return; S.sel = S.sel === el.dataset.id ? null : el.dataset.id; renderView(); },
    qty: (el) => { const l = curLine(); if (!l) return; l.qty += +el.dataset.d; if (l.qty <= 0) return A.rmline(); saveOrder(S.current); renderView(); },
    rmline: () => {
      const o = S.current, l = curLine(); if (!l) return;
      o.lines = o.lines.filter((x) => x !== l); S.sel = null;
      db.log("line_removed", { order: o.id, item: l.name[0], qty: l.qty });
      if (!o.lines.length) { if (orderFor(o.id)) db.del("orders", o.id); } else saveOrder(o);
      renderView();
    },
    extras: extrasSheet,
    togextra: (el) => {
      const l = curLine(); const e = CFG.extras[CFG.extrasForCat[l.cat]].find((x) => x.id === el.dataset.e);
      if (l.extras.some((x) => x.id === e.id)) l.extras = l.extras.filter((x) => x.id !== e.id); else l.extras.push({ id: e.id, t: e.t, p: Math.round(e.p * 100) });
      el.setAttribute("aria-pressed", l.extras.some((x) => x.id === e.id)); saveOrder(S.current); renderView();
    },
    note: noteSheet,
    quicknote: (el) => { const i = $("#notein"); i.value = i.value ? i.value + ", " + el.dataset.v.toLowerCase() : el.dataset.v; },
    savenote: () => { const l = curLine(); l.note = $("#notein").value.trim(); saveOrder(S.current); closeModal(); renderView(); },
    back: () => { S.current = null; go("floor"); },
    move: moveSheet,
    moveto: (el) => moveTo(el.dataset.id),
    pay: paySheet,
    pmeth: (el) => { P.method = el.dataset.m; renderPay(); },
    cashd: (el) => { P.given = numEntry(P.given, el.dataset.d); renderPay(); },
    cashq: (el) => { P.given = F.dec(+el.dataset.v).replace(".", ","); renderPay(); },
    confirmpay: confirmPay,
    close: closeModal,
    xml: (el) => { const r = db.get("records", el.dataset.id); exportSheet(el.dataset.kind === "ubl" ? "UBL 2.1 · " + r.id : "Verifactu · " + r.id, el.dataset.kind === "ubl" ? F.ubl(r) : F.verifactuXml(r)); },
    rectify: (el) => rectifySheet(el.dataset.id),
    dorectify: async (el) => {
      const r = db.get("records", el.dataset.id); if (F.rectifiedBy(r.id)) return;
      const rr = await F.rectify(r, S.user, ($("#rreason").value || "").trim());
      db.log("rectify", { record: r.id, by: rr.id }); closeModal(); toast(t("rectified") + ": " + rr.id); renderTop(); renderView();
    },
    copy: async () => { const ta = $("#exptext"); try { await navigator.clipboard.writeText(ta.value); toast(t("copied")); } catch (e) { ta.focus(); ta.select(); } },
    rmode: (el) => { S.rep.mode = el.dataset.m; renderView(); },
    rnav: (el) => { const d = new Date(S.rep.date); d.setDate(d.getDate() + (S.rep.mode === "week" ? 7 : 1) * +el.dataset.d); S.rep.date = d; renderView(); },
    rtoday: () => { S.rep.date = new Date(); renderView(); },
    showrec: (el) => showReceipt(db.get("records", el.dataset.id), false),
    exp: (el) => exportSheet(el.dataset.kind === "csv" ? t("exp_csv") : t("exp_vf"), exportText(el.dataset.kind)),
    closeday: closeDaySheet,
    closed: (el) => { S.close.counted = numEntry(S.close.counted, el.dataset.d); renderClose(); },
    doclose: () => {
      const c = S.close, counted = Math.round(parseFloat(c.counted.replace(",", ".")) * 100);
      const row = { id: c.day, at: new Date().toISOString(), by: S.user.name, byId: S.user.id, float: c.float, cashSales: c.cash, expected: c.exp, counted, diff: counted - c.exp, lastRecord: db.kv("vf:lastId"), lastHash: db.kv("vf:lastHash") };
      db.put("closings", row); db.enqueue("closing", { id: row.id }); db.log("close_day", { day: row.id });
      closeModal(); toast(t("closed_ok")); renderTop(); renderView();
    },
    reset: () => {
      modal(`${head(t("reset"))}<div class="bd"><p style="margin:0">${esc(t("reset_q"))}</p><div class="row-btns"><button class="big-btn btn-ghost" data-act="close">${esc(t("no"))}</button><button class="big-btn btn-bad" data-act="doreset">${esc(t("yes"))}</button></div></div>`);
    },
    doreset: async () => { closeModal(); await db.wipe(); await LK.seed(); renderApp(); }
  };
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]"); if (!el || el.disabled) return;
    const fn = A[el.dataset.act]; if (fn) fn(el, e);
  });
  document.addEventListener("input", (e) => {
    if (e.target.id === "q") {
      S.q = e.target.value; const pos = e.target.selectionStart;
      renderView(); const q = $("#q"); q.focus(); try { q.setSelectionRange(pos, pos); } catch (x) {}
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
    if (!S.user && /^[0-9]$/.test(e.key) && !$("#login").hidden) pinInput(e.key);
    if (e.key === "Enter" && e.target.classList && e.target.classList.contains("line")) e.target.click();
  });
  LK.sync.on(() => S.user && renderTop());
  setInterval(() => {
    const c = $("#clock"); if (c) c.textContent = hhmm(new Date());
    if (S.user && S.view === "floor" && !S.editing && !$("#modal")) renderView();   // tijden op tafels bijwerken
  }, 30000);

  /* ================= START ================= */
  LK.start = async function () {
    await db.init();
    if (!db.kv("seeded")) await LK.seed();
    try { const id = sessionStorage.getItem("luma-kassa-user"); const s = id && staffById(id); if (s) { S.user = s; return renderApp(); } } catch (e) {}
    renderLogin();
  };
  LK.ui = { renderApp };
})();
