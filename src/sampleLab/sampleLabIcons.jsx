import React from "react";

// Mismo estilo que los íconos ya existentes de la app (IconHome/IconSearch/IconSaved
// en App.jsx): SVG a mano, stroke-only, viewBox 24x24. Uno por sección agrupada de
// la barra móvil del Laboratorio de Muestras.
const BASE = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

export function IconComponentes({ size = 20 }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="8" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
      <rect x="13" y="13" width="8" height="8" rx="2" />
    </svg>
  );
}

export function IconRoles({ size = 20 }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <circle cx="9" cy="14" r="6" />
      <circle cx="15" cy="9" r="6" />
    </svg>
  );
}

export function IconEstilo({ size = 20 }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <circle cx="9" cy="7" r="2" fill="currentColor" stroke="none" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
      <line x1="4" y1="17" x2="20" y2="17" />
      <circle cx="12" cy="17" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconFondo({ size = 20 }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M12 3c3 4 6 6.5 6 10a6 6 0 01-12 0c0-3.5 3-6 6-10z" />
    </svg>
  );
}

export function IconBotones({ size = 20 }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <rect x="3" y="8" width="18" height="8" rx="4" />
    </svg>
  );
}

export function IconTipografia({ size = 20 }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M6 20L11 4h2l5 16M8 14h8" />
    </svg>
  );
}

export function IconPantalla({ size = 20 }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 20h8M12 17v3" />
    </svg>
  );
}

export function IconExportar({ size = 20 }) {
  return (
    <svg {...BASE} width={size} height={size}>
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
    </svg>
  );
}
