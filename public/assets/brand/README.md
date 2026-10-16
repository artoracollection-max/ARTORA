# ARTORA · Arte para sua tela

Identidade de galeria contemporânea: um A geométrico dentro de uma moldura aberta no canto superior direito. O símbolo associa arte, quadro e tela. Todos os SVGs têm fundo transparente.

| Arquivo | Aplicação |
| --- | --- |
| `artora-logo.svg` | Marca horizontal com assinatura: símbolo dourado, nome branco e assinatura suave; usar sobre marinho. |
| `artora-logo-navy.svg` | Marca horizontal monocromática marinho para fundos claros. |
| `artora-logo-white.svg` | Marca horizontal monocromática branca para fundos escuros. |
| `artora-symbol.svg` | Símbolo dourado utilizado no cabeçalho e rodapé. |
| `artora-symbol-navy.svg` | Símbolo monocromático marinho. |
| `artora-symbol-white.svg` | Símbolo monocromático branco. |
| `artora-favicon.svg` | Símbolo marinho em tema claro e dourado em tema escuro. |

## Tipografia e uso

DM Sans Semibold (600) no nome, com espaçamento de 0,16 em; DM Sans Regular (400) na assinatura. As letras dos SVGs horizontais estão convertidas em curvas, sem fontes externas. A landing usa texto real e fontes WOFF2 locais, restritas ao componente da marca para preservar a tipografia restante. Licença da fonte: `DM-Sans-LICENSE.txt` (SIL OFL).

Paleta: marinho `#14243A`, marinho profundo `#0D1828`, branco `#F7F8FA`, branco suave `#EEF1F5` e dourado fosco `#C5A45D`. Assinatura na versão principal: `#B8C1CE`, a cor de texto secundário da landing.

Manter a proporção original. Reservar espaço livre equivalente a pelo menos um quarto da altura do símbolo. Para tamanhos menores que 140 px de largura, preferir o símbolo isolado à composição horizontal. Não aplicar sombras, gradientes ou texturas na marca.

## Fonte e regeneração

Nome, assinatura, identificação acessível, metadados e geometria do símbolo: `src/data/brand.ts`. Cabeçalho e rodapé: `src/components/brand-mark.tsx`. O Vite injeta os metadados dessa mesma configuração no HTML.

Para regenerar os SVGs após alterar a configuração, execute `npm run brand:assets` com Node 22.18+ e as dependências instaladas. O script usa DM Sans do pacote `@fontsource/dm-sans` e converte as letras em curvas com `opentype.js`, uma dependência apenas de desenvolvimento. Depois execute `npm run build`.
