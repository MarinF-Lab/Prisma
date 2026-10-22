import React from "react";

// Panel de edición por instancia (estilo Canva): se renderiza en flujo normal
// debajo del lienzo, sin position:fixed ni coordenadas calculadas a mano.
export function EditPopover({ ui, title, options, currentValue, onSelect, onClose }) {
  return (
    <div className="rounded-lg border p-3 mt-3" style={{ background: ui.panel, borderColor: "#8B5CF6" }}>
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: "#8B5CF6" }}>
          {title}
        </span>
        <button onClick={onClose} className="text-[11px] font-semibold" style={{ color: ui.muted }}>
          ✕ Cerrar
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(options).map(([key, label]) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="text-[11px] font-medium px-2.5 py-1.5 rounded-full border"
            style={{
              borderColor: currentValue === key ? "#8B5CF6" : ui.border,
              background: currentValue === key ? "#8B5CF622" : "transparent",
              color: currentValue === key ? "#8B5CF6" : ui.muted,
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
