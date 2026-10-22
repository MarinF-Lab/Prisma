/* ---------- Utilidades de color ---------- */

export function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
export function rgbToHex(r, g, b) {
  const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
export function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}
export function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}
export function hexToHsl(hex) { const { r, g, b } = hexToRgb(hex); return rgbToHsl(r, g, b); }
export function hslToHex(h, s, l) { const { r, g, b } = hslToRgb(h, s, l); return rgbToHex(r, g, b); }
export function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const chan = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
}
export function contrastRatio(hexA, hexB) {
  const l1 = relativeLuminance(hexA), l2 = relativeLuminance(hexB);
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}
export function wcagLabel(ratio) {
  if (ratio >= 7) return { tag: "AAA", ok: true };
  if (ratio >= 4.5) return { tag: "AA", ok: true };
  if (ratio >= 3) return { tag: "AA·grande", ok: true };
  return { tag: "Falla", ok: false };
}
export function bestTextColor(bgHex) {
  const white = contrastRatio(bgHex, "#FFFFFF");
  const black = contrastRatio(bgHex, "#000000");
  return white >= black ? "#FFFFFF" : "#000000";
}

/* ---------- Generación de armonías ---------- */

export const HARMONIES = {
  complementario: (h) => [h, h + 180],
  analogo: (h) => [h - 30, h, h + 30],
  triadico: (h) => [h, h + 120, h + 240],
  tetradico: (h) => [h, h + 90, h + 180, h + 270],
  dividido: (h) => [h, h + 150, h + 210],
  compuesto: (h) => [h, h + 60, h + 180, h + 240],
  monocromatico: (h) => [h, h, h, h, h, h, h, h, h, h],
};
export function generateHarmony(baseHex, type, count) {
  const { h, s, l } = hexToHsl(baseHex);
  if (type === "monocromatico") {
    const satM = Math.max(s, 35);
    if (count === 1) return [hslToHex(h, satM, l)];
    // Escala completa (clara -> oscura) con espaciado amplio, desplazada para
    // que uno de sus escalones caiga exactamente en la luminosidad del color base.
    const LMAX = 92, LMIN = 14;
    const step = (LMAX - LMIN) / (count - 1);
    const positions = Array.from({ length: count }, (_, i) => LMAX - i * step);
    let closestIdx = 0;
    let closestDist = Infinity;
    positions.forEach((p, i) => {
      const d = Math.abs(p - l);
      if (d < closestDist) {
        closestDist = d;
        closestIdx = i;
      }
    });
    const delta = l - positions[closestIdx];
    const shifted = positions.map((p) => Math.min(97, Math.max(4, p + delta)));
    return shifted.map((ll) => hslToHex(h, satM, ll));
  }
  if (type === "aleatorio") {
    return Array.from({ length: count }, () =>
      hslToHex(Math.random() * 360, 55 + Math.random() * 35, 40 + Math.random() * 30)
    );
  }
  const baseHues = HARMONIES[type] ? HARMONIES[type](h) : HARMONIES.complementario(h);
  const hues = [];
  for (let i = 0; i < count; i++) {
    hues.push(baseHues[i % baseHues.length] + (i >= baseHues.length ? (i * 11) % 40 : 0));
  }
  return hues.map((hh, i) => {
    const varL = l + (i % 2 === 0 ? 0 : -8);
    return hslToHex(hh, Math.min(90, Math.max(35, s)), Math.min(78, Math.max(28, varL)));
  });
}
export function randomHex() {
  return hslToHex(Math.random() * 360, 55 + Math.random() * 30, 45 + Math.random() * 25);
}
