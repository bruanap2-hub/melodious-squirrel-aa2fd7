import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Flame,
  KeyRound,
  Moon,
  Sparkles,
} from "lucide-react";
import { magicAudio } from "../lib/audio";

const SYMBOLS = [
  {
    id: "flame",
    label: "Chama",
    icon: Flame,
    clue: "Primeiro nasceu a luz.",
  },
  {
    id: "moon",
    label: "Lua",
    icon: Moon,
    clue: "Depois, a noite guardou o caminho.",
  },
  {
    id: "book",
    label: "Livro",
    icon: BookOpen,
    clue: "Então, a história foi escrita.",
  },
  {
    id: "key",
    label: "Chave",
    icon: KeyRound,
    clue: "Por fim, aquilo que estava fechado pôde ser aberto.",
  },
];

const SOLUTION = ["flame", "moon", "book", "key"];

export default function CommonRoom({ onBack, onEnterMemories }) {
  const [sequence, setSequence] = useState([]);
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(false);
  const [notice, setNotice] = useState(
    "Observe a sala. Há quatro sinais escondidos nela.",
  );
  const [doorOpen, setDoorOpen] = useState(false);

  const remaining = useMemo(
    () => SYMBOLS.filter((symbol) => !sequence.includes(symbol.id)),
    [sequence],
  );

  const chooseSymbol = (id) => {
    if (solved) return;

    const expected = SOLUTION[sequence.length];
    setSelected(id);

    if (id !== expected) {
      magicAudio.chime(196);

      setNotice(
        "A sala ficou em silêncio. Essa não parece ser a lembrança certa.",
      );

      setSequence([]);

      return;
    }

    const next = [...sequence, id];

    magicAudio.chime(392 + next.length * 65);
    setSequence(next);

    if (next.length === SOLUTION.length) {
      setSolved(true);
      setNotice("As quatro lembranças reconheceram o caminho.");

      window.setTimeout(() => {
        setDoorOpen(true);
      }, 900);

      return;
    }

    const nextSymbol = SYMBOLS.find(
      (symbol) => symbol.id === SOLUTION[next.length],
    );

    setNotice(
      nextSymbol?.clue ||
        "A sala respondeu. Há mais alguma coisa esperando.",
    );
  };

  const resetPuzzle = () => {
    setSequence([]);
    setSolved(false);
    setDoorOpen(false);
    setSelected(null);
    setNotice(
      "Observe a sala. Há quatro sinais escondidos nela.",
    );
    magicAudio.chime(261.63);
  };

  return (
    <section
      className={`common-room-scene ${
        solved ? "is-solved" : ""
      }`}
      aria-labelledby="common-room-title"
    >
      <div
        className="common-room-atmosphere"
        aria-hidden="true"
      >
        <div className="common-room-ceiling" />
        <div className="common-room-stone-wall" />

        <div className="common-room-window">
          <div className="common-room-moon" />
          <span className="common-room-cloud cloud-one" />
          <span className="common-room-cloud cloud-two" />
        </div>

        <div className="common-room-curtain curtain-left" />
        <div className="common-room-curtain curtain-right" />

        <div className="common-room-beam beam-one" />
        <div className="common-room-beam beam-two" />

        <div className="common-room-floor" />
        <div className="common-room-rug" />

        <div className="common-room-fireplace">
          <div className="common-room-mantel" />

          <div className="common-room-firebox">
            <span className="common-flame flame-main" />
            <span className="common-flame flame-small" />
            <span className="common-flame flame-side" />

            <i className="common-ember ember-one" />
            <i className="common-ember ember-two" />
            <i className="common-ember ember-three" />
          </div>
        </div>

        <div className="common-room-shelf">
          {[...Array(4)].map((_, row) => (
            <div className="common-shelf-row" key={row}>
              {[...Array(row === 1 ? 4 : 5)].map((__, i) => (
                <i
                  className={`common-book book-${(row + i) % 5}`}
                  key={i}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="common-room-sofa">
          <span />
          <span />
        </div>

        <div className="common-room-table">
          <div className="table-book" />
          <div className="table-box" />
        </div>

        <div className="common-candle candle-left" />
        <div className="common-candle candle-right" />
        <div className="common-candle candle-front" />

        <div className="common-room-portrait portrait-shadow portrait-a" />
        <div className="common-room-portrait portrait-shadow portrait-b" />

        <div className="common-room-particles" />
      </div>

      <div className="common-room-header">
        <button
          className="common-back-button"
          type="button"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          Voltar ao Salão Principal
        </button>

        <div className="common-room-heading">
          <span className="eyebrow">
            A SALA DOS QUE FICAM
          </span>

          <h1 id="common-room-title">
            Onde as memórias{" "}
            <em>encontram abrigo.</em>
          </h1>

          <p>
            Algumas portas só se abrem para quem presta
            atenção.
          </p>
        </div>
      </div>

      <div
        className="common-room-story"
        aria-live="polite"
      >
        <span className="common-story-line" />
        <span>{notice}</span>
        <span className="common-story-line" />
      </div>

      <div
        className="common-interaction-map"
        aria-label="Elementos mágicos da sala"
      >
        {SYMBOLS.map((symbol) => {
          const Icon = symbol.icon;
          const index = sequence.indexOf(symbol.id);
          const active = index >= 0;

          return (
            <button
              key={symbol.id}
              type="button"
              className={`common-hotspot hotspot-${symbol.id} ${
                active ? "is-found" : ""
              } ${
                selected === symbol.id
                  ? "is-selected"
                  : ""
              }`}
              onClick={() => chooseSymbol(symbol.id)}
              disabled={solved}
              aria-label={`${symbol.label}: ${
                active
                  ? `encontrado em ${index + 1}º lugar`
                  : "descobrir"
              }`}
            >
              <span className="hotspot-aura" />

              <Icon
                size={20}
                strokeWidth={1.2}
              />

              <small>
                {active ? `${index + 1}º` : "✦"}
              </small>
            </button>
          );
        })}
      </div>

      <div
        className={`common-secret-door ${
          doorOpen ? "door-open" : ""
        }`}
        aria-hidden={!doorOpen}
      >
        <div className="secret-door-glow" />

        <div className="secret-door-frame">
          <div className="secret-door-slab">
            <Sparkles
              size={38}
              strokeWidth={0.8}
            />
          </div>

          <div className="secret-door-beyond">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="memory-chamber">
          <span className="eyebrow">
            CÂMARA DAS MEMÓRIAS
          </span>

          <h2>
            O lugar onde as histórias permanecem.
          </h2>

          <p>
            Quatro espaços aguardam as pessoas que terão
            suas memórias guardadas aqui.
          </p>

          <div className="memory-niches">
            <span>Memória I</span>
            <span>Memória II</span>
            <span>Memória III</span>
            <span>Memória IV</span>
          </div>

          {onEnterMemories && (
            <button
              type="button"
              className="memory-entry-button"
              onClick={onEnterMemories}
            >
              Entrar nas memórias
            </button>
          )}
        </div>
      </div>

      <div className="common-room-controls">
        <span
          className="puzzle-progress"
          aria-label={`${sequence.length} de 4 símbolos descobertos`}
        >
          {SYMBOLS.map((symbol) => (
            <i
              key={symbol.id}
              className={
                sequence.includes(symbol.id)
                  ? "lit"
                  : ""
              }
            />
          ))}
        </span>

        <button
          type="button"
          className="common-reset"
          onClick={resetPuzzle}
        >
          Reiniciar o enigma
        </button>
      </div>

      <div className="common-room-mobile-hint">
        Toque nos detalhes da sala. A ordem das descobertas
        importa.
      </div>

      {remaining.length === 0 && !solved && (
        <div className="common-room-solved-hint">
          ✦ A sala reconheceu todas as quatro lembranças.
        </div>
      )}
    </section>
  );
}
