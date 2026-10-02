export const STATES = Object.freeze({
  LOADING: "LOADING",
  INTRO: "INTRO",
  WAND: "WAND",
  PORTAL: "PORTAL",
  CEREMONY: "CEREMONY",
  REVELATION: "REVELATION",
  SCHOOL: "SCHOOL",
  ACADEMY: "ACADEMY",
  COMMON: "COMMON",
});

export const portraits = [
  {
    id: "sofia",
    image: "/img/foto_01_sofia.jpg",
    title: "Meu anjo",
    author: "Sofia",
    alt: "Fotografia original de Bia e sua amiga, juntas na escola.",
    message:
      "Feliz aniversário, Bia! 💗🏐 Que seu dia seja maravilhoso e cheio de coisas boas! Você sabe que no vôlei é nós duas: se você cai, eu caio; se você sai, eu também saio 😂😂 Parece até que estamos conectadas!\n\nObrigada por todos os momentos e por ser essa pessoa incrível. Que Deus abençoe muito sua vida e que você continue sendo essa menina maravilhosa. Te adoro! 💕",
    shape: "tall",
    position: "one",
  },
  {
    id: "future-1",
    image: null,
    message: "",
    author: "",
    title: "Uma amizade por revelar",
    shape: "oval",
    position: "two",
  },
  {
    id: "volei",
    image: "/img/foto_02_volei.jpg",
    title: "Dentro e fora da quadra",
    author: "",
    alt: "Fotografia original de Bia sorrindo ao lado de sua amiga.",
    message: "Vc sempre será meu anjo,mo anielo\n— Sofia",
    shape: "wide",
    position: "three",
  },
  {
    id: "future-2",
    image: null,
    message: "",
    author: "",
    title: "Um riso para guardar",
    shape: "small",
    position: "four",
  },
  {
    id: "future-3",
    image: null,
    message: "",
    author: "",
    title: "Uma nova história",
    shape: "arch",
    position: "five",
  },
  {
    id: "future-4",
    image: null,
    message: "",
    author: "",
    title: "Um encontro especial",
    shape: "small",
    position: "six",
  },
];

export const destinations = [
  {
    id: "academy",
    title: "Academia",
    subtitle: "Onde a amizade ganha vida",
    available: true,
    symbol: "star",
  },
  {
    id: "common",
    title: "Sala Comunal",
    subtitle: "O aconchego de estar perto",
    available: true,
    symbol: "flame",
  },
  {
    id: "gallery",
    title: "Galeria de Memórias",
    subtitle: "Raízes, afeto e lembranças",
    available: false,
    symbol: "moon",
  },
  {
    id: "pensieve",
    title: "Penseira",
    subtitle: "Instantes que ficam para sempre",
    available: false,
    symbol: "droplet",
  },
];

export function sceneUrl(name, width = 1920) {
  return `/.netlify/images?url=/img/${name}.png&w=${width}&fm=webp&q=85`;
}

export function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
