/* LUMA Kassa – lokale opslag (offline-first).
   Alles wordt eerst lokaal in IndexedDB bewaard, zodat de kassa zonder internet blijft werken.
   Elke wijziging komt ook in de "outbox": die wordt later naar de server gestuurd (sync).
   Nu is er nog geen server: items blijven in de wachtrij staan.

   Stores:
     kv       – instellingen, tellers, plattegrond, laatste Verifactu-hash
     orders   – open bestellingen per tafel (nog geen fiscaal document)
     records  – fiscale registros (facturas simplificadas + rectificativas). Nooit wijzigen of wissen.
     closings – dag-afsluitingen (Z) met kastelling
     outbox   – wachtrij voor sync naar server / AEAT
     audit    – logboek (inloggen, regels verwijderd, enz.) */
(function () {
  const DB_NAME = "luma-kassa", DB_VER = 1;
  const STORES = { kv: "k", orders: "id", records: "id", closings: "id", outbox: "seq", audit: "seq" };
  let idb = null;
  const mem = {};               // in-memory kopie; ook fallback als IndexedDB ontbreekt
  for (const s in STORES) mem[s] = new Map();

  function open() {
    return new Promise((resolve) => {
      let req;
      try { req = indexedDB.open(DB_NAME, DB_VER); } catch (e) { return resolve(null); }
      req.onupgradeneeded = () => {
        const db = req.result;
        for (const [name, key] of Object.entries(STORES)) {
          if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: key });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    });
  }
  function tx(store, mode, fn) {
    if (!idb) return Promise.resolve();
    return new Promise((resolve) => {
      try {
        const t = idb.transaction(store, mode);
        const r = fn(t.objectStore(store));
        t.oncomplete = () => resolve(r && r.result);
        t.onerror = t.onabort = () => resolve();
      } catch (e) { resolve(); }
    });
  }

  const db = {
    persistent: false,
    async init() {
      idb = await open();
      db.persistent = !!idb;
      if (idb) {
        for (const s in STORES) {
          const all = await tx(s, "readonly", (os) => os.getAll());
          (all || []).forEach((row) => mem[s].set(row[STORES[s]], row));
        }
      }
      try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
    },
    get(store, key) { return mem[store].get(key); },
    all(store) { return [...mem[store].values()]; },
    put(store, row) {
      mem[store].set(row[STORES[store]], row);
      return tx(store, "readwrite", (os) => os.put(row));
    },
    del(store, key) {
      if (store === "records") throw new Error("Fiscale registros mogen niet verwijderd worden");
      mem[store].delete(key);
      return tx(store, "readwrite", (os) => os.delete(key));
    },
    kv(key, val) {
      if (val === undefined) { const r = mem.kv.get(key); return r ? r.v : undefined; }
      return db.put("kv", { k: key, v: val });
    },
    nextSeq(name) { const n = (db.kv("seq:" + name) || 0) + 1; db.kv("seq:" + name, n); return n; },

    /* Wachtrij voor de server. type: record | order | closing | audit */
    enqueue(type, payload) {
      return db.put("outbox", { seq: db.nextSeq("outbox"), type, payload, at: new Date().toISOString(), tries: 0, status: "pending" });
    },
    pending() { return db.all("outbox").filter((r) => r.status === "pending").length; },
    log(action, data) {
      const row = { seq: db.nextSeq("audit"), at: new Date().toISOString(), user: LK.session && LK.session.user ? LK.session.user.id : null, action, data };
      db.put("audit", row);
      db.enqueue("audit", row);
    },
    async wipe() {
      for (const s in STORES) mem[s].clear();
      if (idb) { idb.close(); idb = null; }
      await new Promise((r) => { try { const q = indexedDB.deleteDatabase(DB_NAME); q.onsuccess = q.onerror = q.onblocked = () => r(); } catch (e) { r(); } });
      await db.init();
    }
  };

  /* Sync-laag. Nog geen backend: transport() is een stub.
     Later: POST /api/sync met de outbox-items, server geeft ids terug, items -> status "sent".
     Verifactu-registros gaan vanaf de server (met certificaat) naar de AEAT. */
  const sync = {
    online: navigator.onLine !== false,
    endpoint: null,          // bijv. "https://kassa.luma-brunch.es/api/sync"
    listeners: new Set(),
    on(fn) { sync.listeners.add(fn); },
    emit() { sync.listeners.forEach((fn) => { try { fn(); } catch (e) {} }); },
    async flush() {
      if (!sync.online || !sync.endpoint) return { sent: 0, reason: !sync.endpoint ? "no-backend" : "offline" };
      // const batch = db.all("outbox").filter(r => r.status === "pending").slice(0, 50);
      // await fetch(sync.endpoint, { method: "POST", body: JSON.stringify(batch) }) ...
      return { sent: 0 };
    }
  };
  window.addEventListener("online", () => { sync.online = true; sync.emit(); sync.flush(); });
  window.addEventListener("offline", () => { sync.online = false; sync.emit(); });

  LK.db = db;
  LK.sync = sync;
})();
