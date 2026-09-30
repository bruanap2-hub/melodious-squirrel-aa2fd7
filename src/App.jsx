import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Volume2,
  VolumeX,
  Headphones,
  Compass,
  MoveUpRight,
  LockKeyhole,
  Flame,
  Moon,
  Droplets,
  WandSparkles,
  RotateCcw,
} from "lucide-react";
import Particles from "./components/Particles";
import HouseShield from "./components/HouseShield";
import Ceremony from "./components/Ceremony";
import Academy from "./components/Academy";
import Parchment from "./components/Parchment";
import { STATES, destinations, sceneUrl, reducedMotion } from "./lib/world";
import { magicAudio } from "./lib/audio";

function Sigil({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m28 3 5.5 18.5L52 28l-18.5 6.5L28 53l-5.5-18.5L4 28l18.5-6.5Z"
        stroke="currentColor"
      />
      <path
        d="m28 13 3.5 11.5L43 28l-11.5 3.5L28 43l-3.5-11.5L13 28l11.5-3.5Z"
        fill="currentColor"
      />
      <circle cx="28" cy="28" r="19" stroke="currentColor" strokeOpacity=".4" />
      <circle cx="28" cy="28" r="3" fill="#171c15" />
    </svg>
  );
}

const stateLabels = {
  LOADING: "A magia está despertando",
  INTRO: "O chamado",
  WAND: "Sua primeira magia",
  PORTAL: "A passagem",
  CEREMONY: "A cerimônia",
  REVELATION: "O pertencimento",
  SCHOOL: "Salão Principal",
  ACADEMY: "Academia",
};
const roomIcons = {
  star: Sparkles,
  flame: Flame,
  moon: Moon,
  droplet: Droplets,
};

