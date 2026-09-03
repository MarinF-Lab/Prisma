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
    const lights = [92, 82, 72, 62, 52, 44, 36, 28, 20, 12].slice(0, count);
    return lights.map((ll) => hslToHex(h, Math.max(s, 35), ll));
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
  const pick = (i) => colors[i % colors.length];
  const navBg = pick(0);
  const accent = pick(colors.length > 2 ? 2 : 1);
  const cardBg = sampleDark ? "#1B1B22" : "#FFFFFF";
  const pageBg = sampleDark ? "#141419" : "#F4F4F2";
  const pageFg = sampleDark ? "#F2F2F5" : "#16161A";
  const pageMuted = sampleDark ? "#9A9AA5" : "#6B6B72";

  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: sampleDark ? "#2A2A33" : "#E4E4E8" }}>
      <div className="flex items-center justify-between px-3 py-2.5" style={{ background: navBg }}>
        <span className="text-sm font-semibold" style={{ color: bestTextColor(navBg) }}>
          Marca
        </span>
        <div className="flex gap-1.5">
          {colors.slice(0, 3).map((c, i) => (
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

        <div className="rounded-md p-3 mb-3" style={{ background: cardBg, border: `1px solid ${sampleDark ? "#2A2A33" : "#E4E4E8"}` }}>
          <p className="text-xs font-medium mb-1" style={{ color: pageFg }}>
            Tarjeta
          </p>
          <p className="text-[11px] mb-2" style={{ color: pageMuted }}>
            Contenido con un{" "}
            <span style={{ color: accent, fontWeight: 600 }}>link de acento</span>.
          </p>
          <button
            className="text-xs px-3 py-1.5 rounded-md font-medium"
            style={{ background: accent, color: bestTextColor(accent) }}
          >
            Acción
          </button>
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
  const [sampleView, setSampleView] = useState("tarjetas"); // tarjetas | interfaz
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
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
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
              <div className="flex items-center justify-between mt-1 mb-3">
                <div>
                  <h1 className="text-lg font-semibold">Zona de pruebas</h1>
                  <p className="text-xs" style={{ color: ui.muted }}>
                    Crea y prueba combinaciones
                  </p>
                </div>
                <button
                  onClick={() => setSampleDark((v) => !v)}
                  className="text-[11px] px-2.5 py-1.5 rounded-full border flex items-center gap-1"
                  style={{ borderColor: ui.border, color: ui.muted }}
                >
                  {sampleDark ? "● Muestra oscura" : "☀ Muestra clara"}
                </button>
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

              <div className="flex gap-1.5 mb-3">
                {[
                  { id: "tarjetas", label: "Tarjetas" },
                  { id: "interfaz", label: "Interfaz" },
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
