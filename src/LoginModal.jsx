import React from "react";

/* Modal de inicio de sesión: aparece al abrir la app y al intentar
   guardar/crear sin sesión iniciada. */
export function LoginModal({ ui, reason, onGoogle, onDismiss, busy, error }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      <div
        className="w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 pb-6"
        style={{ background: ui.panel, border: `1px solid ${ui.border}`, color: ui.text }}
      >
        <h2 className="text-lg font-semibold mb-1">Inicia sesión</h2>
        <p className="text-sm mb-4" style={{ color: ui.muted }}>
          {reason === "action"
            ? "Necesitas iniciar sesión para guardar o crear paletas."
            : "Inicia sesión con Google para guardar tus paletas y accederlas desde cualquier dispositivo."}
        </p>

        {error && (
          <p className="text-xs mb-3 px-2.5 py-2 rounded-md" style={{ background: "#D6454522", color: "#D64545" }}>
            {error}
          </p>
        )}

        <button
          onClick={onGoogle}
          disabled={busy}
          className="w-full text-sm px-3 py-2.5 rounded-md font-medium mb-2 disabled:opacity-60"
          style={{ background: "#8B5CF6", color: "#fff" }}
        >
          {busy ? "Conectando…" : "Continuar con Google"}
        </button>
        <button
          onClick={onDismiss}
          className="w-full text-sm px-3 py-2.5 rounded-md font-medium"
          style={{ borderColor: ui.border, color: ui.muted, border: "1px solid" }}
        >
          Continuar sin iniciar sesión
        </button>
      </div>
    </div>
  );
}
