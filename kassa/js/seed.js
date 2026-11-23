/* LUMA Kassa – voorbeelddata voor de testfase: ~8 dagen bonnen, dagafsluitingen en een paar open tafels.
   Wordt alleen gedraaid als de lokale database leeg is. Verwijderen vóór livegang (zie LIVEGANG.md). */
(function () {
  const F = LK.fiscal, db = LK.db, CFG = LK.CONFIG;
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const toC = (s) => Math.round(parseFloat(s.replace(",", ".")) * 100);
  const items = [];
  (window.LUMA_MENU || []).forEach((c) => c.i.forEach((it, idx) => items.push({ key: c.id + ":" + idx, cat: c.id, name: [it[0], it[1], it[2]], unit: toC(it[3]), vat: F.vatFor(c.id, it[0]) })));
  const drinks = items.filter((p) => ["cafes", "iced", "matcha", "tes", "smoothies", "zumos"].includes(p.cat));
  const coffees = items.filter((p) => p.cat === "cafes");
  const food = items.filter((p) => ["tostadas-especiales", "croissants", "brunch", "bowls", "bagels", "dulce", "tostadas", "ensaladas", "sandwiches", "desayuno"].includes(p.cat));

  function basket() {
    const people = 1 + Math.floor(rnd() * 3.4), lines = [];
    const add = (p, extras) => {
      const l = lines.find((x) => x.key === p.key && !extras);
      if (l) l.qty++; else lines.push({ lid: Math.random().toString(36).slice(2, 8), key: p.key, cat: p.cat, name: p.name, unit: p.unit, qty: 1, extras: extras || [], note: "", vat: p.vat, size: null });
    };
    for (let i = 0; i < people; i++) {
      const d = rnd() < 0.55 ? pick(coffees) : pick(drinks);
      add(d, d.cat === "cafes" && rnd() < 0.15 ? [{ id: "oat", t: CFG.extras.coffee[0].t, p: 30 }] : null);
      if (rnd() < 0.75) add(pick(food));
      if (rnd() < 0.2) add(pick(coffees));
    }
    return lines;
  }

  LK.seed = async function () {
    const now = new Date();
    const crews = [["ana", "carlos"], ["lucia", "marta"], ["ana", "javi", "sofia"], ["carlos", "sofia"], ["marta", "javi"], ["ana", "lucia", "carlos"]];
    const tablesIn = CFG.tables.map((x) => x.id);
    for (let back = 8; back >= 0; back--) {
      const day = new Date(now); day.setDate(now.getDate() - back); day.setHours(9, 0, 0, 0);
      if (day.getDay() === 0) continue;                         // zondag dicht
      const crew = crews[(day.getDate() + day.getMonth()) % crews.length].map((id) => CFG.staff.find((s) => s.id === id));
      const isToday = back === 0;
      const end = isToday ? Math.min(now.getTime() - 5 * 60000, new Date(day).setHours(16, 0, 0, 0)) : new Date(day).setHours(15, 55, 0, 0);
      const n = isToday ? Math.max(0, Math.round((end - day.getTime()) / 600000)) : 28 + Math.floor(rnd() * 22);
      const span = new Date(day).setHours(16, 0, 0, 0) - day.getTime();
      const times = [];
      for (let i = 0; i < n; i++) {
        // drukker rond 10:30 en 13:30
        const u = isToday ? rnd() : rnd() < 0.5 ? 0.2 + rnd() * 0.3 : 0.5 + rnd() * 0.45;
        const ts = day.getTime() + 5 * 60000 + u * ((isToday ? end - day.getTime() : span) - 10 * 60000);
        if (ts < end) times.push(ts);
      }
      times.sort((a, b) => a - b);
      const issued = [];
      for (const ts of times) {
        const lines = basket();
        const total = lines.reduce((s, l) => s + F.lineTotal(l), 0);
        const card = rnd() < 0.64;
        let given = total;
        if (!card) { const notes = [500, 1000, 2000, 5000]; given = rnd() < 0.3 ? total : notes.find((x) => x >= total) || Math.ceil(total / 1000) * 1000; }
        const ta = rnd() < 0.18;
        const tid = pick(tablesIn);
        const r = await F.issue({ lines, staff: pick(crew), when: ts,
          table: ta ? { id: "L" + (issued.length + 1), label: "L" + (issued.length + 1), takeaway: true } : { id: tid, label: tid },
          payment: { method: card ? "card" : "cash", given, change: given - total } });
        issued.push(r);
        if (back === 3 && issued.length === 9) {
          const orig = issued[4];
          await F.issue({ lines: orig.lines.map((l) => ({ ...l, qty: -l.qty })), table: orig.table, staff: CFG.staff[1], when: ts + 30000,
            rectifies: { id: orig.id, reason: "Cobrado dos veces" }, payment: { method: orig.payment.method, given: -orig.total, change: 0 } });
        }
      }
      if (!isToday) {
        const recs = db.all("records").filter((r) => r.day === F.dayKey(day));
        const cash = recs.filter((r) => r.payment.method === "cash").reduce((a, r) => a + r.total, 0);
        const exp = CFG.openingFloat * 100 + cash, diff = [0, 0, 0, -50, 0, 120, 0, -20][back % 8];
        const at = new Date(day); at.setHours(16, 10 + back, 0, 0);
        await db.put("closings", { id: F.dayKey(day), at: at.toISOString(), by: crew[0].name, byId: crew[0].id, float: CFG.openingFloat * 100, cashSales: cash, expected: exp, counted: exp + diff, diff, lastRecord: db.kv("vf:lastId"), lastHash: db.kv("vf:lastHash") });
      }
    }
    // open tafels nu
    const open = [["3", 38, "ana"], ["7", 14, "carlos"], ["T2", 92, "ana"], ["T6", 6, "carlos"]];
    for (const [id, mins, st] of open) {
      await db.put("orders", { id, table: { id, label: id }, lines: basket(), openedAt: new Date(now - mins * 60000).toISOString(), staffId: st, updatedAt: now.toISOString() });
    }
    // sync-wachtrij in de demo realistisch klein houden
    db.all("outbox").forEach((r) => { r.status = "sent"; db.put("outbox", r); });
    db.all("records").slice(-3).forEach((r) => db.enqueue("record", { id: r.id }));
    await db.kv("seeded", now.toISOString());
    await db.kv("demoDataVersion", CFG.demoDataVersion);
  };
})();