export default function App() {
  const [state, setState] = useState(STATES.LOADING);
  const [sound, setSound] = useState(false);
  const [memory, setMemory] = useState(null);
  const [destination, setDestination] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [travel, setTravel] = useState(null);
  const [visited, setVisited] = useState(new Set());
  const [charge, setCharge] = useState(0);
  const [soundNotice, setSoundNotice] = useState("");
  const wandRef = useRef(null);
  const portalRef = useRef(null);
  const activated = useRef(false);
  const travelLock = useRef(false);
  const timers = useRef([]);
  const chargeRef = useRef(0);
  const pointerNear = useRef(false);
  const headingRef = useRef(null);
  const [width] = useState(() => (window.innerWidth < 700 ? 1200 : 1920));
  const isAcademy = state === STATES.ACADEMY;
  const inWorld = state === STATES.SCHOOL || isAcademy;
  const ritual = [STATES.CEREMONY, STATES.REVELATION].includes(state);
  const schedule = useCallback((callback, delay) => {
    const id = setTimeout(callback, delay);
    timers.current.push(id);
    return id;
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    let cancelled = false;
    const paths = [
      sceneUrl("school", width),
      sceneUrl("academy", width),
      "/img/foto_01_sofia.jpg",
      "/img/foto_02_volei.jpg",
    ];
    const assets = paths.map(
      (path) =>
        new Promise((resolve) => {
          const image = new Image();
          image.onload = resolve;
          image.onerror = resolve;
          image.src = path;
        }),
    );
    const minimum = new Promise((resolve) => setTimeout(resolve, 1400));
    const deadline = new Promise((resolve) => setTimeout(resolve, 5500));
    Promise.race([Promise.all([...assets, minimum]), deadline]).then(() => {
      if (!cancelled) setState(STATES.INTRO);
    });
    return () => {
      cancelled = true;
    };
  }, [width]);

  useEffect(() => {
    if (state !== STATES.LOADING) {
      (
        headingRef.current || document.querySelector('h1[tabindex="-1"]')
      )?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    const visibility = () =>
      document.hidden ? magicAudio.pause() : magicAudio.resume();
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, [state]);

  const toggleSound = async () => {
    try {
      const enabled = await magicAudio.toggle();
      setSound(enabled);
      if (!enabled && !magicAudio.context) throw new Error("Audio unavailable");
    } catch {
      setSound(false);
      setSoundNotice(
        "O som não está disponível neste navegador. A magia continua.",
      );
      schedule(() => setSoundNotice(""), 4500);
    }
  };
  const startExperience = () => {
    activated.current = false;
    chargeRef.current = 0;
    pointerNear.current = false;
    setCharge(0);
    setState(STATES.WAND);
    magicAudio.chime();
  };
  const activatePortal = useCallback(() => {
    if (activated.current) return;
    activated.current = true;
    setCharge(100);
    setState(STATES.PORTAL);
    magicAudio.chime(783.99);
  }, []);
  const checkPortalProximity = useCallback((x, y) => {
    const rect = portalRef.current?.getBoundingClientRect();
    pointerNear.current = Boolean(
      rect &&
      Math.hypot(
        (x - rect.left - rect.width / 2) / rect.width,
        (y - rect.top - rect.height / 2) / rect.height,
      ) < 0.62,
    );
  }, []);
  const handleWandMove = (e) => {
    if (state !== STATES.WAND || memory || destination) return;
    if (wandRef.current) {
      wandRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) rotate(-32deg)`;
      wandRef.current.style.opacity = "1";
    }
    checkPortalProximity(e.clientX, e.clientY);
  };
  useEffect(() => {
    if (state !== STATES.WAND || memory || destination) return;
    const interval = setInterval(() => {
      chargeRef.current = Math.min(
        100,
        Math.max(0, chargeRef.current + (pointerNear.current ? 5 : -2)),
      );
      setCharge(chargeRef.current);
      if (chargeRef.current >= 100) activatePortal();
    }, 60);
    return () => clearInterval(interval);
  }, [state, activatePortal, memory, destination]);

  const handleCeremonyEnd = useCallback(() => {
    setRevealed(false);
    setState(STATES.REVELATION);
  }, []);
  const handleShieldComplete = useCallback(() => {
    setRevealed(true);
    magicAudio.chime(523.25);
  }, []);
  const moveThrough = useCallback(
    (target) => {
      if (travelLock.current) return;
      travelLock.current = true;
      setTravel(target);
      magicAudio.chime(392);
      const duration = reducedMotion() ? 350 : 1800;
      schedule(() => {
        setState(target);
        setMemory(null);
        setDestination(null);
      }, duration / 2);
      schedule(() => {
        setTravel(null);
        travelLock.current = false;
      }, duration);
    },
    [schedule],
  );
  const enterSchool = () => moveThrough(STATES.SCHOOL);
  const enterAcademy = () => moveThrough(STATES.ACADEMY);
  const exitAcademy = () => moveThrough(STATES.SCHOOL);
  const openPortrait = (portrait) => {
    magicAudio.chime(587.33);
    setMemory(portrait);
    if (portrait.image)
      setVisited((previous) => new Set([...previous, portrait.id]));
  };
  const closePortraitMessage = () => {
    setMemory(null);
    setDestination(null);
  };
  const showHelp = () =>
    setDestination({
      title: "Siga a sua curiosidade",
      description:
        "Mova a varinha até a luz ou toque no portal para despertar a magia. Depois da cerimônia, explore as passagens do Salão Principal. Na Academia, toque nos quadros para encontrar mensagens. No celular, deslize a parede para descobrir todos eles. O som é opcional; ative-o no canto superior.",
    });

  const chapter =
    state === STATES.INTRO || state === STATES.LOADING
      ? 0
      : state === STATES.WAND || state === STATES.PORTAL
        ? 1
        : ritual
          ? 2
          : 3;
  return (
    <main
      className={`experience state-${state.toLowerCase()} ${travel ? "is-traveling" : ""}`}
      onPointerDown={handleWandMove}
      onPointerMove={handleWandMove}
      onPointerLeave={() => {
        pointerNear.current = false;
        if (wandRef.current) wandRef.current.style.opacity = "0";
      }}
    >
      <div className="world-background" aria-hidden="true">
        <img
          className={`scene-image school-image ${isAcademy ? "hidden-scene" : ""}`}
          src={sceneUrl("school", width)}
          onError={(e) => {
            if (!e.currentTarget.dataset.fallback) {
              e.currentTarget.dataset.fallback = "true";
              e.currentTarget.src = "/img/school.png";
            }
          }}
          alt=""
        />
        <img
          className={`scene-image academy-image ${!isAcademy ? "hidden-scene" : ""}`}
          src={sceneUrl("academy", width)}
          onError={(e) => {
            if (!e.currentTarget.dataset.fallback) {
              e.currentTarget.dataset.fallback = "true";
              e.currentTarget.src = "/img/academy.png";
            }
          }}
          alt=""
        />
        <div className="scene-shading" />
        <div className="light-breath" />
        <div className="floor-mist" />
      </div>
      <Particles
        active={state === STATES.WAND}
        burst={state === STATES.PORTAL || state === STATES.REVELATION}
      />
      <div className="film-grain" aria-hidden="true" />
      <div className="screen-border" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      {state !== STATES.LOADING && (
        <header className="world-header">
          <div className="wordmark">
            <Sigil />
            <span>
              JORNADA MÁGICA<span>DA BIA</span>
            </span>
          </div>
          <div className="dedication">
            <span /> UMA HISTÓRIA ESCRITA NAS ESTRELAS <span />
          </div>
          <button
            className="sound-button"
            onClick={toggleSound}
            aria-pressed={sound}
            aria-label={
              sound ? "Desativar som ambiente" : "Ativar som ambiente"
            }
          >
            {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
            <span>Som {sound ? "ativado" : "desativado"}</span>
            <span className={`sound-light ${sound ? "on" : ""}`} />
          </button>
        </header>
      )}

      {state === STATES.LOADING && (
        <section className="loading-scene" aria-live="polite">
          <Sigil className="loading-sigil" />
          <span className="eyebrow">UM POUCO DE LUZ. UM POUCO DE MAGIA.</span>
          <h1>O seu mundo está despertando.</h1>
          <div className="loading-thread" />
          <p>Há histórias que merecem um lugar especial.</p>
        </section>
      )}

      {state === STATES.INTRO && (
        <section className="intro-scene">
          <div className="intro-copy">
            <div className="eyebrow intro-eyebrow">
              <span /> PARA QUEM CARREGA MAGIA NO CORAÇÃO
            </div>
            <h1 ref={headingRef} tabIndex={-1}>
              Jornada
              <br />
              Mágica{" "}
              <span className="title-last">
                da <em>Bia</em>
                <span className="title-spark">✧</span>
              </span>
            </h1>
            <div className="tiny-ornament">
              <span />✧<span />
            </div>
            <p className="intro-description">
              Algumas pessoas tornam o mundo mais mágico.
              <br />
              Esta história é sobre uma delas. <em>É sobre você.</em>
            </p>
            <button className="gold-button" onClick={startExperience}>
              <WandSparkles size={18} strokeWidth={1.3} />
              <span>Começar a jornada</span>
              <ArrowRight size={17} />
            </button>
            <div className="headphone-note">
              <Headphones size={13} />
              <span>Com fones, a magia fica ainda mais perto.</span>
            </div>
          </div>
          <div className="portal-whisper" aria-hidden="true">
            <div className="whisper-star">✧</div>
            <span>
              Um novo mundo
              <br />
              <em>espera por você.</em>
            </span>
            <div className="whisper-line" />
          </div>
          <div className="intro-side-note">
            AMIZADES · MEMÓRIAS · PERTENCIMENTO
          </div>
        </section>
      )}

      {(state === STATES.WAND || state === STATES.PORTAL) && (
        <section className="wand-scene">
          <div className="wand-copy">
            <span className="eyebrow">CAPÍTULO I · O DESPERTAR</span>
            <h1 ref={headingRef} tabIndex={-1}>
              Toda magia começa
              <br />
              com um <em>gesto.</em>
            </h1>
            <p>
              Mova sua varinha até a luz.
              <br />O portal reconhece quem tem magia no coração.
            </p>
            <span className="touch-instruction">
              Você também pode tocar no portal para abri-lo.
            </span>
          </div>
          <button
            ref={portalRef}
            className={`magic-portal ${state === STATES.PORTAL ? "activated" : ""}`}
            onClick={activatePortal}
            disabled={state === STATES.PORTAL}
            aria-label="Ativar o portal mágico e iniciar a cerimônia"
            onPointerLeave={() => {
              pointerNear.current = false;
            }}
            style={{ "--charge": charge / 100 }}
          >
            <span className="portal-halo" />
            <span className="portal-ring ring-two" />
            <span className="portal-ring" />
            <Sigil />
            <span className="portal-label">
              {charge > 0 ? "A magia está despertando" : "Toque a luz"}
            </span>
          </button>
          {state === STATES.WAND && (
            <div className="wand-cursor" ref={wandRef} aria-hidden="true">
              <span />
              <i />
            </div>
          )}
          {state === STATES.PORTAL && (
            <div
              className="portal-expansion"
              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget) setState(STATES.CEREMONY);
              }}
            />
          )}
        </section>
      )}

      {state === STATES.CEREMONY && <Ceremony onEnded={handleCeremonyEnd} />}

      {state === STATES.REVELATION && (
        <section
          className={`revelation-scene ${revealed ? "shield-complete" : ""}`}
        >
          <div className="revelation-aura" />
          <div className="shield-column">
            <span className="eyebrow">O CORAÇÃO SABE ONDE PERTENCE</span>
            <HouseShield onComplete={handleShieldComplete} />
            <div className="house-name">
              <span>SUA CASA É</span>
              <h1 ref={headingRef} tabIndex={-1}>
                Lufa-Lufa
              </h1>
              <p>Lealdade. Gentileza. Um coração que acolhe.</p>
            </div>
          </div>
          {revealed && (
            <div className="welcome-scroll">
              <span className="eyebrow">UMA CARTA PARA BIA</span>
              <h2>Você já era mágica.</h2>
              <p>
                A magia está no cuidado, na amizade que fica e no jeito de fazer
                cada pessoa se sentir em casa.
              </p>
              <p>
                Estas paredes guardam um pouco do amor que você espalha. Hoje,
                ele volta para você.
              </p>
              <p className="letter-signature">Com carinho, de todos nós.</p>
              <button className="ink-button" onClick={enterSchool}>
                Entrar na escola <ArrowUpRight size={18} />
              </button>
              <span className="letter-stamp" aria-hidden="true">
                B
              </span>
            </div>
          )}
        </section>
      )}

      {state === STATES.SCHOOL && (
        <section className="school-scene">
          <div className="room-heading">
            <span className="eyebrow">SINTA-SE EM CASA, BIA</span>
            <h1 ref={headingRef} tabIndex={-1}>
              Cada passagem, <em>uma história.</em>
            </h1>
            <p>Há um pouco de você em cada canto deste lugar.</p>
          </div>
          <div className="school-passages">
            {destinations.map((room, i) => {
              const Icon = roomIcons[room.symbol];
              return (
                <button
                  key={room.id}
                  className={`passage passage-${i} ${room.available ? "passage-open" : "passage-locked"}`}
                  onClick={() =>
                    room.available ? enterAcademy() : setDestination(room)
                  }
                  aria-label={`${room.title}${room.available ? ": entrar" : ": disponível em breve"}`}
                >
                  <span className="passage-architecture">
                    <span className="door-arch" />
                    <span className="door-light" />
                    <Icon className="door-emblem" size={35} strokeWidth={0.8} />
                    <span className="door-knob" />
                  </span>
                  <span className="door-title">{room.title}</span>
                  <span className="door-subtitle">{room.subtitle}</span>
                  <span className="door-action">
                    {room.available ? (
                      <>
                        <span>Explorar</span>
                        <MoveUpRight size={13} />
                      </>
                    ) : (
                      <>
                        <LockKeyhole size={10} />
                        <span>Em breve</span>
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="school-hint">
            <Compass size={16} strokeWidth={1} /> Siga a luz. A primeira memória
            está esperando na Academia.
          </p>
        </section>
      )}

      {isAcademy && (
        <Academy onBack={exitAcademy} onOpen={openPortrait} visited={visited} />
      )}

      {state !== STATES.LOADING && (
        <footer
          className={`world-footer ${inWorld ? "world-footer-compact" : ""}`}
        >
          <div className="chapter-marker">
            <span className="chapter-number">0{chapter + 1}</span>
            <span className="chapter-line" />
            <span>{stateLabels[state]}</span>
          </div>
          <div
            className="journey-track"
            aria-label={`Etapa ${chapter + 1} de 4`}
          >
            <span className={chapter >= 0 ? "lit" : ""} />
            <i />
            <span className={chapter >= 1 ? "lit" : ""} />
            <i />
            <span className={chapter >= 2 ? "lit" : ""} />
            <i />
            <span className={chapter >= 3 ? "lit" : ""} />
          </div>
          <button
            className="explore-help"
            onClick={showHelp}
            aria-label="Como explorar a jornada"
          >
            <span>Deixe a curiosidade guiar você</span>
            <Compass size={19} strokeWidth={1} />
          </button>
        </footer>
      )}
      {travel && (
        <div className="travel-veil" aria-live="polite">
          <Sigil />
          <span>
            {travel === STATES.ACADEMY
              ? "Pelo corredor das amizades…"
              : "As portas se abrem para você…"}
          </span>
        </div>
      )}
      {soundNotice && (
        <p className="sound-notice" role="status">
          {soundNotice}
        </p>
      )}
      <Parchment
        memory={memory}
        destination={destination}
        onClose={closePortraitMessage}
      />
      {inWorld && (
        <button
          className="restart-button"
          onClick={() => moveThrough(STATES.INTRO)}
          aria-label="Voltar à abertura e reviver a jornada"
        >
          <RotateCcw size={14} />
        </button>
      )}
    </main>
  );
}
