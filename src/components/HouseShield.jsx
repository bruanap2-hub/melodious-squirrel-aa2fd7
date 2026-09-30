import { useEffect, useRef } from "react";
import { reducedMotion } from "../lib/world";

export function createHouseShield(house = "lufa-lufa") {
  return (
    <svg
      viewBox="0 0 360 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Brasão medieval da Lufa-Lufa, com um texugo, folhas e estrelas douradas"
      data-house={house}
    >
      <defs>
        <linearGradient
          id="metal"
          x1="50"
          y1="0"
          x2="300"
          y2="380"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f2d99b" />
          <stop offset=".28" stopColor="#99703a" />
          <stop offset=".5" stopColor="#f4da96" />
          <stop offset=".72" stopColor="#76532d" />
          <stop offset="1" stopColor="#c69d55" />
        </linearGradient>
        <linearGradient
          id="enamel"
          x1="100"
          y1="80"
          x2="260"
          y2="320"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#d6ac50" />
          <stop offset=".5" stopColor="#af8231" />
          <stop offset="1" stopColor="#675021" />
        </linearGradient>
        <radialGradient id="shieldLight">
          <stop stopColor="#ffedbc" stopOpacity=".3" />
          <stop offset="1" stopColor="#ffedbc" stopOpacity="0" />
        </radialGradient>
        <pattern
          id="engraving"
          width="12"
          height="12"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="m0 6 6-6 6 6-6 6Z"
            stroke="#f2d389"
            strokeOpacity=".12"
            strokeWidth=".6"
          />
        </pattern>
        <clipPath id="shieldClip">
          <path d="M85 105Q180 65 275 105V218Q270 296 180 345Q90 296 85 218Z" />
        </clipPath>
      </defs>
      <g className="shield-details" stroke="url(#metal)" strokeWidth="2">
        <path d="M86 304C25 250 31 164 63 122M274 304C335 250 329 164 297 122" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i} transform={`translate(0 ${i * 25})`}>
            <path
              d={`M${55 - (i % 2) * 5} ${137}q-31-12-25-34 30 7 25 34Z`}
              fill="url(#metal)"
            />
            <path
              d={`M${305 + (i % 2) * 5} ${137}q31-12 25-34-30 7-25 34Z`}
              fill="url(#metal)"
            />
          </g>
        ))}
        <path
          d="m147 70-8-28 25 13 16-30 16 30 25-13-8 28Z"
          fill="url(#metal)"
        />
        <path d="M148 77h64M159 83h42" strokeWidth="4" />
        <path d="m180 4 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z" fill="url(#metal)" />
      </g>
      <path
        className="shield-base"
        d="M75 99Q180 50 285 99V218Q284 306 180 360Q76 306 75 218Z"
        fill="#26291e"
        stroke="url(#metal)"
        strokeWidth="8"
      />
      <path
        className="shield-outline"
        d="M85 105Q180 65 275 105V218Q270 296 180 345Q90 296 85 218Z"
        fill="url(#enamel)"
        stroke="url(#metal)"
        strokeWidth="3"
        pathLength="1"
      />
      <g className="shield-details" clipPath="url(#shieldClip)">
        <path
          d="M110 70h32v290h-32zM218 70h32v290h-32z"
          fill="#27291d"
          opacity=".9"
        />
        <path d="M85 85h195v265H85Z" fill="url(#engraving)" />
        <circle
          cx="180"
          cy="207"
          r="66"
          fill="#c5a054"
          stroke="#e5c276"
          strokeWidth="2"
        />
        <circle cx="180" cy="207" r="60" fill="#333323" stroke="#8d6d35" />
        <g transform="translate(106 149)">
          <path
            d="M21 78Q5 72 12 53Q18 25 50 23Q67 16 88 30L107 39 129 56 138 67 124 74 109 70 97 78 94 101 80 101 79 84 46 83 40 101 25 101 28 80Z"
            fill="#ded4ae"
          />
          <path
            d="M14 58Q26 25 58 26L76 34 57 55 47 81 30 80Z"
            fill="#747464"
          />
          <path
            d="m81 30 11-13 10 2 2 18M90 44l18-4 18 16-13 8Z"
            fill="#1d211d"
          />
          <path d="m92 35 5-9 3 9-3 5Z" fill="#b7ae8e" />
          <path d="m107 44 14 10-9 3-12-9Z" fill="#1d211d" />
          <circle cx="112" cy="53" r="2" fill="#eadca4" />
          <path d="m133 63 7 3-4 5-8-3Z" fill="#1d211d" />
          <path
            d="m21 76-13 1-3-6 11-4M27 101h14M80 101h15"
            stroke="#d2bd7d"
            strokeWidth="3"
          />
        </g>
        <path
          d="m180 111 3 8 9 1-7 6 2 9-7-5-7 5 2-9-7-6 9-1Zm0 174 3 8 9 1-7 6 2 9-7-5-7 5 2-9-7-6 9-1Z"
          fill="#f1d392"
        />
      </g>
      <g className="shield-details">
        <path
          d="m54 317 41 8q85 33 170 0l41-8-12 30 6 16-44-9q-76 32-152 0l-44 9 6-16Z"
          fill="#303123"
          stroke="url(#metal)"
          strokeWidth="2"
        />
        <text
          x="180"
          y="354"
          textAnchor="middle"
          fill="#e0c48a"
          fontFamily="Cinzel, serif"
          fontSize="13"
          letterSpacing="4"
        >
          LEALDADE & AFETO
        </text>
      </g>
      <ellipse
        className="shield-sheen"
        cx="135"
        cy="170"
        rx="100"
        ry="150"
        fill="url(#shieldLight)"
      />
    </svg>
  );
}

export function animateHouseShield(element, onComplete) {
  const quiet = reducedMotion();
  const animations = [];
  const outline = element.querySelector(".shield-outline");
  animations.push(
    outline.animate(
      [
        { strokeDasharray: 1, strokeDashoffset: 1, fillOpacity: 0 },
        {
          strokeDasharray: 1,
          strokeDashoffset: 0,
          fillOpacity: 0.1,
          offset: 0.6,
        },
        { strokeDasharray: 1, strokeDashoffset: 0, fillOpacity: 1 },
      ],
      { duration: quiet ? 500 : 3000, fill: "both", easing: "ease-in-out" },
    ),
  );
  element.querySelectorAll(".shield-details, .shield-base").forEach((item, i) =>
    animations.push(
      item.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: quiet ? 300 : 1500,
        delay: quiet ? 100 : 1000 + i * 420,
        fill: "both",
      }),
    ),
  );
  const finish = element.animate(
    [
      { opacity: 0, transform: "translateY(18px) scale(.92)" },
      { opacity: 1, transform: "translateY(0) scale(1)" },
    ],
    {
      duration: quiet ? 700 : 4600,
      easing: "cubic-bezier(.2,.7,.2,1)",
      fill: "both",
    },
  );
  animations.push(finish);
  finish.finished.then(onComplete).catch(() => {});
  return () => animations.forEach((animation) => animation.cancel());
}

export default function HouseShield({ onComplete }) {
  const ref = useRef(null);
  useEffect(() => animateHouseShield(ref.current, onComplete), [onComplete]);
  return (
    <div ref={ref} className="house-shield">
      {createHouseShield()}
    </div>
  );
}
