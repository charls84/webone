# Referencia técnica de diseño y motion para One Automatización

Fecha: 2026-10-21 · Herramienta: REA 6.7.0 (MCP) + navegador integrado
Uso: **inspiración estructural y de interacción**. Los textos, logos, imágenes y videos de la referencia no se copian: el contenido es propio de One y de Control4.

## Evidencia REA

| Evidence ID | Operación | Qué contiene |
|---|---|---|
| `ev_7946b87f…e288` | `analyze_web_bundle` | 6 scripts inline, sin rutas/endpoints de API |
| `ev_a95fb89d…9e59a39` | `capture_browser_scenario` | Carga completa (Edge headless 1440×900), 48 requests, cuerpos de HTML/CSS/JS |
| `ev_e4ed4b24…b782` | `export_web_scripts` | 15 scripts exportados (2 no disponibles: recaptcha i18n, redirect de Turnstile) |

Limitaciones: análisis estático + una sola carga sin scroll real; las animaciones se dedujeron de la configuración IX3/IX2 y del código inline, no se observaron ejecutándose frame a frame. La captura de eventos alcanzó un límite de presupuesto (6 eventos descartados).

## Stack observado

- **Webflow** (sitio `69346711c89a524b449039f4`), base de template **Relume** (variables `--relume-library-lite--*`).
- **Webflow Interactions IX3** (GSAP 3.15 + ScrollTrigger + SplitText) para revelados de texto.
- **Webflow IX2** (legacy) para hovers, dropdowns, scroll-into-view: 171 `SCROLL_INTO_VIEW`, 68 `SCROLLING_IN_VIEW`, 25 `PAGE_SCROLL`, 21 `MOUSE_MOVE`. Muchos son del template completo, no solo de la home (28 elementos `data-w-id` en la home).
- jQuery 3.5.1, WebFont loader, Flowbase before/after slider, reCAPTCHA + Cloudflare Turnstile en el formulario del footer, GA4.
- Schema.org `LocalBusiness` con `areaServed` y `OfferCatalog` de 7 servicios → **replicar este patrón SEO para One**.

## Design tokens (CSS `:root`)

| Token | Valor | Nota para One |
|---|---|---|
| fondo claro | `#f2f1ef` / bg-1 `#fcfaf5` / bg-3 `#d6d1c4` | paleta cálida, beige |
| texto/oscuro | `#212721` (verde casi negro) | |
| acento | `#f15523` (naranja) | One usa su propio acento |
| alfas | dark/light al 16/32/48/64 % | sistema de transparencias para bordes y textos secundarios |
| fuente principal | Parkinsans 500 | display geométrica |
| fuente secundaria | Urbanist | |
| H1 | 120px / 93.3% / -3px | titulares enormes, interlineado apretado |
| H2 | 5rem / 100% / -2px | |
| H3 | 2.5rem / 100% / -2px | |
| body | 18px / 150% | |
| label | .8rem / +1px tracking, mayúsculas | "eyebrows" sobre cada título |
| radios | 8 / 16 / full (pills) | botones pill |
| contenedor | 1800px máx, padding 32px | |
| espaciado secciones | 48 / 80 / 96 / 120 / 160; hero top 168px | |
| breakpoints | 991 / 767 / 479 (max) y 1280 / 1440 / 1920 (min) | |

## Estructura de la home (orden real del DOM)

1. **Preloader** — fondo oscuro, logo centrado, líneas topográficas en naranja.
2. **Barra de anuncio** naranja arriba + **nav estática** (logo, 3 dropdowns, CTA pill oscuro).
3. **Hero** (`hero-home-a`) — video de fondo oscuro, H2 enorme con primera palabra en acento, subtítulo, 2 CTAs (sólido claro + translúcido).
4. **Galería de imágenes** (`section-5`, 6 imágenes).
5. **About** — H1 SEO + párrafo de propuesta, 4 elementos animados.
6. **Logos** (marcas aliadas).
7. **Carrusel** (`section-carousel`, ~51 imágenes, probablemente marquee infinito).
8. **Soluciones por tabs** (`kv-sol-section`) — 6 tabs con subrayado deslizante, cada pane con imagen o video + eyebrow + H3 + descripción + bullets. Código propio (ver abajo).
9. **Producto estrella** (Meet Josh) + 4 valores — 16 elementos con scroll-into-view.
10. **Sección de video** (embed YouTube).
11. **Historia/confianza** (seguro de cobertura).
12. **CTA final** — video de fondo en escala de grises, eyebrow pill, H2 centrado, botón pill.
13. **Footer** — 4 columnas de links + formulario newsletter/contacto.

## Interacciones clave (cómo funcionan)

