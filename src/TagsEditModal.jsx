import React, { useState } from "react";

/* Editar las etiquetas de una paleta guardada — mismo patrón visual que
   ConfirmDeleteModal.jsx/LoginModal.jsx. */
export function TagsEditModal({ ui, name, tags, onSave, onCancel }) {
  const [value, setValue] = useState((tags || []).join(", "));

  const save = () => {
    const parsed = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave(parsed);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      <div
        className="w-full max-w-md sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-5 pb-6"
        style={{ background: ui.panel, border: `1px solid ${ui.border}`, color: ui.text }}
      >
        <h2 className="text-lg font-semibold mb-1">Editar etiquetas</h2>
        <p className="text-sm mb-4" style={{ color: ui.muted }}>
          Etiquetas para "{name}", separadas por coma.
        </p>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="ej. Proyecto X, 2026"
          autoFocus
          className="w-full text-sm px-3 py-2 rounded-md border outline-none mb-4"
          style={{ background: ui.panel2, borderColor: ui.border, color: ui.text }}
        />

        <button
          onClick={save}
          className="w-full text-sm px-3 py-2.5 rounded-md font-medium mb-2"
          style={{ background: "#8B5CF6", color: "#fff" }}
        >
          Guardar
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
