import { useEffect, useRef } from "react";
import { X, Sparkles, LockKeyhole, Compass } from "lucide-react";

export default function Parchment({ memory, destination, onClose }) {
  const ref = useRef(null);
  const item = memory || destination;
  useEffect(() => {
    const dialog = ref.current;
    if (item && !dialog.open) dialog.showModal();
    else if (!item && dialog.open) dialog.close();
  }, [item]);
  return (
    <dialog
      ref={ref}
      className={`parchment-dialog ${memory?.image ? "has-photo" : ""}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="memory-title"
    >
      {item && (
        <div className="parchment-sheet">
          <button
            className="parchment-close"
            onClick={onClose}
            aria-label="Fechar pergaminho"
          >
            <X size={22} />
          </button>
          {memory?.image && (
            <div className="memory-photo">
              <img src={memory.image} alt={memory.alt} />
              <span>Um instante. Para sempre.</span>
            </div>
          )}
          <div className="parchment-writing">
            {memory?.image ? (
              <Sparkles size={23} strokeWidth={1} />
            ) : destination?.description ? (
              <Compass size={24} strokeWidth={1} />
            ) : (
              <LockKeyhole size={24} strokeWidth={1} />
            )}
            <span className="eyebrow">
              {memory?.image
                ? "PALAVRAS QUE VIRAM MAGIA"
                : destination?.description
                  ? "SEU PRIMEIRO ENCANTAMENTO"
                  : "A HISTÓRIA CONTINUA"}
            </span>
            <h2 id="memory-title">{item.title}</h2>
            <div className="ink-divider">✧</div>
            <p className="memory-message">
              {memory?.image
                ? memory.message
                : destination
                  ? destination.description ||
                    "Esta passagem ainda guarda seus segredos. Em breve, novas pessoas e lembranças especiais encontram um lar por aqui."
                  : "Este quadro guarda um lugar para uma amizade especial. A próxima memória ainda está sendo escrita."}
            </p>
            {memory?.image &&
              memory.author &&
              !memory.message.endsWith(`— ${memory.author}`) && (
                <p className="memory-author">— {memory.author}</p>
              )}
            <div className="parchment-seal" aria-hidden="true">
              B
            </div>
            <button className="ink-button" onClick={onClose}>
              {memory?.image ? "Guardar no coração" : "Continuar explorando"}{" "}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
