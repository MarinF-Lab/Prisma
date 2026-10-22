import React from "react";
import {
  SAMPLE_COMPONENTS, SAMPLE_ROLES, SHAPE_LABELS, DENSITY_LABELS, ELEVATION_LABELS,
  BACKGROUND_LABELS, BUTTON_STYLE_LABELS, BLOCK_FRAME_LABELS, FONT_PAIR_LABELS,
  VIEWPORT_OPTIONS, DEVICE_FRAME_LABELS, BUTTON_INSTANCE_IDS, BLOCK_INSTANCE_IDS,
} from "./sampleLabConstants.js";

function Card({ ui, title, children }) {
  return (
    <div className="rounded-lg border p-3 mb-2.5" style={{ borderColor: ui.border, background: ui.panel }}>
      <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: ui.muted }}>{title}</p>
      {children}
    </div>
  );
}

function SegmentedGroup({ ui, options, value, onChange }) {
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

function uniformValue(map, ids) {
  const values = ids.map((id) => map[id]);
  return values.every((v) => v === values[0]) ? values[0] : null;
}

function RoleRow({ ui, role, lab, palette }) {
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

const VIEWPORT_SHORT_LABELS = Object.fromEntries(
  Object.entries(VIEWPORT_OPTIONS).map(([k, v]) => [k, v.label.split(" ·")[0]])
);

export function SampleLabControls({ ui, palette, lab }) {
  return (
    <div>
      <Card ui={ui} title="Componentes">
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
      </Card>

      <Card ui={ui} title="Asignación de roles">
        {SAMPLE_ROLES.map((role) => (
          <RoleRow key={role} ui={ui} role={role} lab={lab} palette={palette} />
        ))}
      </Card>

      <Card ui={ui} title="Forma">
        <SegmentedGroup ui={ui} options={SHAPE_LABELS} value={lab.shape} onChange={lab.setShape} />
      </Card>

      <Card ui={ui} title="Densidad">
        <SegmentedGroup ui={ui} options={DENSITY_LABELS} value={lab.density} onChange={lab.setDensity} />
      </Card>

      <Card ui={ui} title="Elevación">
        <SegmentedGroup ui={ui} options={ELEVATION_LABELS} value={lab.elevation} onChange={lab.setElevation} />
      </Card>

      <Card ui={ui} title="Fondo de la muestra">
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
      </Card>

      <Card ui={ui} title="Estilo de botón · todos">
        <SegmentedGroup
          ui={ui}
          options={BUTTON_STYLE_LABELS}
          value={uniformValue(lab.buttonStyles, BUTTON_INSTANCE_IDS)}
          onChange={(v) => lab.setButtonStyleFor("ALL", v)}
        />
      </Card>

      <Card ui={ui} title="Marco de bloque · todos">
        <SegmentedGroup
          ui={ui}
          options={BLOCK_FRAME_LABELS}
          value={uniformValue(lab.blockFrames, BLOCK_INSTANCE_IDS)}
          onChange={(v) => lab.setBlockFrameFor("ALL", v)}
        />
      </Card>

      <Card ui={ui} title="Tipografía">
        <SegmentedGroup ui={ui} options={FONT_PAIR_LABELS} value={lab.fontPair} onChange={lab.setFontPair} />
      </Card>

      <Card ui={ui} title="Pantalla">
        <SegmentedGroup ui={ui} options={VIEWPORT_SHORT_LABELS} value={lab.viewport} onChange={lab.setViewport} />
        <div className="mt-2">
          <SegmentedGroup ui={ui} options={DEVICE_FRAME_LABELS} value={lab.deviceFrame} onChange={lab.setDeviceFrame} />
        </div>
      </Card>

      <Card ui={ui} title="Accesibilidad">
        <button
          onClick={() => lab.setShowA11yBadges((v) => !v)}
          className="text-[11px] px-2.5 py-1.5 rounded-full border"
          style={{ borderColor: ui.border, color: ui.muted }}
        >
          {lab.showA11yBadges ? "✓ Badges de contraste WCAG" : "Badges de contraste WCAG"}
        </button>
      </Card>

      <button
        onClick={() => lab.setLabExportOpen(true)}
        className="w-full text-xs px-3 py-2.5 rounded-md font-medium"
        style={{ background: "#8B5CF6", color: "#fff" }}
      >
        ⇩ Exportar configuración
      </button>
    </div>
  );
}
