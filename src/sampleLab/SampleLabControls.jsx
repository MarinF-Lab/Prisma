import React from "react";
import { Card, SAMPLE_LAB_FIELDS } from "./sampleLabSections.jsx";

export function SampleLabControls({ ui, palette, lab }) {
  return (
    <div>
      {SAMPLE_LAB_FIELDS.map((f) => (
        <Card key={f.id} ui={ui} title={f.title}>
          {f.content({ ui, lab, palette })}
        </Card>
      ))}

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
