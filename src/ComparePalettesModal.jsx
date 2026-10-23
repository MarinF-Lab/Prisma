import React from "react";
import { paletteContrastSummary } from "./colorUtils.js";

/* Comparar 2-3 paletas guardadas lado a lado — mismo patrón de modal que el
   resto de la app, pero más ancho para que entren las columnas. */
export function ComparePalettesModal({ ui, palettes, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      <div
        className="w-full max-w-3xl rounded-t-2xl sm:rounded-2xl p-5 pb-6 max-h-[85vh] overflow-y-auto"
        style={{ background: ui.panel, border: `1px solid ${ui.border}`, color: ui.text }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Comparar paletas</h2>
          <button onClick={onClose} className="text-sm px-1" style={{ color: ui.muted }}>
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {palettes.map((p) => (
            <div key={p.id} className="rounded-lg border p-2.5" style={{ borderColor: ui.border, background: ui.panel2 }}>
              <div className="flex rounded-md overflow-hidden" style={{ height: 64 }}>
                {p.colors.map((c, i) => (
                  <div key={i} style={{ background: c, flex: 1 }} />
                ))}
              </div>
              <p className="text-sm font-medium mt-2 truncate">{p.name}</p>
              <p className="text-[11px]" style={{ color: ui.muted }}>
                {p.colors.length} colores · {paletteContrastSummary(p.colors)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
