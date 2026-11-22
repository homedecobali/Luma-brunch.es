# Luma Brunch – website

Statische website voor **Luma Brunch**, C. Aneto, Local 13, 03178 Benijófar (Alicante).

- `index.html` – de hele site (ES / EN / NL, taalkeuze rechtsboven, onthouden per bezoeker)
- `menu/` – mobiele menukaart voor de QR-code op tafel (taal volgt de telefoon, met taalwissel; foto per gerecht via `ITEM_PHOTOS` en per categorie via `CAT_PHOTOS` in `menu/index.html`)
- `assets/menu.js` – de volledige kaart (107 items, drie talen, met labels vegan / vegetarisch / eiwitrijk / favoriet)
- `assets/img/` – logo, beeldmerk, neonfoto, favicon
- `assets/img/fotos/` – eigen foto's van Luma, elk in een grote (`naam.jpg`) en kleine versie (`naam-s.jpg`). Welke foto bij welke favoriet en menucategorie hoort staat in `PHOTOS` en `CAT_PHOTOS` in `index.html`.
- Schoolbord ("Hoy en la pizarra"): pas de lijst `BOARD` in `index.html` aan met Spaanse namen uit `menu.js`; naam en prijs komen automatisch uit de kaart.

Geen build-stap en geen framework: elke statische host werkt (GitHub Pages, Netlify, Cloudflare Pages, gewone webhosting).

## Aanpassen

| Wat | Waar |
| --- | --- |
| Prijs of gerecht wijzigen | `assets/menu.js` – één regel per gerecht |
| Gerecht als favoriet tonen | label `fav` toevoegen in `assets/menu.js` (max. 6 worden getoond) |
| WhatsApp-knop aanzetten | `index.html`, constante `WHATSAPP` (bijv. `"34600000000"`) |
| Openingstijden | `index.html`, constante `OPEN` (en de JSON-LD bovenin) |
| Teksten per taal | `index.html`, object `T` (es / en / nl) |

Kaartgegevens overgenomen van de huidige luma-brunch.es (november 2026).
