# Placeholders de la Home (index.html)

Cada caja rayada en la página muestra su ID. Fotos y videos de Control4 deben salir del **material oficial para integradores** (portal dealer) o tener autorización escrita. Ver `docs/referencia-diseno.md`.

## Fotos y videos Control4

| ID | Sección | Tipo | Qué buscar | Formato sugerido |
|---|---|---|---|---|
| C4-01 | Hero | Video | Interior residencial, luces que se encienden por escenas | MP4/WebM loop 10–20 s, sin audio, 1920×1080, < 6 MB + póster JPG |
| C4-02 | Galería que converge (llega última, queda arriba) | Foto | Familia en la sala, TV de fondo | 1:1, 1200×1200 |
| C4-03 | Galería que converge | Foto | Control remoto con botones iluminados | 1:1 |
| C4-04 | Galería que converge | Foto | TV en pared con parlantes laterales | 1:1 |
| C4-05 | Galería que converge | Foto | Cortinas motorizadas y keypad | 1:1 |
| C4-06 | Galería que converge | Foto | Barra de sonido sobre mueble | 1:1 |
| C4-07 | Galería que converge | Foto | Pantalla táctil en pared mostrando una cámara | 1:1 |
| C4-10 | Tab Iluminación | Foto o video | Ambiente cálido con keypad | 4:3, 1600×1200 |
| C4-11 | Tab Cortinas | Foto o video | Cortinas motorizadas al atardecer | 4:3 |
| C4-12 | Tab Entretenimiento | Foto o video | Sala de cine en casa | 4:3 |
| C4-13 | Tab Clima | Foto o video | Termostato / habitación principal | 4:3 |
| C4-14 | Tab Cámaras y cerraduras | Foto o video | Puerta principal: cerradura y timbre con video | 4:3 |
| C4-15 | Tab Redes y Wi-Fi | Foto o video | Rack de red / punto de acceso | 4:3 |
| C4-20 | Sección Control4 (fondo a pantalla completa) | Video | Showroom o producto Control4 en loop | MP4/WebM loop, sin audio, 1920×1080 |
| C4-30 | Sección Control4 (tarjeta "Ver video") | Miniatura + video | Miniatura del video oficial; el video abre al hacer clic | 236×126 miniatura + embed o archivo autorizado |
| C4-31 | Respaldo (tarjeta) | Foto | Técnico de One instalando, o documento de póliza | 448×480 (≈ 14:15) |
| C4-40 | CTA final | Video | Interior/fachada | MP4 loop, sin audio |

Si un tab usa video, ponlo dentro de `.pane-media` como `<video muted playsinline loop>`: el JS ya pausa los videos de los tabs inactivos y reinicia el del tab activo.

## Logos y sellos

| ID | Qué va |
|---|---|
| LOGO-C4 | Logo de Control4 para dealers, según su guía de marca (aparece en las dos filas del carrusel). Formato: PNG/SVG en gris, alto 28px |
| [MARCA 2] a [MARCA 13] | Otras marcas que One integre (confirmar cuáles y su permiso de uso). Mismo formato |
| BADGE-C4 | Sello "Control4 Authorized Dealer" (o el nombre oficial que use Control4), en el footer junto al boletín. Círculo de ~96px |

## Datos de One por confirmar

- Logo, paleta y tipografías de One. Hoy se usa un design system provisional (`css/styles.css`, bloque `:root`).
- Ciudad/zonas de servicio (meta description, JSON-LD).
- Teléfono/WhatsApp, correo y dirección (footer, JSON-LD).
- Texto de la barra de anuncio y si la asesoría es gratuita.
- **Bloque de respaldo**: seguro ante daños, seguro del personal y cumplimiento en obra. Marcados `[CONFIRMAR]`; solo publicar si One los tiene.
- Mensajes de privacidad de Control4 y nombre del sello de dealer.
- Destino del formulario del boletín.
- Ejemplos de los chips de los tabs (22 °C, 9:42 p. m.): son ilustrativos.
