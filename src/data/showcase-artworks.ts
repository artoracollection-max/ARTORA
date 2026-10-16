/** Curated artworks used by the landing. `original` records the untouched source in Downloads. */
import galleryAlternates from "./gallery-alternates.json";

export const showcaseArtworks = [
  { src: "/assets/showcase/criacao-de-adao.webp", alt: "A criação de Adão, com as mãos quase se tocando entre pinceladas douradas", original: "criacao-de-adao.png", aspectRatio: 3840 / 2143, theme: "arte clássica" },
  { src: "/assets/showcase/godfather.webp", alt: "O Poderoso Chefão em um retrato de grupo com luz dramática", original: "godfather.png", aspectRatio: 3840 / 2161, theme: "cinema" },
  { src: "/assets/showcase/batman-cidade.webp", alt: "Batman sob um feixe de luz diante de uma cidade noturna", original: "batman-cidade.png", aspectRatio: 16 / 9, theme: "cinema" },
  { src: "/assets/showcase/lobo-wall-street.webp", alt: "Jordan Belfort em meio à euforia de Wall Street", original: "lobo-wall-street.png", aspectRatio: 3840 / 2444, theme: "cinema" },
  { src: "/assets/showcase/senna-monaco-2.webp", alt: "Carro de Fórmula 1 de Ayrton Senna nas ruas de Mônaco", original: "senna-monaco-2.png", aspectRatio: 3840 / 2157, theme: "automobilismo" },
  { src: "/assets/showcase/pele-futebol.webp", alt: "Pelé em campo com a camisa amarela do Brasil", original: "wallpaper pele.png", aspectRatio: 3840 / 2143, theme: "futebol" },
  { src: "/assets/showcase/ali-ringue.webp", alt: "Muhammad Ali no ringue visto de cima", original: "ali-ringue.png", aspectRatio: 3840 / 2143, theme: "boxe" },
  { src: "/assets/showcase/porsche-santorini.webp", alt: "Porsche vermelho diante das casas brancas e azuis de Santorini", original: "porsche-santorini.png", aspectRatio: 16 / 9, theme: "carros" },
  { src: "/assets/showcase/lamborghini-pantera.webp", alt: "Lamborghini escura com uma pantera diante de um céu dramático", original: "lamborghini-pantera.png", aspectRatio: 16 / 9, theme: "carros" },
  { src: "/assets/showcase/portofino.webp", alt: "Casas coloridas de Portofino junto ao mar azul", original: "portofino.png", aspectRatio: 16 / 9, theme: "paisagens" },
  { src: "/assets/showcase/aurora-boreal.webp", alt: "Aurora boreal em tons de verde, rosa e violeta sobre montanhas", original: "aurora-boreal.png", aspectRatio: 3840 / 2161, theme: "paisagens" },
  { src: "/assets/showcase/ilha-penhasco-ovelha.webp", alt: "Ovelha em uma ilha verde cercada pelo oceano", original: "ilha-penhasco-ovelha.png", aspectRatio: 3840 / 2143, theme: "paisagens" },
] as const;

/** Front and reverse of each interactive preview; both files retain their source mapping. */
export const galleryArtworks = showcaseArtworks.map((artwork, index) => ({
  front: artwork,
  back: galleryAlternates[index],
}));

// Each row mixes subjects and colors; all twelve works appear across the three rows.
export const marqueeArtworkRows = [
  [0, 4, 1, 9],
  [7, 5, 2, 10],
  [6, 8, 11, 3],
].map((row) => row.map((index) => showcaseArtworks[index]));
