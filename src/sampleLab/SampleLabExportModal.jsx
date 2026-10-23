import React, { useState } from "react";

/* Modal para exportar la configuración completa del Laboratorio de Muestras
   (distinto del ExportModal de la paleta: mismo patrón visual, otro contenido). */
export function SampleLabExportModal({ ui, cssText, jsonText, mdText, onClose }) {
  const [copiedKey, setCopiedKey] = useState(null);

  const blocks = [
    { key: "css", label: "Variables CSS", text: cssText },
    { key: "json", label: "JSON de configuración", text: jsonText },
    { key: "md", label: "Prompt para agente de IA (.md)", text: mdText, downloadable: true },
  ];

  const copy = (key, text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1100);
  };

  const download = (text) => {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "laboratorio-muestras-prompt.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      <div
        className="w-full max-w-md sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-5 pb-6 max-h-[85vh] overflow-y-auto"
        style={{ background: ui.panel, border: `1px solid ${ui.border}`, color: ui.text }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Exportar configuración</h2>
          <button onClick={onClose} className="text-sm px-1" style={{ color: ui.muted }}>
            ✕
          </button>
        </div>

        {blocks.map((b) => (
          <div key={b.key} className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium" style={{ color: ui.muted }}>
                {b.label}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => copy(b.key, b.text)}
                  className="text-[11px] px-2 py-1 rounded border"
                  style={{ borderColor: ui.border, color: ui.muted }}
                >
                  {copiedKey === b.key ? "Copiado ✓" : "Copiar"}
                </button>
                {b.downloadable && (
                  <button
                    onClick={() => download(b.text)}
                    className="text-[11px] px-2 py-1 rounded border"
                    style={{ borderColor: ui.border, color: ui.muted }}
                  >
                    Descargar
                  </button>
                )}
              </div>
            </div>
            <pre
              className="text-[11px] p-2.5 rounded-md overflow-x-auto whitespace-pre"
              style={{ background: ui.panel2, fontFamily: "monospace" }}
            >
              {b.text}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