### 1. Revelado de titulares letra por letra (IX3)
- Disparador: ScrollTrigger `start: "top 80%"`, `end: "bottom top"`, `enter: play`, sin `scrub`, se ejecuta una vez.
- Animación: SplitText por **caracteres**, cada char `opacity 0→1`, `y 25%→0`, `duration .1–.25s`, `stagger .025s`.
- Aplica a `.text-h4`, `.heading-stagger` y, al cargar (con `delay 1s` tras el preloader), a `.heading`.
- Ítems de integraciones: `yPercent 100→0` + fade, `.25s`.

### 2. Nav doble con intercambio al hacer scroll (JS inline propio)
- Dos navs: `.nav-wrap.static` (arriba, a todo ancho) y `.nav-wrap.light` (pill flotante translúcido).
- Al pasar **100px** de scroll la estática sube y el pill baja; vuelve al subir por debajo de **40px** (histéresis).
- Animación con `requestAnimationFrame`, `translate` en Y, 450ms, 120ms de desfase entre ambos, easing `cubic-bezier(.4,0,.2,1)`.
- Respeta `prefers-reduced-motion`, cierra dropdowns abiertos al cambiar, recalcula con `ResizeObserver`.

### 3. Tabs de soluciones (JS inline propio)
- Tabs nativas de Webflow + indicador `<span>` que se desliza bajo la tab activa (`left`/`width` por `offsetLeft`).
- **Cambio de tab al hover** (solo dispositivos con `hover: hover` y `pointer: fine`).
- Solo se reproduce el video del pane activo y solo si la sección está visible; al cambiar de tab rebobina.
- Anillo de foco solo para teclado (`kv-sol-kbd`), navegación con flechas/Home/End.
- Si el pane tiene video de fondo, se oculta la imagen fija.

### 4. Resto (IX2)
- Hovers en cards (servicio, integración, historia), links de menú y footer: cambios de color, fondo, escala.
- Divisores de sección que se dibujan al entrar en vista.
- FAQ en acordeón (click / segundo click).

## Qué tomar para One Automatización

**Adoptar el patrón** (con marca, textos y medios propios de One):
- Preloader corto con logo → hero oscuro con video de fondo y titular enorme con palabra en acento.
- Nav doble con intercambio estática → pill al hacer scroll.
- Revelado de titulares letra por letra con SplitText/ScrollTrigger.
- Sección de soluciones por tabs con indicador deslizante y video por pane (los servicios de One como tabs).
- Escala tipográfica grande con tracking negativo, eyebrows en mayúsculas, botones pill.
- CTA final a pantalla completa con video en escala de grises.
- JSON-LD `LocalBusiness` + `OfferCatalog` con los servicios y zonas de One.

**Decisiones abiertas para One** (no se deducen de la referencia):
- Paleta y acento de One, tipografías (licencia), stack (Webflow vs código propio en este repo).
- Servicios concretos, zonas de cobertura, marcas aliadas y producto estrella.
- Fotos/videos propios: la referencia depende mucho de video; One necesita material equivalente.

## Inventario completo de motion de la home (revisión 2)

Fuente: config IX2/IX3 de `webflow.73548f9d…js`, CSS compartido y muestreo en vivo de transform/opacity en cada tercio de pantalla de scroll.

| # | Elemento | Disparador | Motion | En One |
|---|---|---|---|---|
| 1 | Preloader | carga | overlay del logo 100%→0 (1 s ease) → cortina 100vh→0 (1 s outExpo, +0.5 s) → `display:none` | ✅ (+ tope de 5 s) |
| 2 | **Hero** | — | `position: sticky; top:0; z-index:1`; las secciones siguientes (z 2–4, fondo propio) **suben por encima** como cortina | ✅ |
| 3 | Hero: layout | — | titular a la izquierda (tamaño h2, interlineado h1), bloque derecho máx. 456px con H1 + 2 botones, alineados abajo; degradado `#1f191500→#212721a6`; video de fondo loop 8 s con póster | ✅ (video = placeholder) |
| 4 | Hero: titular | carga | IX2 opacity 0→1 (1 s, +0.2 s) + IX3 letras opacity/y 25% (delay 1 s, velocidad 0.5) | ✅ |
| 5 | Nav doble | scroll >100 / <40 | estática sube, pill baja 120 ms después (450 ms, bezier .4,0,.2,1) | ✅ |
| 6 | Pill | — | degradado radial blanco, blur 8px, radio 50px, máx. 900px, sombra `0 4px 4px #0003` | ✅ |
| 7 | Dropdowns (Solutions/Company/Learn) | hover (cierre a 300 ms) | flecha 0→180°, lista y 20→0 + fade (300 ms easeOut); cierre y→-12 + fade (300 ms easeIn) | ✅ (Soluciones/Empresa/Aprende) |
| 8 | Links del dropdown | hover | flecha entra desde -0.5rem + fade, ícono a fondo acento con ícono claro (500 ms ease); fila destacada: tile y círculo a acento, flecha +4px | ✅ |
| 9 | Galería "Design with intention" | scroll (scrub, smoothing 90) | track 200vh + sticky; 6 fotos de 22vw convergen al centro en 67/78/86/86/94/100 %; título 0.7→1 y opacity 1→0 entre 66 y 68 % | ✅ |
| 10 | Texto de servicios (`.text-h4`) | entra (top 80%) | letras .1 s, stagger .025 | ✅ |
| 11 | 3 features | entra | opacity 0→1 (1 s outQuart, +.1 s) | ✅ |
| 12 | Divisores | entra | width 0→100% (1 s outSine) | ✅ |
| 13 | Logos | entra, loop | dos filas, 25 s, sentidos opuestos | ✅ |
| 14 | Tabs de soluciones | hover 110 ms / click / teclado | indicador deslizante, chip con blur sobre la foto, solo reproduce el video activo; fondo oscuro con brillo de acento | ✅ |
| 15 | "Your Home, Connected" | entra (cada ítem) | y 100px→0 + fade (1 s outQuart, +.2 s); hover: ícono 1→1.1 (500 ms) | ✅ |
| 16 | Títulos con `heading-stagger` | entra (top 80%) | letras .25 s, stagger .025 | ✅ |
| 17 | Botón play del video | hover | scale 1→1.1 (400 ms inOutQuad) | ✅ |
| 18 | Links del footer | hover | opacity 1→.5 (200 ms) | ✅ |
| 19 | Botones | hover | solo cambio de color de fondo/texto (.3 s), sin desplazamiento | ✅ |

