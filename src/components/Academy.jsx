import {
  ArrowLeft,
  MoveHorizontal,
  Sparkles,
  Feather,
  Moon,
  Flower2,
} from "lucide-react";
import { portraits } from "../lib/world";

const emblems = [Feather, Moon, Flower2, Sparkles];
const totalMemories = portraits.filter((portrait) => portrait.image).length;
export default function Academy({ onBack, onOpen, visited }) {
  return (
    <section className="academy-scene" aria-labelledby="academy-title">
      <div className="room-heading">
        <span className="eyebrow">A ALA DAS AMIZADES</span>
        <h1 id="academy-title" tabIndex={-1}>
          Laços que são <em>magia.</em>
        </h1>
        <p>Algumas pessoas tornam a nossa história inesquecível.</p>
      </div>
      <div
        className="gallery-scroll"
        tabIndex={0}
        aria-label="Parede de retratos. Deslize horizontalmente para explorar os seis quadros."
      >
        <div className="portrait-wall">
          {portraits.map((portrait, i) => {
            const Emblem = emblems[i % 4];
            return (
              <button
                key={portrait.id}
                className={`portrait portrait-${portrait.position} ${portrait.shape} ${portrait.image ? "filled" : "awaiting"}`}
                onClick={() => onOpen(portrait)}
                aria-label={
                  portrait.image
                    ? `Abrir memória: ${portrait.title}${portrait.author ? `, de ${portrait.author}` : ""}`
                    : `${portrait.title}: memória futura`
                }
              >
                <span className="frame-chain" aria-hidden="true" />
                <span className="frame-body">
                  <span className="frame-corner top-left" />
                  <span className="frame-corner top-right" />
                  {portrait.image ? (
                    <img
                      src={portrait.image}
                      alt={portrait.alt}
                      draggable="false"
                    />
                  ) : (
                    <span className="portrait-velvet">
                      <Emblem strokeWidth={0.7} size={38} />
                      <span>
                        Uma história
                        <br />
                        ainda por chegar
                      </span>
                    </span>
                  )}
                  <span className="frame-corner bottom-left" />
                  <span className="frame-corner bottom-right" />
                </span>
                <span className="portrait-plaque">
                  {portrait.image ? portrait.title : "Em breve"}
                  {portrait.image && <Sparkles size={11} />}
                </span>
                {visited.has(portrait.id) && (
                  <span className="memory-read">Memória descoberta</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="room-bottom">
        <button className="return-link" onClick={onBack}>
          <ArrowLeft size={17} /> Voltar ao Salão Principal
        </button>
        <span className="gallery-hint">
          <MoveHorizontal size={17} />
          <span>Explore os quadros. Desperte as memórias.</span>
        </span>
        <span className="memory-count">
          {visited.size} <span>/ {totalMemories} memórias descobertas</span>
        </span>
      </div>
    </section>
  );
}
