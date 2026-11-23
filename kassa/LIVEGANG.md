# LUMA Kassa – wat er moet gebeuren vóór echt gebruik

De kassa in `/kassa/` is een **testversie**: alleen de voorkant, met voorbeelddata, zonder server en zonder koppeling met de AEAT.
Hij staat nu in de openbare website-repo en is via GitHub Pages bereikbaar (wel met `noindex`). Deze lijst houdt bij wat eruit of anders moet om hem veilig live te zetten.

## 1. Uit de openbare code halen
- [ ] **Pincodes** staan in `js/config.js` (`staff[].pin`). Weg uit de code: medewerkers en gehashte pincodes in Supabase (tabel `staff`), inloggen via een Edge Function die een sessie-token teruggeeft.
- [ ] **Medewerkerslijst, rollen en rechten** (`staff`, `can`) naar Supabase; de eigenaar beheert ze in een beheerscherm.
- [ ] **Bedrijfsgegevens** (`business`: razón social, NIF) invullen en uit de code naar instellingen in de database.
- [ ] **Voorbeelddata**: `js/seed.js` en de knop "Demo opnieuw" (Rapporten) verwijderen. De demo-pincodes op het inlogscherm (`pin_demo` in `js/i18n.js`) weghalen.
- [ ] **Testbanner** ("Modo prueba") en `MODO PRUEBA · SIN VALIDEZ FISCAL` op de bon pas weghalen als Verifactu echt aan staat.

## 2. Hosting en toegang
- [ ] De kassa niet meer vanaf de openbare GitHub Pages serveren. Opties: privé-repo + Cloudflare Pages / Netlify met toegangsbeveiliging (bijv. Cloudflare Access), of een eigen subdomein zoals `kassa.luma-brunch.es` (domein alleen met akkoord van Rick).
- [ ] Toestel-koppeling: alleen geregistreerde tablets (en de telefoon van de eigenaar) mogen inloggen. Bijv. een eenmalige koppelcode per toestel, opgeslagen als device-token.
- [ ] Automatisch uitloggen na X minuten zonder gebruik (nu blijft een medewerker ingelogd tot "Uitloggen" of tot de tab sluit).

## 3. Database en sync (Supabase)
- [ ] Tabellen: `staff`, `devices`, `tables_layout`, `menu_items` (prijzen, btw-tarief, actief), `orders` (open rekeningen), `records` (fiscale registros, **append-only**: geen UPDATE/DELETE via RLS), `closings`, `audit_log`.
- [ ] `js/store.js` → `LK.sync.flush()` invullen: outbox in batches naar een Edge Function `/sync`, server bevestigt per item, status → `sent`. Bij geen verbinding blijft alles lokaal (IndexedDB) en gaat later.
- [ ] Open rekeningen live delen tussen tablets (Supabase Realtime), zodat twee kassa's dezelfde tafel zien.
- [ ] Eigenaar op afstand: rapporten lezen uit Supabase i.p.v. uit de lokale tablet (nu ziet elke tablet alleen zijn eigen data).
- [ ] Nummering: nu één reeks per tablet (`T2026-000001`). Bij meerdere tablets een eigen reeks per toestel (bijv. `T1-2026-…`, `T2-2026-…`) of uitgifte via de server, zodat nummers nooit dubbel zijn.
- [ ] Menukaart: nu gelezen uit `../assets/menu.js` (de website). Later één bron in Supabase waar zowel website als kassa uit lezen.

## 4. Verifactu / AEAT
- [ ] Kassasoftware moet voldoen aan RD 1007/2023 + Orden HAC/1177/2024. Uiterste datum voor bedrijven onder vennootschapsbelasting 1-1-2027 (zelfstandigen 1-7-2027) — controleer actuele data.
- [ ] Kiezen: **VERI*FACTU** (elk registro direct naar de AEAT, aanbevolen) of "no verifactu" (dan extra eisen: elektronische handtekening, event-log). De code is voorbereid op VERI*FACTU.
- [ ] Elektronisch certificaat (van het bedrijf of een vertegenwoordiger) op de server, **nooit** op de tablet.
- [ ] Server-functie die `RegistroAlta`-XML (zie `fiscal.js → verifactuXml`) in een SOAP-envelop naar de AEAT stuurt, eerst naar de testomgeving (`prewww1.aeat.es`), CSV-antwoord opslaan, status per bon bijwerken.
- [ ] Huella-keten is al conform (SHA-256, getest met het voorbeeld van de AEAT). Bij meerdere toestellen: keten per toestel/reeks of centraal op de server.
- [ ] `verifactu.enabled = true` en `env = "produccion"` pas na geslaagde tests. Dan staat "VERI*FACTU" + QR op de bon.
- [ ] Declaración responsable van de softwareproducent (verplicht voor elk kassasysteem).
- [ ] Er komt **geen** functie om verkopen buiten de registratie te houden ("X-toets"). Dat is onder Verifactu expliciet verboden (art. 29.2.j LGT, boete tot € 50.000 per boekjaar voor de gebruiker en € 150.000 voor de softwaremaker).

## 5. Btw en bon
- [ ] Btw-tarieven per product bevestigen (nu alles 10 %). Alcohol 21 %; eventueel andere uitzonderingen in `vat.byCategory` / `vat.byItem`.
- [ ] Facturas completas (met klant-NIF) als een zakelijke klant erom vraagt: nu niet gebouwd.
- [ ] Thermische printer (80 mm): ESC/POS via een print-bridge of een printer met netwerk-API; `@media print` staat al klaar voor de bon.
- [ ] Pinautomaat: nu handmatig "Betaling ontvangen". Later eventueel koppelen (bijv. SumUp/Stripe Terminal), zodat het bedrag automatisch op de terminal staat.

## 6. Overig
- [ ] Gedeeltelijk afrekenen / rekening splitsen (nog niet gebouwd).
- [ ] Kortingen en gratis items (met reden, gelogd).
- [ ] Back-up/export voor de gestor (CSV en Verifactu-XML zitten er al in als voorbeeld).
- [ ] Service worker: `VERSION` in `sw.js` verhogen bij elke release.
