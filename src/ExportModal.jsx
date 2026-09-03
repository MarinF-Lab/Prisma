import React, { useState } from "react";

/* Modal para exportar la paleta actual en distintos formatos de código. */
export function ExportModal({ ui, colors, onClose }) {
  const [copiedFormat, setCopiedFormat] = useState(null);

  const css = `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n")}\n}`;
  const tailwind = `colors: {\n${colors.map((c, i) => `  prisma${i + 1}: "${c}",`).join("\n")}\n}`;
  const json = JSON.stringify(colors, null, 2);

  const blocks = [
    { key: "css", label: "Variables CSS", text: css },
    { key: "tailwind", label: "Tailwind config", text: tailwind },
    { key: "json", label: "JSON", text: json },
  ];

  const copy = (key, text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedFormat(key);
    setTimeout(() => setCopiedFormat((k) => (k === key ? null : k)), 1100);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      <div
        className="w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 pb-6 max-h-[85vh] overflow-y-auto"
        style={{ background: ui.panel, border: `1px solid ${ui.border}`, color: ui.text }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Exportar paleta</h2>
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
              <button
                onClick={() => copy(b.key, b.text)}
                className="text-[11px] px-2 py-1 rounded border"
                style={{ borderColor: ui.border, color: ui.muted }}
              >
                {copiedFormat === b.key ? "Copiado ✓" : "Copiar"}
              </button>
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
