import { bestTextColor } from "../colorUtils.js";

// Resuelve los colores de superficie (fondo/texto/paneles) de la muestra
// según el modo de fondo elegido — independiente del tema general de la app.
export function resolveSampleSurface({ backgroundMode, customBackground, gradientFromIndex, gradientToIndex, palette }) {
  if (backgroundMode === "claro") {
    return { bg: "#FFFFFF", fg: "#16161A", muted: "#6B6B72", panel: "#F7F7F6", border: "#E4E4E8" };
  }
  if (backgroundMode === "personalizado") {
    const fg = bestTextColor(customBackground);
    return {
      bg: customBackground,
      fg,
      muted: fg === "#FFFFFF" ? "rgba(255,255,255,.68)" : "rgba(20,20,25,.62)",
      panel: "rgba(255,255,255,.08)",
      border: "rgba(255,255,255,.18)",
    };
  }
  if (backgroundMode === "degrade") {
    const a = palette[gradientFromIndex % palette.length];
    const b = palette[gradientToIndex % palette.length];
    const fg = bestTextColor(a);
    return {
      bg: `linear-gradient(135deg, ${a}, ${b})`,
      fg,
      muted: fg === "#FFFFFF" ? "rgba(255,255,255,.68)" : "rgba(20,20,25,.62)",
      panel: "rgba(255,255,255,.1)",
      border: "rgba(255,255,255,.2)",
    };
  }
  // "oscuro" (default)
  return { bg: "#141419", fg: "#F2F2F5", muted: "#9A9AA5", panel: "#1E1E26", border: "#2A2A33" };
}
