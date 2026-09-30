# Arquitetura e convenções

Este projeto é uma experiência narrativa em React/Vite. Não o converta em uma landing page, dashboard ou grade de cards. A navegação é feita pelas passagens e pelos objetos do cenário.

## Diretórios e responsabilidades

- `src/App.jsx`: estados `LOADING`, `INTRO`, `WAND`, `PORTAL`, `CEREMONY`, `REVELATION`, `SCHOOL` e `ACADEMY`; pré-carregamento; gesto da varinha; navegação; estado efêmero da visita.
- `src/components/Ceremony.jsx`: sequência cinematográfica usando Web Animations API. A conclusão real da animação emite `ended`, consumido uma vez. Pausa suas animações quando a aba fica oculta.
- `src/components/HouseShield.jsx`: `createHouseShield()` cria os vetores; `animateHouseShield()` materializa contorno, estrutura e ornamentos. Não substituir por PNG ou imagem remota. Os IDs SVG são únicos porque há apenas um brasão montado.
- `src/components/Academy.jsx`: parede assimétrica com seis objetos físicos. No celular a parede permite deslocamento horizontal.
- `src/components/Parchment.jsx`: pergaminho sobre um `dialog` nativo, com foco contido, Escape e restauração de foco.
- `src/components/Particles.jsx`: partículas e rastros em Canvas, com quantidade limitada, resolução máxima de 2x e pausa em segundo plano.
- `src/lib/world.js`: conteúdo editorial imutável, registros dos quadros, destinos e utilitários. Não é armazenamento de dados enviados por visitantes.
- `src/lib/audio.js`: ambiente e sinos sintetizados, iniciados por interação explícita. Nenhum arquivo de áudio externo.
- `src/styles.css`: direção de arte, cenários, molduras, pergaminhos, animações e adaptações responsivas.
- `public/img`: fotografias originais e dois cenários gerados. `scripts/generate-scenes.mjs` conserva os prompts e o fluxo opcional de geração, fora do bundle publicado.
- `tests/journey.spec.js`: testes E2E para um Preview já existente. `playwright.config.js` não inicia servidores.

## Invariantes

As fotografias pessoais são imutáveis. Nunca regenerar, retocar ou aplicar filtros às pessoas. Manter `object-fit: contain`, proporções e conteúdo integral. Os textos de Sofia e do vôlei devem permanecer exatamente como fornecidos. Os arquivos recebidos não tinham os nomes indicados no pedido; a associação adotada está documentada no README e não foi confirmada por metadados.

A casa é revelada pela narrativa; o visitante não a escolhe. A cerimônia é uma sequência procedural, não um vídeo ausente. Não criar dependências de `video-cerimonia.mp4`, `fundo.mp4` ou `escudo-lufa-lufa.png`.

Preferir pointer events e botões semânticos para mouse, toque e teclado. Respeitar `prefers-reduced-motion`; nunca remover o evento que conduz à próxima etapa. Limpar timers, animações e listeners ao desmontar. O estado `travel` mascara a troca de ambiente com aproximação e iluminação.

A estética usa verde escuro, pedra, latão e pergaminho; Cinzel e Cormorant Garamond fazem a tipografia narrativa. Evitar neon, linguagem de videogame e modais visualmente modernos. Ícones são Lucide ou SVG próprios; emojis aparecem apenas nas mensagens originais que exigem preservação literal.

Novas memórias preenchem os registros existentes em `world.js`. Novos ambientes requerem uma cena, um estado e seu despacho de navegação; não basta marcar `available: true`. A aplicação não persiste dados. Se uma extensão exigir persistência, seguir as skills de Netlify Database ou Netlify Blobs, conforme o tipo de dado.

## Entrega

O pipeline da plataforma instala e compila o projeto usando `netlify.toml`. Nesta sessão, builds, servidores locais e execução de testes foram proibidos; os testes foram escritos, mas não executados. Não descrever revisão estática como teste de navegador. Não afirmar um Deploy Preview publicado sem verificar a URL retornada pela plataforma. Não criar commits ou PRs; a plataforma cuida disso. Não inspecionar `.git` nem expor credenciais.
