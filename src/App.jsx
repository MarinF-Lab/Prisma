import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "./useAuth.js";
import { useUserPalettes } from "./useUserPalettes.js";
import { useColorLibrary } from "./useColorLibrary.js";
import { LoginModal } from "./LoginModal.jsx";
import { ExportModal } from "./ExportModal.jsx";

/* ============================================================
   PRISMA — Muestrario y generador de combinaciones de color
   ============================================================ */

const LOGO_B64 = "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";

/* ---------- Utilidades de color ---------- */

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
function rgbToHex(r, g, b) {
  const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
function rgbToHsl(r, g, b) {
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
function hslToRgb(h, s, l) {
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
function hexToHsl(hex) { const { r, g, b } = hexToRgb(hex); return rgbToHsl(r, g, b); }
function hslToHex(h, s, l) { const { r, g, b } = hslToRgb(h, s, l); return rgbToHex(r, g, b); }
function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const chan = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
}
function contrastRatio(hexA, hexB) {
  const l1 = relativeLuminance(hexA), l2 = relativeLuminance(hexB);
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}
function wcagLabel(ratio) {
  if (ratio >= 7) return { tag: "AAA", ok: true };
  if (ratio >= 4.5) return { tag: "AA", ok: true };
  if (ratio >= 3) return { tag: "AA·grande", ok: true };
  return { tag: "Falla", ok: false };
}
function bestTextColor(bgHex) {
  const white = contrastRatio(bgHex, "#FFFFFF");
  const black = contrastRatio(bgHex, "#000000");
  return white >= black ? "#FFFFFF" : "#000000";
}

/* ---------- Generación de armonías ---------- */

const HARMONIES = {
  complementario: (h) => [h, h + 180],
  analogo: (h) => [h - 30, h, h + 30],
  triadico: (h) => [h, h + 120, h + 240],
  tetradico: (h) => [h, h + 90, h + 180, h + 270],
  dividido: (h) => [h, h + 150, h + 210],
  compuesto: (h) => [h, h + 60, h + 180, h + 240],
  monocromatico: (h) => [h, h, h, h, h, h, h, h, h, h],
};
function generateHarmony(baseHex, type, count) {
  const { h, s, l } = hexToHsl(baseHex);
  if (type === "monocromatico") {
    const satM = Math.max(s, 35);
    const MIN_L = 8, MAX_L = 94, STEP = 8;
    const candidates = new Set([Math.round(l)]);
    for (let v = MIN_L; v <= MAX_L; v += STEP) candidates.add(v);
    const closest = [...candidates].sort((a, b) => Math.abs(a - l) - Math.abs(b - l));
    const picked = closest.slice(0, count).sort((a, b) => b - a);
    return picked.map((ll) => hslToHex(h, satM, ll));
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
function randomHex() {
  return hslToHex(Math.random() * 360, 55 + Math.random() * 30, 45 + Math.random() * 25);
}

/* ---------- Datos ---------- */

const CATEGORIES = ["Pasteles", "Vibrantes", "Oscuros", "Tierra", "Neón", "Monocromáticos"];

const CURATED_PALETTES = [
  { name: "Brisa Suave", type: "analogo", cat: "Pasteles", base: "#8B7CF0", count: 3 },
  { name: "Océano Profundo", type: "monocromatico", cat: "Oscuros", base: "#1E4E8C", count: 3 },
  { name: "Atardecer", type: "analogo", cat: "Vibrantes", base: "#FF6B5B", count: 3 },
  { name: "Ciber Noche", type: "triadico", cat: "Neón", base: "#00F0FF", count: 3 },
  { name: "Desierto", type: "analogo", cat: "Tierra", base: "#C9A876", count: 3 },
  { name: "Bosque", type: "analogo", cat: "Tierra", base: "#6E7454", count: 4 },
];

const ROLES = ["Principal", "Secundario", "Acento"];
const HARMONY_OPTIONS = [
  { id: "complementario", label: "Complementario", icon: "◐" },
  { id: "analogo", label: "Análogo", icon: "◭" },
  { id: "triadico", label: "Triádico", icon: "▲" },
  { id: "tetradico", label: "Tetrádico", icon: "◆" },
  { id: "dividido", label: "Dividido", icon: "◬" },
  { id: "compuesto", label: "Compuesto", icon: "▰" },
  { id: "monocromatico", label: "Monocromático", icon: "●" },
];

/* ---------- Componentes pequeños ---------- */

function useCopy() {
  const [copiedKey, setCopiedKey] = useState(null);
  const copy = (key, text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1100);
  };
  return { copiedKey, copy };
}

function ContrastBadge({ ratio }) {
  const { tag, ok } = wcagLabel(ratio);
  return (
    <span
      className="text-[10px] px-1.5 py-0.5 rounded-sm font-medium"
      style={{
        background: ok ? "rgba(60,200,120,0.18)" : "rgba(230,70,70,0.18)",
        color: ok ? "#2E9E5B" : "#D64545",
      }}
    >
      {ratio.toFixed(1)} · {tag}
    </span>
  );
}

/* Tarjeta "mockup" de paleta: título + cuerpo + link sobre fondo real */
function PaletteMockupCard({ name, colors, onClick, meta }) {
  const bg = colors[0];
  const linkColor = colors[Math.min(2, colors.length - 1)];
  const fg = bestTextColor(bg);
  const fgMuted = fg === "#FFFFFF" ? "rgba(255,255,255,0.68)" : "rgba(20,20,25,0.6)";
  return (
    <button onClick={onClick} className="text-left flex-shrink-0 w-40 group">
      <div
        className="rounded-lg p-3 h-24 flex flex-col justify-end transition-transform group-active:scale-[0.97]"
        style={{ background: bg }}
      >
        <p className="text-sm font-semibold leading-tight" style={{ color: fg }}>
          Título
        </p>
        <p className="text-[11px]" style={{ color: fgMuted }}>
          Cuerpo &{" "}
          <span style={{ color: linkColor, fontWeight: 600 }}>link</span>
        </p>
      </div>
      <p className="text-xs font-medium mt-1.5 truncate">{name}</p>
      {meta && <p className="text-[10px] opacity-50">{meta}</p>}
    </button>
  );
}

/* Tarjeta de muestra individual dentro de la Zona de pruebas */
function ColorSampleCard({ color, role, sampleDark, copiedKey, onCopy, locked, onToggleLock }) {
  const sampleBg = sampleDark ? "#141419" : "#FFFFFF";
  const sampleFg = sampleDark ? "#F2F2F5" : "#141419";
  const textOnColor = bestTextColor(color);
  const ratioOnSample = contrastRatio(color, sampleBg);
  const ratioTextOnColor = contrastRatio(color, textOnColor);
  const key = `${color}-${role}`;

  return (
    <div
      className="rounded-md overflow-hidden border flex flex-col"
      style={{ borderColor: sampleDark ? "#2A2A33" : "#E4E4E8", background: sampleBg }}
    >
      <div className="h-16 relative" style={{ background: color }}>
        <button
          onClick={onToggleLock}
          className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
          style={{ background: "rgba(0,0,0,0.35)", color: "#fff" }}
          title={locked ? "Desbloquear color" : "Bloquear color (no cambia al regenerar)"}
        >
          {locked ? "🔒" : "🔓"}
        </button>
      </div>
      <div className="p-2.5 flex flex-col gap-1.5" style={{ color: sampleFg }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wide opacity-60">{role}</span>
          <button
            onClick={() => onCopy(key, color)}
            className="text-[10px] px-1.5 py-0.5 rounded border border-current/30 active:scale-95 transition-transform"
            style={{ fontFamily: "monospace" }}
            title="Copiar código HEX"
          >
            {copiedKey === key ? "✓" : color}
          </button>
        </div>
        <p className="text-xs" style={{ color }}>
          Texto de ejemplo
        </p>
        <button
          onClick={() => onCopy(key + "-btn", color)}
          className="text-xs px-2.5 py-1.5 rounded-md font-medium self-start active:scale-95 transition-transform"
          style={{ background: color, color: textOnColor }}
          title="Presiona para copiar el color"
        >
          {copiedKey === key + "-btn" ? "Copiado ✓" : "Botón"}
        </button>
        <div className="flex gap-1.5 flex-wrap pt-0.5">
          <ContrastBadge ratio={ratioOnSample} />
          <ContrastBadge ratio={ratioTextOnColor} />
        </div>
      </div>
    </div>
  );
}

/* Mockup de interfaz completa: navbar + card de producto + botón, todo
   junto, para ver la paleta aplicada a un layout real. */
function InterfaceMockup({ colors, sampleDark }) {
  const navBg = colors[0];
  const heroAccent = colors[Math.min(1, colors.length - 1)];
  const linkAccent = colors[colors.length - 1];
  const cardBg = sampleDark ? "#1B1B22" : "#FFFFFF";
  const pageBg = sampleDark ? "#141419" : "#F4F4F2";
  const pageFg = sampleDark ? "#F2F2F5" : "#16161A";
  const pageMuted = sampleDark ? "#9A9AA5" : "#6B6B72";
  const borderColor = sampleDark ? "#2A2A33" : "#E4E4E8";

  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor }}>
      <div className="flex items-center justify-between px-3 py-2.5" style={{ background: navBg }}>
        <span className="text-sm font-semibold" style={{ color: bestTextColor(navBg) }}>
          Marca
        </span>
        <div className="flex gap-1.5">
          {colors.map((c, i) => (
            <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
      </div>

      <div className="p-4" style={{ background: pageBg }}>
        <p className="text-[15px] font-semibold mb-1" style={{ color: pageFg }}>
          Título de producto
        </p>
        <p className="text-xs mb-3" style={{ color: pageMuted }}>
          Una descripción corta de ejemplo para ver el contraste sobre el fondo.
        </p>
        <button
          className="text-xs px-3 py-1.5 rounded-md font-medium mb-3"
          style={{ background: heroAccent, color: bestTextColor(heroAccent) }}
        >
          Acción principal
        </button>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {colors.map((c, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-1 rounded-full font-medium"
              style={{ background: c, color: bestTextColor(c) }}
            >
              Etiqueta {i + 1}
            </span>
          ))}
        </div>

        <div className="rounded-md p-3 mb-3" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
          <p className="text-xs font-medium mb-1" style={{ color: pageFg }}>
            Tarjeta
          </p>
          <p className="text-[11px]" style={{ color: pageMuted }}>
            Contenido con un{" "}
            <span style={{ color: linkAccent, fontWeight: 600 }}>link de acento</span>.
          </p>
        </div>

        <div className="rounded-md p-3" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
          <p className="text-xs font-medium mb-3" style={{ color: pageFg }}>
            Gráfico de ejemplo
          </p>
          <div className="flex items-end gap-1.5" style={{ height: 64 }}>
            {colors.map((c, i) => {
              const heightPattern = [55, 85, 40, 70, 95, 60, 80, 45, 65, 90];
              const h = heightPattern[i % heightPattern.length];
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full rounded-sm"
                    style={{ height: `${h}%`, background: c }}
                    title={c}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function IconHome({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 11L12 4l8 7v8a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-8z"
        stroke={active ? "#8B5CF6" : "currentColor"} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function IconSearch({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="6.5" stroke={active ? "#8B5CF6" : "currentColor"} strokeWidth="1.6" />
      <line x1="16" y1="16" x2="21" y2="21" stroke={active ? "#8B5CF6" : "currentColor"} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IconSaved({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 3h12v18l-6-4-6 4V3z" stroke={active ? "#8B5CF6" : "currentColor"} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function LogoMark({ size = 22 }) {
  return (
    <img
      src={`data:image/png;base64,${LOGO_B64}`}
      alt="Prisma"
      style={{ width: size, height: size, objectFit: "contain", borderRadius: 4 }}
    />
  );
}

/* ---------- App principal ---------- */

export default function Prisma() {
  const [screen, setScreen] = useState("inicio"); // inicio | explorar | pruebas | guardadas
  const [uiDark, setUiDark] = useState(true);
  const [sampleDark, setSampleDark] = useState(true);

  const [search, setSearch] = useState("");
  const [activeRoles, setActiveRoles] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Todas");

  const [harmonyType, setHarmonyType] = useState("analogo");
  const [count, setCount] = useState(4);
  const [baseColor, setBaseColor] = useState("#2B6CFF");
  const [palette, setPalette] = useState(() => generateHarmony("#2B6CFF", "analogo", 4));
  const [lockedIndices, setLockedIndices] = useState(() => new Set());
  const [sampleView, setSampleView] = useState("interfaz"); // interfaz | tarjetas
  const [exportOpen, setExportOpen] = useState(false);

  const [saveName, setSaveName] = useState("");
  const [savedSearch, setSavedSearch] = useState("");

  const { copiedKey, copy } = useCopy();

  const { user, authLoading, signInWithGoogle, signOutUser } = useAuth();
  const {
    palettes: savedPalettes,
    loading: savedLoading,
    savePalette: savePaletteRemote,
    removePalette: removePaletteRemote,
    toggleFavPalette: toggleFavRemote,
  } = useUserPalettes(user?.uid);

  const [loginModal, setLoginModal] = useState(null); // null | "welcome" | "action"
  const [loginError, setLoginError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [welcomeSeen, setWelcomeSeen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user && !welcomeSeen) {
      setLoginModal("welcome");
      setWelcomeSeen(true);
    }
  }, [authLoading, user, welcomeSeen]);

  const requireLogin = () => {
    setLoginError("");
    setLoginModal("action");
  };

  const handleGoogleLogin = async () => {
    setLoginBusy(true);
    setLoginError("");
    try {
      await signInWithGoogle();
      setLoginModal(null);
    } catch (e) {
      setLoginError("No se pudo iniciar sesión. Intenta de nuevo.");
    } finally {
      setLoginBusy(false);
    }
  };

  const ui = uiDark
    ? { bg: "#0A0A0F", panel: "#15151B", panel2: "#1B1B22", border: "#26262E", text: "#F2F2F5", muted: "#9A9AA5" }
    : { bg: "#FAFAF8", panel: "#FFFFFF", panel2: "#F2F2EF", border: "#E6E6E2", text: "#16161A", muted: "#6B6B72" };

  const toggleRole = (role) =>
    setActiveRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));

  const { colors: colorLibrary } = useColorLibrary();

  const filteredColors = useMemo(() => {
    return colorLibrary.filter((c) => {
      const matchCat = activeCategory === "Todas" || c.cat === activeCategory;
      const q = search.trim().toLowerCase();
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q.replace("#", ""));
      return matchCat && matchSearch;
    });
  }, [colorLibrary, search, activeCategory]);

  const toggleLock = (i) => {
    setLockedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const regenerate = useCallback(
    (type = harmonyType, c = count, base = baseColor) => {
      const fresh = generateHarmony(base, type, c);
      setPalette((prev) => fresh.map((col, i) => (lockedIndices.has(i) ? prev[i] ?? col : col)));
      if (c < count) setLockedIndices((prev) => new Set([...prev].filter((i) => i < c)));
    },
    [harmonyType, count, baseColor, lockedIndices]
  );

  const handleFullRandom = () => {
    const newBase = randomHex();
    const types = Object.keys(HARMONIES);
    const newType = types[Math.floor(Math.random() * types.length)];
    setBaseColor(newBase);
    setHarmonyType(newType);
    const fresh = generateHarmony(newBase, newType, count);
    setPalette((prev) => fresh.map((col, i) => (lockedIndices.has(i) ? prev[i] ?? col : col)));
  };

  const loadCurated = (p) => {
    setBaseColor(p.base);
    setHarmonyType(p.type);
    setCount(p.count);
    setPalette(generateHarmony(p.base, p.type, p.count));
    setScreen("pruebas");
  };

  const savePalette = () => {
    if (!user) {
      requireLogin();
      return;
    }
    const name = saveName.trim() || `Paleta ${savedPalettes.length + 1}`;
    savePaletteRemote(user.uid, { name, colors: palette }).catch(() => {});
    setSaveName("");
  };
  const removeSaved = (id) => {
    if (!user) return;
    removePaletteRemote(user.uid, id).catch(() => {});
  };
  const toggleFav = (id, fav) => {
    if (!user) return;
    toggleFavRemote(user.uid, id, fav).catch(() => {});
  };

  const filteredSaved = savedPalettes.filter((p) =>
    p.name.toLowerCase().includes(savedSearch.trim().toLowerCase())
  );

  const roleFor = (i) => ROLES[i % ROLES.length];

  const NAV_ITEMS = [
    { id: "inicio", label: "Inicio", Icon: IconHome },
    { id: "explorar", label: "Explorar", Icon: IconSearch },
    { id: "pruebas", label: "Pruebas", Icon: null },
    { id: "guardadas", label: "Guardadas", Icon: IconSaved },
  ];

  return (
    <div style={{ background: ui.bg, color: ui.text, minHeight: "100%" }} className="font-sans">
      <div className="max-w-md mx-auto pb-24 relative min-h-full">
        {/* ---------- Barra superior común ---------- */}
        <header
          className="flex items-center justify-between px-4 pt-5 pb-3 sticky top-0 z-20"
          style={{ background: ui.bg }}
        >
          <div className="flex items-center gap-2">
            <LogoMark size={24} />
            <span className="text-base font-semibold tracking-wide">PRISMA</span>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={signOutUser}
                className="w-8 h-8 rounded-full overflow-hidden border flex items-center justify-center"
                style={{ borderColor: ui.border }}
                title={`Cerrar sesión (${user.displayName || user.email || ""})`}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs">{(user.displayName || "?")[0]}</span>
                )}
              </button>
            ) : (
              <button
                onClick={requireLogin}
                className="text-[11px] px-2.5 py-1.5 rounded-full border"
                style={{ borderColor: ui.border, color: ui.muted }}
              >
                Iniciar sesión
              </button>
            )}
            <button
              onClick={() => setUiDark((v) => !v)}
              className="w-8 h-8 rounded-full border flex items-center justify-center"
              style={{ borderColor: ui.border, color: ui.muted }}
            >
              {uiDark ? "☀" : "●"}
            </button>
          </div>
        </header>

        <main className="px-4">
          {/* ================= INICIO ================= */}
          {screen === "inicio" && (
            <>
              <h1 className="text-xl font-semibold mt-1">Inicio</h1>
              <p className="text-sm mb-4" style={{ color: ui.muted }}>
                ¿Qué quieres hacer hoy?
              </p>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  { label: "Generar paleta", target: "pruebas" },
                  { label: "Explorar colores", target: "explorar" },
                  { label: "Zona de pruebas", target: "pruebas" },
                ].map((a) => (
                  <button
                    key={a.label}
                    onClick={() => setScreen(a.target)}
                    className="rounded-lg border p-3 text-xs font-medium text-center"
                    style={{ borderColor: ui.border, background: ui.panel }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>

              <h2 className="text-sm font-medium mb-2" style={{ color: ui.muted }}>
                Explorar por categoría
              </h2>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setScreen("explorar");
                    }}
                    className="rounded-lg border p-3 text-left text-xs font-medium"
                    style={{ borderColor: ui.border, background: ui.panel }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-medium" style={{ color: ui.muted }}>
                  Paletas destacadas
                </h2>
              </div>
              <div
                className="grid grid-rows-3 grid-flow-col auto-cols-max gap-3 overflow-x-auto pb-2"
                style={{ scrollbarWidth: "none" }}
              >
                {CURATED_PALETTES.map((p) => (
                  <PaletteMockupCard
                    key={p.name}
                    name={p.name}
                    colors={generateHarmony(p.base, p.type, p.count)}
                    onClick={() => loadCurated(p)}
                  />
                ))}
              </div>
            </>
          )}

          {/* ================= EXPLORAR ================= */}
          {screen === "explorar" && (
            <>
              <h1 className="text-xl font-semibold mt-1 mb-3">Explorar</h1>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o código HEX…"
                className="w-full text-sm px-3 py-2 rounded-md border outline-none mb-3"
                style={{ background: ui.panel, borderColor: ui.border, color: ui.text }}
              />
              <div className="flex gap-2 mb-2 flex-wrap">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => toggleRole(role)}
                    className="text-xs px-2.5 py-1 rounded-full border"
                    style={{
                      borderColor: activeRoles.includes(role) ? "#8B5CF6" : ui.border,
                      background: activeRoles.includes(role) ? "#8B5CF622" : "transparent",
                      color: activeRoles.includes(role) ? "#8B5CF6" : ui.muted,
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {["Todas", ...CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="text-xs px-3 py-1 rounded-full border whitespace-nowrap flex-shrink-0"
                    style={{
                      borderColor: activeCategory === cat ? ui.text : ui.border,
                      background: activeCategory === cat ? ui.text : "transparent",
                      color: activeCategory === cat ? ui.bg : ui.muted,
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <p className="text-xs mb-2" style={{ color: ui.muted }}>
                {filteredColors.length} colores
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {filteredColors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      setBaseColor(c.hex);
                      regenerate(harmonyType, count, c.hex);
                      setScreen("pruebas");
                    }}
                    className="rounded-md overflow-hidden border text-left"
                    style={{ borderColor: ui.border, background: ui.panel }}
                  >
                    <div className="h-12" style={{ background: c.hex }} />
                    <div className="px-1.5 py-1">
                      <p className="text-[10px] truncate">{c.name}</p>
                      <p className="text-[9px]" style={{ color: ui.muted, fontFamily: "monospace" }}>
                        {c.hex}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ================= ZONA DE PRUEBAS ================= */}
          {screen === "pruebas" && (
            <>
              <div className="mt-1 mb-3">
                <h1 className="text-lg font-semibold">Zona de pruebas</h1>
                <p className="text-xs" style={{ color: ui.muted }}>
                  Crea y prueba combinaciones
                </p>
              </div>

              <div className="flex gap-2 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {HARMONY_OPTIONS.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      setHarmonyType(h.id);
                      regenerate(h.id, count, baseColor);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full border whitespace-nowrap flex-shrink-0 flex items-center gap-1"
                    style={{
                      borderColor: harmonyType === h.id ? "#8B5CF6" : ui.border,
                      background: harmonyType === h.id ? "#8B5CF622" : ui.panel,
                      color: harmonyType === h.id ? "#8B5CF6" : ui.muted,
                    }}
                  >
                    <span>{h.icon}</span> {h.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-3">
                <label className="text-xs" style={{ color: ui.muted }}>
                  Color base
                </label>
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => {
                    setBaseColor(e.target.value);
                    regenerate(harmonyType, count, e.target.value);
                  }}
                  className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                />
                <span className="text-xs" style={{ fontFamily: "monospace", color: ui.muted }}>
                  {baseColor}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <label className="text-xs" style={{ color: ui.muted }}>
                  Cantidad de colores
                </label>
                <button
                  onClick={() => {
                    const n = Math.max(2, count - 1);
                    setCount(n);
                    regenerate(harmonyType, n, baseColor);
                  }}
                  className="w-7 h-7 rounded-full border flex items-center justify-center"
                  style={{ borderColor: ui.border }}
                >
                  −
                </button>
                <span className="text-sm font-medium w-4 text-center">{count}</span>
                <button
                  onClick={() => {
                    const n = Math.min(10, count + 1);
                    setCount(n);
                    regenerate(harmonyType, n, baseColor);
                  }}
                  className="w-7 h-7 rounded-full border flex items-center justify-center"
                  style={{ borderColor: ui.border }}
                >
                  +
                </button>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-1.5">
                  {[
                    { id: "interfaz", label: "Interfaz" },
                    { id: "tarjetas", label: "Tarjetas" },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSampleView(v.id)}
                      className="text-xs px-3 py-1.5 rounded-full border"
                      style={{
                        borderColor: sampleView === v.id ? "#8B5CF6" : ui.border,
                        background: sampleView === v.id ? "#8B5CF622" : "transparent",
                        color: sampleView === v.id ? "#8B5CF6" : ui.muted,
                      }}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setSampleDark((v) => !v)}
                  className="text-[11px] px-2.5 py-1.5 rounded-full border flex items-center gap-1"
                  style={{ borderColor: ui.border, color: ui.muted }}
                >
                  {sampleDark ? "● Muestra oscura" : "☀ Muestra clara"}
                </button>
              </div>

              {sampleView === "tarjetas" ? (
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {palette.map((c, i) => (
                    <ColorSampleCard
                      key={i}
                      color={c}
                      role={roleFor(i)}
                      sampleDark={sampleDark}
                      copiedKey={copiedKey}
                      onCopy={copy}
                      locked={lockedIndices.has(i)}
                      onToggleLock={() => toggleLock(i)}
                    />
                  ))}
                </div>
              ) : (
                <div className="mb-4">
                  <InterfaceMockup colors={palette} sampleDark={sampleDark} />
                </div>
              )}

              <div className="flex gap-2 mb-3">
                <button
                  onClick={handleFullRandom}
                  className="flex-1 text-xs px-3 py-2.5 rounded-md border font-medium"
                  style={{ borderColor: ui.border, color: ui.text, background: ui.panel }}
                >
                  🎲 Aleatoria
                </button>
                <button
                  onClick={() => setExportOpen(true)}
                  className="flex-1 text-xs px-3 py-2.5 rounded-md border font-medium"
                  style={{ borderColor: ui.border, color: ui.text, background: ui.panel }}
                >
                  ⇩ Exportar
                </button>
                <button
                  onClick={savePalette}
                  className="flex-1 text-xs px-3 py-2.5 rounded-md font-medium"
                  style={{ background: "#8B5CF6", color: "#fff" }}
                >
                  ⬇ Guardar paleta
                </button>
              </div>
              <input
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Nombre de la paleta (opcional)"
                className="w-full text-sm px-3 py-2 rounded-md border outline-none"
                style={{ background: ui.panel, borderColor: ui.border, color: ui.text }}
              />
            </>
          )}

          {/* ================= GUARDADAS ================= */}
          {screen === "guardadas" && (
            <>
              <h1 className="text-xl font-semibold mt-1">Mi espacio</h1>
              <p className="text-sm mb-3" style={{ color: ui.muted }}>
                Tus paletas guardadas
              </p>
              <input
                value={savedSearch}
                onChange={(e) => setSavedSearch(e.target.value)}
                placeholder="Buscar paleta…"
                className="w-full text-sm px-3 py-2 rounded-md border outline-none mb-4"
                style={{ background: ui.panel, borderColor: ui.border, color: ui.text }}
              />

              {!user ? (
                <div className="rounded-lg border p-4 text-center" style={{ borderColor: ui.border, background: ui.panel }}>
                  <p className="text-sm mb-3" style={{ color: ui.muted }}>
                    Inicia sesión para guardar paletas y verlas aquí, en cualquier dispositivo.
                  </p>
                  <button
                    onClick={requireLogin}
                    className="text-xs px-3 py-2 rounded-md font-medium"
                    style={{ background: "#8B5CF6", color: "#fff" }}
                  >
                    Iniciar sesión con Google
                  </button>
                </div>
              ) : savedLoading ? (
                <p className="text-xs" style={{ color: ui.muted }}>
                  Cargando tus paletas…
                </p>
              ) : filteredSaved.length === 0 ? (
                <p className="text-xs" style={{ color: ui.muted }}>
                  Aún no guardaste ninguna paleta. Ve a "Zona de pruebas" para crear y guardar una.
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {filteredSaved.map((sp) => (
                    <div
                      key={sp.id}
                      className="flex items-center gap-3 rounded-lg border p-2.5"
                      style={{ borderColor: ui.border, background: ui.panel }}
                    >
                      <div className="flex rounded-md overflow-hidden flex-shrink-0" style={{ width: 64, height: 40 }}>
                        {sp.colors.map((c, i) => (
                          <div key={i} style={{ background: c, flex: 1 }} />
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{sp.name}</p>
                        <p className="text-[11px]" style={{ color: ui.muted }}>
                          {sp.colors.length} colores
                        </p>
                      </div>
                      <button onClick={() => toggleFav(sp.id, sp.fav)} className="text-lg leading-none">
                        {sp.fav ? "♥" : "♡"}
                      </button>
                      <button
                        onClick={() => {
                          setPalette(sp.colors);
                          setScreen("pruebas");
                        }}
                        className="text-[11px] px-2 py-1 rounded border"
                        style={{ borderColor: ui.border, color: ui.muted }}
                      >
                        Cargar
                      </button>
                      <button
                        onClick={() => removeSaved(sp.id)}
                        className="text-[11px] px-2 py-1 rounded border"
                        style={{ borderColor: "#D6454555", color: "#D64545" }}
                      >
                        Borrar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        {/* ---------- Barra inferior de navegación ---------- */}
        <nav
          className="fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t flex items-center justify-around py-2 z-30"
          style={{ background: ui.bg, borderColor: ui.border }}
        >
          {NAV_ITEMS.map((item) => {
            const active = screen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                className="flex flex-col items-center gap-0.5 px-3 py-1"
                style={{ color: active ? "#8B5CF6" : ui.muted }}
              >
                {item.id === "pruebas" ? (
                  <div
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: 34,
                      height: 34,
                      background: active ? "#8B5CF622" : "transparent",
                      border: `1.5px solid ${active ? "#8B5CF6" : ui.border}`,
                    }}
                  >
                    <LogoMark size={18} />
                  </div>
                ) : (
                  <item.Icon active={active} />
                )}
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {loginModal && (
          <LoginModal
            ui={ui}
            reason={loginModal}
            busy={loginBusy}
            error={loginError}
            onGoogle={handleGoogleLogin}
            onDismiss={() => setLoginModal(null)}
          />
        )}

        {exportOpen && <ExportModal ui={ui} colors={palette} onClose={() => setExportOpen(false)} />}
      </div>
    </div>
  );
}
