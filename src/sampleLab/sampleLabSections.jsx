import React from "react";
import {
  SAMPLE_COMPONENTS, SAMPLE_ROLES, SHAPE_LABELS, DENSITY_LABELS, ELEVATION_LABELS,
  BACKGROUND_LABELS, BUTTON_STYLE_LABELS, BLOCK_FRAME_LABELS, FONT_PAIR_LABELS,
  DEVICE_PRESET_LABELS, BUTTON_INSTANCE_IDS, BLOCK_INSTANCE_IDS,
} from "./sampleLabConstants.js";
import {
  IconComponentes, IconRoles, IconEstilo, IconFondo, IconBotones, IconTipografia, IconPantalla, IconExportar,
} from "./sampleLabIcons.jsx";

// Helpers de presentación para los campos del Laboratorio, mostrados en la
// hoja flotante de SampleLabMobileControls (único riel de controles ahora,
// igual en móvil/tablet/escritorio).
export function FieldLabel({ ui, children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-wide mt-3 mb-1.5 first:mt-0" style={{ color: ui.muted }}>
      {children}
    </p>
  );
}

export function SegmentedGroup({ ui, options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Object.entries(options).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className="text-[11px] font-medium px-2.5 py-1.5 rounded-full border"
          style={{
            borderColor: value === key ? "#8B5CF6" : ui.border,
            background: value === key ? "#8B5CF622" : "transparent",
            color: value === key ? "#8B5CF6" : ui.muted,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function uniformValue(map, ids) {
  const values = ids.map((id) => map[id]);
  return values.every((v) => v === values[0]) ? values[0] : null;
}

export function RoleRow({ ui, role, lab, palette }) {
  const value = lab.roleAssignments[role];
  const isCustom = value === "personalizado";
  const swatch = isCustom ? (lab.customRoleColors[role] || "#888888") : palette[value % palette.length];
  return (
    <div className="flex items-center gap-2 mb-2 last:mb-0">
      <span className="rounded w-5 h-5 flex-shrink-0 border" style={{ background: swatch, borderColor: ui.border }} />
      <span className="text-[11px] flex-shrink-0" style={{ color: ui.muted, width: 72 }}>{role}</span>
      <select
        value={isCustom ? "personalizado" : value}
        onChange={(e) => {
          const v = e.target.value;
          lab.setRoleAssignment(role, v === "personalizado" ? "personalizado" : +v);
        }}
        className="flex-1 min-w-0 text-[11px] px-1.5 py-1 rounded border"
        style={{ background: ui.panel2, borderColor: ui.border, color: ui.text }}
      >
        {palette.map((c, i) => (
          <option key={i} value={i}>{c}</option>
        ))}
        <option value="personalizado">Personalizado…</option>
      </select>
      {isCustom && (
        <input
          type="color"
          value={swatch}
          onChange={(e) => lab.setCustomRoleColor(role, e.target.value)}
          className="w-6 h-6 rounded border flex-shrink-0 cursor-pointer bg-transparent"
          style={{ borderColor: ui.border, padding: 0 }}
        />
      )}
    </div>
  );
}

// Los 11 campos finos de siempre — cada uno expone solo su contenido (sin wrapper),
// listo para que la hoja flotante de SampleLabMobileControls los agrupe por sección.
export const SAMPLE_LAB_FIELDS = [
  {
    id: "componentes",
    title: "Componentes",
    content: ({ lab }) => (
      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
        {SAMPLE_COMPONENTS.map((c) => (
          <label key={c.id} className="flex items-center gap-1.5 text-xs">
            <input
              type="checkbox"
              checked={!!lab.visibleComponents[c.id]}
              onChange={() => lab.toggleComponent(c.id)}
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ accentColor: "#8B5CF6" }}
            />
            {c.label}
          </label>
        ))}
      </div>
    ),
  },
  {
    id: "roles",
    title: "Asignación de roles",
    content: ({ ui, lab, palette }) => (
      <>
        {SAMPLE_ROLES.map((role) => (
          <RoleRow key={role} ui={ui} role={role} lab={lab} palette={palette} />
        ))}
      </>
    ),
  },
  {
    id: "forma",
    title: "Forma",
    content: ({ ui, lab }) => <SegmentedGroup ui={ui} options={SHAPE_LABELS} value={lab.shape} onChange={lab.setShape} />,
  },
  {
    id: "densidad",
    title: "Densidad",
    content: ({ ui, lab }) => <SegmentedGroup ui={ui} options={DENSITY_LABELS} value={lab.density} onChange={lab.setDensity} />,
  },
  {
    id: "elevacion",
    title: "Elevación",
    content: ({ ui, lab }) => <SegmentedGroup ui={ui} options={ELEVATION_LABELS} value={lab.elevation} onChange={lab.setElevation} />,
  },
  {
    id: "fondo",
    title: "Fondo de la muestra",
    content: ({ ui, lab, palette }) => (
      <>
        <SegmentedGroup ui={ui} options={BACKGROUND_LABELS} value={lab.backgroundMode} onChange={lab.setBackgroundMode} />
        {lab.backgroundMode === "personalizado" && (
          <input
            type="color"
            value={lab.customBackground}
            onChange={(e) => lab.setCustomBackground(e.target.value)}
            className="w-full h-8 mt-2 rounded border cursor-pointer bg-transparent"
            style={{ borderColor: ui.border }}
          />
        )}
        {lab.backgroundMode === "degrade" && (
          <div className="flex gap-2 mt-2">
            <select
              value={lab.gradientFromIndex}
              onChange={(e) => lab.setGradientFromIndex(+e.target.value)}
              className="flex-1 text-[11px] px-1.5 py-1 rounded border"
              style={{ background: ui.panel2, borderColor: ui.border, color: ui.text }}
            >
              {palette.map((c, i) => (
                <option key={i} value={i}>{c}</option>
              ))}
            </select>
            <select
              value={lab.gradientToIndex}
              onChange={(e) => lab.setGradientToIndex(+e.target.value)}
              className="flex-1 text-[11px] px-1.5 py-1 rounded border"
              style={{ background: ui.panel2, borderColor: ui.border, color: ui.text }}
            >
              {palette.map((c, i) => (
                <option key={i} value={i}>{c}</option>
              ))}
            </select>
          </div>
        )}
      </>
    ),
  },
  {
    id: "botonTodos",
    title: "Estilo de botón · todos",
    content: ({ ui, lab }) => (
      <SegmentedGroup
        ui={ui}
        options={BUTTON_STYLE_LABELS}
        value={uniformValue(lab.buttonStyles, BUTTON_INSTANCE_IDS)}
        onChange={(v) => lab.setButtonStyleFor("ALL", v)}
      />
    ),
  },
  {
    id: "marcoTodos",
    title: "Marco de bloque · todos",
    content: ({ ui, lab }) => (
      <SegmentedGroup
        ui={ui}
        options={BLOCK_FRAME_LABELS}
        value={uniformValue(lab.blockFrames, BLOCK_INSTANCE_IDS)}
        onChange={(v) => lab.setBlockFrameFor("ALL", v)}
      />
    ),
  },
  {
    id: "tipografia",
    title: "Tipografía",
    content: ({ ui, lab }) => <SegmentedGroup ui={ui} options={FONT_PAIR_LABELS} value={lab.fontPair} onChange={lab.setFontPair} />,
  },
  {
    id: "pantalla",
    title: "Pantalla",
    content: ({ ui, lab }) => <SegmentedGroup ui={ui} options={DEVICE_PRESET_LABELS} value={lab.devicePreset} onChange={lab.setDevicePreset} />,
  },
  {
    id: "a11y",
    title: "Accesibilidad",
    content: ({ ui, lab }) => (
      <button
        onClick={() => lab.setShowA11yBadges((v) => !v)}
        className="text-[11px] px-2.5 py-1.5 rounded-full border"
        style={{ borderColor: ui.border, color: ui.muted }}
      >
        {lab.showA11yBadges ? "✓ Badges de contraste WCAG" : "Badges de contraste WCAG"}
      </button>
    ),
  },
];

function findField(id) {
  return SAMPLE_LAB_FIELDS.find((f) => f.id === id) || null;
}

// Agrupa los 11 campos en 7 secciones + "Exportar" (acción) para la barra de íconos
// de mobile — mismo criterio que el prototipo: Forma+Densidad+Elevación → "Estilo",
// Estilo de botón+Marco de bloque → "Botones", Pantalla+Accesibilidad juntos.
export const SAMPLE_LAB_SECTIONS = [
  { id: "componentes", label: "Piezas", title: "Componentes", Icon: IconComponentes, fieldIds: ["componentes"] },
  { id: "roles", label: "Roles", title: "Asignación de roles", Icon: IconRoles, fieldIds: ["roles"] },
  { id: "estilo", label: "Estilo", title: "Estilo", Icon: IconEstilo, fieldIds: ["forma", "densidad", "elevacion"] },
  { id: "fondo", label: "Fondo", title: "Fondo de la muestra", Icon: IconFondo, fieldIds: ["fondo"] },
  { id: "botonesMarcos", label: "Botones", title: "Botones y marcos", Icon: IconBotones, fieldIds: ["botonTodos", "marcoTodos"] },
  { id: "tipografia", label: "Fuente", title: "Tipografía", Icon: IconTipografia, fieldIds: ["tipografia"] },
  { id: "pantalla", label: "Pantalla", title: "Pantalla y accesibilidad", Icon: IconPantalla, fieldIds: ["pantalla", "a11y"] },
  { id: "exportar", label: "Exportar", title: "Exportar código", Icon: IconExportar, action: "export" },
];

export function sectionFields(section) {
  return (section.fieldIds || []).map(findField).filter(Boolean);
}
