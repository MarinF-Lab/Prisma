import React from "react";

/* Confirmación antes de borrar una paleta guardada — mismo patrón visual que
   LoginModal.jsx/ExportModal.jsx. */
export function ConfirmDeleteModal({ ui, name, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      <div
        className="w-full max-w-md sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-5 pb-6"
        style={{ background: ui.panel, border: `1px solid ${ui.border}`, color: ui.text }}
      >
        <h2 className="text-lg font-semibold mb-1">¿Borrar esta paleta?</h2>
        <p className="text-sm mb-4" style={{ color: ui.muted }}>
          "{name}" se va a borrar permanentemente. Esta acción no se puede deshacer.
        </p>

        <button
          onClick={onConfirm}
          className="w-full text-sm px-3 py-2.5 rounded-md font-medium mb-2"
          style={{ background: "#D64545", color: "#fff" }}
        >
          Borrar
        </button>
        <button
          onClick={onCancel}
          className="w-full text-sm px-3 py-2.5 rounded-md font-medium"
          style={{ borderColor: ui.border, color: ui.muted, border: "1px solid" }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
