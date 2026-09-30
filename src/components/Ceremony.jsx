import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { reducedMotion } from "../lib/world";
import { magicAudio } from "../lib/audio";

export default function Ceremony({ onEnded }) {
  const ref = useRef(null);
  useEffect(() => {
    const scene = ref.current;
    const duration = reducedMotion() ? 9000 : 17000;
    const animation = scene.animate(
      [
        { opacity: 0 },
        { opacity: 1, offset: 0.08 },
        { opacity: 1, offset: 0.94 },
        { opacity: 0 },
      ],
      { duration, fill: "both" },
    );
    const handleEnded = () => {
      magicAudio.chime(523.25);
      onEnded();
    };
    scene.addEventListener("ended", handleEnded, { once: true });
    animation.finished
      .then(() => scene.dispatchEvent(new Event("ended")))
      .catch(() => {});
    const sequence = scene.getAnimations({ subtree: true });
    const paused = new Set();
    const visibility = () => {
      if (document.hidden) {
        sequence.forEach((part) => {
          if (part.playState === "running") {
            part.pause();
            paused.add(part);
          }
        });
      } else {
        paused.forEach((part) => part.play());
        paused.clear();
      }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      animation.cancel();
      scene.removeEventListener("ended", handleEnded);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [onEnded]);
  return (
    <section
      ref={ref}
      className="ceremony"
      aria-label="Cerimônia de acolhimento da Bia"
    >
      <div className="ceremony-light" />
      <div className="floating-candles" aria-hidden="true">
        {Array.from({ length: 16 }, (_, i) => (
          <span
            key={i}
            style={{
              "--x": `${8 + ((i * 17) % 84)}%`,
              "--y": `${10 + ((i * 13) % 60)}%`,
              "--delay": `${-i * 0.43}s`,
              "--scale": 0.5 + (i % 4) * 0.22,
            }}
          />
        ))}
      </div>
      <div className="ceremony-copy">
        <Sparkles size={30} strokeWidth={1} />
        <span className="eyebrow">A CERIMÔNIA DO PERTENCIMENTO</span>
        <div className="ceremony-lines" aria-live="polite">
          <p className="ceremony-line act-one">
            Há uma magia que não se aprende
            <br />
            <em>em nenhum livro.</em>
          </p>
          <p className="ceremony-line act-two">
            Ela mora em quem fica.
            <br />
            Em quem cuida. <em>Em quem ama.</em>
          </p>
          <p className="ceremony-line act-three">
            Bia, sua lealdade ilumina o caminho.
            <br />
            <em>E o seu coração encontrou um lar.</em>
          </p>
        </div>
      </div>
    </section>
  );
}
