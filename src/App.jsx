import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "./useAuth.js";
import { useUserPalettes } from "./useUserPalettes.js";
import { LoginModal } from "./LoginModal.jsx";

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
  monocromatico: (h) => [h, h, h, h, h, h],
};
function generateHarmony(baseHex, type, count) {
  const { h, s, l } = hexToHsl(baseHex);
  if (type === "monocromatico") {
    const lights = [72, 60, 48, 36, 24, 14].slice(0, count);
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

const COLOR_LIBRARY = [
  { name: "Rosa Nube", hex: "#F7C6D9", cat: "Pasteles" },
  { name: "Menta Suave", hex: "#C4EAD6", cat: "Pasteles" },
  { name: "Lavanda", hex: "#D9CDF0", cat: "Pasteles" },
  { name: "Durazno", hex: "#FBDCC0", cat: "Pasteles" },
  { name: "Coral Vivo", hex: "#FF6B5B", cat: "Vibrantes" },
  { name: "Azul Eléctrico", hex: "#2B6CFF", cat: "Vibrantes" },
  { name: "Amarillo Sol", hex: "#FFD23F", cat: "Vibrantes" },
  { name: "Verde Lima", hex: "#7ED321", cat: "Vibrantes" },
  { name: "Grafito", hex: "#1C1E26", cat: "Oscuros" },
  { name: "Vino", hex: "#4A1030", cat: "Oscuros" },
  { name: "Azul Medianoche", hex: "#0F1F3D", cat: "Oscuros" },
  { name: "Verde Bosque", hex: "#123524", cat: "Oscuros" },
  { name: "Terracota", hex: "#B5603E", cat: "Tierra" },
  { name: "Arena", hex: "#C9A876", cat: "Tierra" },
  { name: "Musgo", hex: "#6E7454", cat: "Tierra" },
  { name: "Café Tostado", hex: "#5C3D2E", cat: "Tierra" },
  { name: "Rosa Neón", hex: "#FF2DA8", cat: "Neón" },
  { name: "Verde Neón", hex: "#39FF6A", cat: "Neón" },
  { name: "Cian Neón", hex: "#00F0FF", cat: "Neón" },
  { name: "Violeta Neón", hex: "#A64BFF", cat: "Neón" },
  { name: "Gris 900", hex: "#111214", cat: "Monocromáticos" },
  { name: "Gris 600", hex: "#5B5F66", cat: "Monocromáticos" },
  { name: "Gris 300", hex: "#C6C9CE", cat: "Monocromáticos" },
  { name: "Gris 100", hex: "#F1F2F3", cat: "Monocromáticos" },
];

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
function ColorSampleCard({ color, role, sampleDark, copiedKey, onCopy }) {
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
      <div className="h-16" style={{ background: color }} />
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
      src={`data:image/jpeg;base64,${LOGO_B64}`}
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

  const filteredColors = useMemo(() => {
    return COLOR_LIBRARY.filter((c) => {
      const matchCat = activeCategory === "Todas" || c.cat === activeCategory;
      const q = search.trim().toLowerCase();
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.hex.toLowerCase().includes(q.replace("#", ""));
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  const regenerate = useCallback(
    (type = harmonyType, c = count, base = baseColor) => setPalette(generateHarmony(base, type, c)),
    [harmonyType, count, baseColor]
  );

  const handleFullRandom = () => {
    const newBase = randomHex();
    const types = Object.keys(HARMONIES);
    const newType = types[Math.floor(Math.random() * types.length)];
    setBaseColor(newBase);
    setHarmonyType(newType);
    setPalette(generateHarmony(newBase, newType, count));
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
                    const n = Math.min(6, count + 1);
                    setCount(n);
                    regenerate(harmonyType, n, baseColor);
                  }}
                  className="w-7 h-7 rounded-full border flex items-center justify-center"
                  style={{ borderColor: ui.border }}
                >
                  +
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {palette.map((c, i) => (
                  <ColorSampleCard
                    key={i}
                    color={c}
                    role={roleFor(i)}
                    sampleDark={sampleDark}
                    copiedKey={copiedKey}
                    onCopy={copy}
                  />
                ))}
              </div>

              <div className="flex gap-2 mb-3">
                <button
                  onClick={handleFullRandom}
                  className="flex-1 text-xs px-3 py-2.5 rounded-md border font-medium"
                  style={{ borderColor: ui.border, color: ui.text, background: ui.panel }}
                >
                  🎲 Aleatoria
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
      </div>
    </div>
  );
}
