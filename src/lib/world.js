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

// Sala Comunal: a inscrição da porta redonda indica a ordem dos vestígios.
export const commonRoom = {
  riddle:
    "Primeiro, acenda o calor. Depois, peça à noite que guarde o caminho. Leia a história que foi escrita e, só então, erga aquilo que abre.",
  order: ["flame", "moon", "book", "key"],
  objects: {
    flame: {
      title: "A lareira",
      place: "O CORAÇÃO DA SALA",
      description:
        "Brasas baixas dormem sob a pedra. Mesmo quase apagado, o fogo ainda aquece as poltronas ao redor.",
      action: "Avivar o fogo",
      awakened: "Primeiro nasceu a luz. O calor se espalha devagar pela sala.",
    },
    moon: {
      title: "A janela redonda",
      place: "ONDE O JARDIM ENCONTRA A NOITE",
      description:
        "Pela janela ao nível da grama, dentes-de-leão balançam sob uma lua tímida, escondida atrás do vidro.",
      action: "Chamar a lua",
      awakened: "Depois, a noite guardou o caminho. Um feixe prateado atravessa o tapete.",
    },
    book: {
      title: "O livro da mesa",
      place: "ENTRE AS POLTRONAS",
      description:
        "Um livro de capa gasta repousa ao lado do bule. Alguém deixou uma fita marcando a página favorita.",
      action: "Abrir o livro",
      awakened: "Então, a história foi escrita. As páginas brilham como se lembrassem de você.",
    },
    key: {
      title: "A chave de latão",
      place: "ENTRE AS ESTANTES E AS PLANTAS",
      description:
        "Pendurada num gancho, entre samambaias e livros antigos, uma pequena chave espera por mãos gentis.",
      action: "Erguer a chave",
      awakened: "Por fim, aquilo que estava fechado pôde ser aberto.",
    },
    door: {
      title: "A porta redonda",
      place: "A INSCRIÇÃO DA PORTA",
      description:
        "Quatro runas de latão rodeiam a porta. Cada uma desperta com um vestígio da sala, na ordem certa.",
      action: "Atravessar a porta redonda",
    },
  },
  chamber: {
    title: "A câmara dos que ficam",
    description:
      "Além da porta, uma pequena cúpula guarda uma luz que não se apaga. Ela nasce de quem cuida, de quem fica e de quem acolhe.",
  },
  letter: {
    letter: true,
    eyebrow: "A LUZ QUE NÃO SE APAGA",
    title: "O que fica",
    description:
      "Algumas magias não fazem barulho. Elas acendem o fogo antes que alguém sinta frio, guardam o caminho durante a noite, escrevem histórias com gentileza e abrem portas para quem chega.\n\nBia, esta sala existe por causa de pessoas como você: as que ficam. Que você sempre encontre aqui o mesmo calor que oferece a todos ao seu redor.\n\nCom carinho, de todos nós.",
  },
};

export function sceneUrl(name, width = 1920) {
  return `/.netlify/images?url=/img/${name}.png&w=${width}&fm=webp&q=85`;
}

export function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
