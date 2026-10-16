# Curadoria inicial ARTORA

Os arquivos desta pasta são prévias WebP com marca d’água incorporada, geradas a partir dos originais em `C:\Users\USER\Downloads\01-wallpapers-4k`. Os PNGs originais não são alterados nem publicados. As 12 imagens principais têm no máximo 1920 px no lado maior; os 12 versos têm no máximo 960 px. Ambas mantêm a proporção e a marca “ARTORA • PRÉVIA” repetida em diagonal.

| Tema | Original | Versão usada |
| --- | --- | --- |
| Arte clássica | `criacao-de-adao.png` | `criacao-de-adao.webp` |
| Cinema | `godfather.png` | `godfather.webp` |
| Cinema | `batman-cidade.png` | `batman-cidade.webp` |
| Cinema | `lobo-wall-street.png` | `lobo-wall-street.webp` |
| Automobilismo | `senna-monaco-2.png` | `senna-monaco-2.webp` |
| Futebol | `wallpaper pele.png` | `pele-futebol.webp` |
| Boxe | `ali-ringue.png` | `ali-ringue.webp` |
| Carros | `porsche-santorini.png` | `porsche-santorini.webp` |
| Carros | `lamborghini-pantera.png` | `lamborghini-pantera.webp` |
| Paisagens | `portofino.png` | `portofino.webp` |
| Paisagens | `aurora-boreal.png` | `aurora-boreal.webp` |
| Paisagens | `ilha-penhasco-ovelha.png` | `ilha-penhasco-ovelha.webp` |

A referência central com caminhos, textos alternativos, proporções e originais está em `src/data/showcase-artworks.ts`. Para recriar todas as prévias a partir dos originais, execute `scripts/optimize_showcase_previews.py` com Pillow instalado.

## Versos interativos da galeria

As 12 pinturas adicionais vêm da mesma pasta em Downloads. A correspondência exata, na ordem dos cartões, está em `src/data/gallery-alternates.json`; os pares usados pela interface são montados em `src/data/showcase-artworks.ts`. Os originais continuam intactos. O script `scripts/optimize-gallery-alternates.py` agora encaminha para o gerador unificado e também produz prévias com marca d’água.
