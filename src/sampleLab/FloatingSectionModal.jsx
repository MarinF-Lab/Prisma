import React from "react";

// Modal flotante genérico, estilo Canva: hoja que sube desde abajo en mobile,
// diálogo centrado en sm+ — mismo patrón que ExportModal.jsx/SampleLabExportModal.jsx.
export function FloatingSectionModal({ ui, title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      <div
        className="w-full max-w-md sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-5 pb-6 max-h-[80vh] overflow-y-auto"
        style={{ background: ui.panel, border: `1px solid ${ui.border}`, color: ui.text }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-sm px-1" style={{ color: ui.muted }}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
