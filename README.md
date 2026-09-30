# Jornada Mágica da Bia

Uma aventura cinematográfica pessoal, em português, criada para celebrar Bia por meio de amizade, pertencimento e memórias reais. O visitante desperta um portal com uma varinha, acompanha uma cerimônia, vê um brasão se materializar e explora uma escola antiga.

## Tecnologias

React 19 e Vite, SVG procedural, Canvas 2D, CSS, Web Animations API e Web Audio API. Os dois cenários originais foram gerados uma única vez via Netlify AI Gateway, com Gemini, e são servidos pelo Netlify Image CDN. A aplicação publicada não faz chamadas a modelos. O som é sintetizado no navegador e só começa com uma ação explícita.

A cerimônia é uma sequência original animada em tela cheia, sem player e sem dependência de arquivos de vídeo. Sua animação emite um evento `ended` ao terminar, que conduz automaticamente à revelação da Lufa-Lufa. O brasão é construído em SVG e animado em camadas; não depende de uma imagem externa.

## Executar localmente

Use Node.js 22 ou superior.

```bash
npm install
netlify dev --port 8889
```

O Netlify Dev integra o Vite e os recursos da plataforma. Os cenários usam os arquivos locais como alternativa caso o Image CDN não esteja disponível. A configuração em `netlify.toml` declara a compilação Vite e a publicação do diretório `dist`; o pipeline executa essa etapa automaticamente.

## Fotografias e conteúdo

Os uploads chegaram com nomes diferentes dos descritos no pedido. Foi adotada esta associação, sem alteração nos arquivos binários:

| Upload recebido              | Arquivo da experiência         |
| ---------------------------- | ------------------------------ |
| `IMG-20260927-WA0040.jpg`    | `public/img/foto_01_sofia.jpg` |
| `IMG-20260927-WA0039(1).jpg` | `public/img/foto_02_volei.jpg` |

Essa associação não foi confirmada por metadados dos uploads. As fotografias não passaram por geração de imagem, filtros ou retoques. A apresentação usa `object-fit: contain` e dimensões proporcionais. Os textos fornecidos foram preservados literalmente, inclusive pontuação, quebras de parágrafo e emojis.

As seis memórias estão em `src/lib/world.js`. Para preencher um dos quatro quadros futuros, adicione a fotografia a `public/img`, preencha `image`, `message`, `author` e `alt`, e mantenha `position` e `shape`. O contador se adapta à quantidade de fotografias. Os destinos futuros estão no mesmo módulo. Eles mostram uma mensagem contextual até que seus ambientes sejam implementados.

Não há cadastro, envio de dados, analytics ou persistência de progresso. A contagem de memórias descobertas pertence à visita atual e é reiniciada ao recarregar a página.

## Verificação e Preview

Foi feita revisão estática dos arquivos e inspeção visual dos cenários e das fotografias. Nenhum build, servidor local ou teste de navegador foi executado nesta sessão, conforme as restrições do ambiente. A publicação e a URL do Deploy Preview são responsabilidade do pipeline da plataforma; não existe uma URL de Preview verificada neste repositório.

A suíte Playwright em `tests/journey.spec.js` cobre a jornada completa em desktop e celular: progressão automática, brasão SVG, seis quadros, textos exatos, fotografias carregadas, fechamento por Escape, restauração de foco, ambientes futuros, retorno ao salão, som e movimento reduzido. Ela está preparada, mas não foi executada nesta sessão. Em um ambiente de testes autorizado, com um Preview já publicado:

```bash
npx playwright install chromium
PREVIEW_URL=https://seu-preview.netlify.app npx playwright test
```

A configuração dos testes nunca inicia um servidor. Para uma conferência visual manual, use 1440 × 900 e 390 × 844, percorra todas as etapas, arraste a parede da Academia no celular e abra os dois pergaminhos. Confira também orientação horizontal, zoom de texto, navegação por Tab e a preferência por movimento reduzido.

## Cenários gerados

Os arquivos finais são `public/img/school.png` e `public/img/academy.png`. Os prompts completos estão em `scripts/generate-scenes.mjs`: um claustro gótico com porta dourada à direita e um corredor de retratos com paredes antigas desocupadas. A geração usou `gemini-3.1-flash-image` pelo SDK `@google/genai` e Netlify AI Gateway. Nenhuma fotografia pessoal foi enviada ao modelo. A regeneração é opcional e não faz parte do build.
