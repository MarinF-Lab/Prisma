/* ---------- Datos estáticos del Laboratorio de Muestras ---------- */

export const SAMPLE_COMPONENTS = [
  { id: "navbar", label: "Navbar" },
  { id: "breadcrumbs", label: "Breadcrumbs" },
  { id: "hero", label: "Hero" },
  { id: "tabs", label: "Tabs" },
  { id: "botones", label: "Botones" },
  { id: "chips", label: "Chips" },
  { id: "alerta", label: "Alerta" },
  { id: "tarjeta", label: "Tarjeta" },
  { id: "avatar", label: "Avatar" },
  { id: "formulario", label: "Formulario" },
  { id: "barras", label: "Gráfico de barras" },
  { id: "progreso", label: "Barra de progreso" },
  { id: "dona", label: "Gráfico de dona" },
  { id: "tabla", label: "Tabla" },
  { id: "paginacion", label: "Paginación" },
  { id: "badges", label: "Badges" },
  { id: "switch", label: "Switch" },
  { id: "modal", label: "Modal" },
  { id: "tooltip", label: "Tooltip" },
];

export const DEFAULT_VISIBLE_COMPONENTS = {
  navbar: true, breadcrumbs: false, hero: true, tabs: false,
  botones: true, chips: false, alerta: false, tarjeta: true,
  avatar: false, formulario: false, barras: true, progreso: false,
  dona: false, tabla: false, paginacion: false, badges: true,
  switch: false, modal: false, tooltip: false,
};

// Roles de color de la Zona de pruebas (Interfaz) — independientes del
// ROLES/roleFor que ya usan la vista "Tarjetas" y la pantalla "Explorar".
export const SAMPLE_ROLES = ["Principal", "Secundario", "Acento", "Superficie", "Éxito", "Advertencia", "Error"];
export const SEMANTIC_SAMPLE_ROLES = ["Éxito", "Advertencia", "Error"];
export const SEMANTIC_ROLE_DEFAULT_COLORS = { "Éxito": "#2E9E5B", "Advertencia": "#F5A623", "Error": "#D64545" };
export const SAMPLE_ROLE_SLUGS = {
  Principal: "principal", Secundario: "secundario", Acento: "acento", Superficie: "superficie",
  "Éxito": "exito", "Advertencia": "advertencia", "Error": "error",
};

export const BUTTON_INSTANCE_IDS = ["btnPrincipal", "btnSecundario", "btnEnviar", "btnModal"];
export const BLOCK_INSTANCE_IDS = ["frameTarjeta", "frameFormulario", "frameBarras", "frameDona", "frameTabla", "frameModal"];

export const BUTTON_STYLE_LABELS = { relleno: "Relleno", contorno: "Contorno", fantasma: "Fantasma", suave: "Suave", enlace: "Enlace" };
export const BLOCK_FRAME_LABELS = { borde: "Con borde", sinBorde: "Sin borde", sombra: "Solo sombra", acento: "Barra de acento" };

export const SHAPE_RADIUS = { recto: "2px", suave: "8px", redondeado: "16px", pildora: "999px" };
// Para bloques grandes el radio se limita: aplicar "píldora" literal a un
// contenedor ancho y bajo recorta su contenido.
export const SHAPE_RADIUS_BLOCK = { recto: "2px", suave: "10px", redondeado: "20px", pildora: "28px" };
export const SHAPE_LABELS = { recto: "Recto", suave: "Suave", redondeado: "Redondeado", pildora: "Píldora" };

export const DENSITY_VALUES = {
  compacta: { pad: 10, gap: 8 },
  comoda: { pad: 16, gap: 14 },
  amplia: { pad: 24, gap: 20 },
};
export const DENSITY_LABELS = { compacta: "Compacta", comoda: "Cómoda", amplia: "Amplia" };

export const ELEVATION_SHADOWS = {
  plano: "none",
  sutil: "0 1px 2px rgba(0,0,0,.10), 0 1px 1px rgba(0,0,0,.06)",
  marcado: "0 10px 28px rgba(0,0,0,.22), 0 3px 8px rgba(0,0,0,.16)",
};
export const ELEVATION_LABELS = { plano: "Plano", sutil: "Sutil", marcado: "Marcado" };

export const BACKGROUND_LABELS = { claro: "Claro", oscuro: "Oscuro", personalizado: "Personalizado", degrade: "Degradé" };

// Simulador de dispositivo dentro del lienzo — independiente del ancho real de
// la ventana del navegador. Cada preset siempre viene con su marco (nunca "sin marco").
export const DEVICE_PRESETS = {
  movil: { width: 375, label: "Móvil · 375px", frame: "celular" },
  tablet: { width: 680, label: "Tablet · 680px", frame: "celular" },
  escritorio: { width: null, label: "Escritorio", frame: "navegador" },
};
export const DEVICE_PRESET_LABELS = Object.fromEntries(
  Object.entries(DEVICE_PRESETS).map(([k, v]) => [k, v.label.split(" ·")[0]])
);

const SYSTEM_FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
export const FONT_PAIR_LABELS = { sistema: "Sistema", clasica: "Clásica", geometrica: "Geométrica", editorial: "Editorial" };
export const FONT_PAIRS = {
  sistema: { display: SYSTEM_FONT, body: SYSTEM_FONT },
  clasica: { display: '"Fraunces", Georgia, serif', body: SYSTEM_FONT },
  geometrica: { display: '"Sora", ' + SYSTEM_FONT, body: SYSTEM_FONT },
  editorial: { display: '"Fraunces", Georgia, serif', body: '"Lora", Georgia, serif' },
};