No hay `@keyframes` propios (solo `spin` de Webflow) ni animaciones CSS activas en la home; todo el motion es IX2/IX3 o JS inline.

## Observado en vivo (navegador integrado)

- **Carrusel = doble marquee**: dos filas (`.marquee-text-wrap` y `.marquee-text-wrap.reverse`) en sentidos opuestos, ~56 px/s, movidas por JS (transform), no por `@keyframes`.
- **Galería `section-5`**: imágenes en abanico con desplazamientos/rotaciones fijas; no cambian con 300px de scroll (no es parallax).
- **Hero**: `<video>` en `autoplay muted loop`; en móvil el fondo alterna escenas (crossfade).
- **Preloader**: más de 5 s en móvil antes de mostrar el hero; los titulares arrancan con `delay 1s` después. Para One conviene acortarlo (afecta LCP).

## Móvil (375×812)

- Hero H1/H2 baja de 120px a **48px**, tracking -2px.
- Nav: hamburguesa (`.w-nav-button`), menú oculto por defecto.
- Tabs de soluciones: pasan de fila con subrayado a **chips pill que se envuelven**, chip activo en acento relleno.
- Altura total de la home ≈ 8.900px.
- No verificado: menú hamburguesa abierto (el click no abrió visiblemente el panel en la emulación).

## Mapa del sitio (sitemap.xml, 25 URLs)

| Plantilla | URLs | Secciones principales |
|---|---|---|
| Home | `/` | ver arriba |
| Hub de servicios | `/smart-home` | hero, producto estrella, beneficios (versión desktop y móvil separadas), logos, carrusel, "conecta todo", CTA |
| Detalle de servicio (×6) | `/smart-home/{lighting, shading, entertainment, climate-control, cameras-locks, networking-wi-fi}` | hero con H1 + H2 SEO local, logos, contenido, **tabla de precios/paquetes**, galería, "conecta todo", CTA |
| Historia | `/our-story` | texto largo + CTA |
| Precios y proceso | `/pricing-and-process` | hero, **paquetes y precios**, **cómo trabajamos**, seguro, CTA |
| Contacto | `/contact` | formulario (3 forms en página) |
| Socios comerciales | `/trade-partners` | enfoque, beneficios, formulario B2B, CTA |
| Blog | `/articles` + `/article/{slug}` (CMS, 10 artículos) | listado; artículo con H2 por bloque, **FAQ**, artículos relacionados, CTA |
| Recursos | `/resources` | fichas por marca/producto |
| Legal | `/privacy` | |

Patrones repetidos en todas las plantillas: **mismo CTA final** y **mismo footer con formulario**, H2 SEO con ciudad en cada servicio, bloque "conecta todo tu hogar" que enlaza servicios entre sí.

## Estado de REA en este equipo (Windows)

Disponible y usado: captura de navegador, análisis de bundle web, export de scripts, análisis de JS local, vistas de evidencia.
No disponible y **sin impacto para esta web**: motores nativos (Ghidra/IDA/Kuna/Hopper), Android (adb/JADX/apktool), macOS, firmware, capturas de paquetes, WASM, EVM.
No disponible y **con impacto menor**: `recover_javascript_sources` (Wakaru, solo Linux x64) para desminificar el JS de Webflow. No hace falta: la lógica propia ya se extrajo legible del HTML y la config IX3 está en claro.

## Pendiente / no verificado
- Velocidad exacta y pausa al hover del marquee; efectos `PAGE_SCROLL`/`MOUSE_MOVE` concretos de la home.
- Menú móvil abierto y páginas internas en móvil.
- Contenido de los paquetes/precios (solo se mapeó la estructura).
