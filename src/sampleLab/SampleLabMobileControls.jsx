import React, { useState } from "react";
import { SAMPLE_LAB_SECTIONS, sectionFields, FieldLabel } from "./sampleLabSections.jsx";
import { FloatingSectionModal } from "./FloatingSectionModal.jsx";

// Vista móvil estilo Canva: una barra horizontal de íconos (en flujo normal, no
// fija — la app ya tiene su propia nav inferior fija) reemplaza la lista larga de
// cards; tocar un ícono abre un modal flotante simple con los controles de esa
// sección agrupada. "Exportar" no abre un modal propio: dispara el que ya existe.
export function SampleLabMobileControls({ ui, palette, lab }) {
  const [openSectionId, setOpenSectionId] = useState(null);
  const openSection = SAMPLE_LAB_SECTIONS.find((s) => s.id === openSectionId) || null;
  const fields = openSection ? sectionFields(openSection) : [];

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {SAMPLE_LAB_SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => (section.action === "export" ? lab.setLabExportOpen(true) : setOpenSectionId(section.id))}
            className="flex flex-col items-center justify-center gap-1 flex-shrink-0 rounded-lg px-3 py-2 active:scale-95 transition-transform"
            style={{ color: ui.muted, minWidth: 58 }}
          >
            <section.Icon />
            <span className="text-[10px] font-medium whitespace-nowrap">{section.label}</span>
          </button>
        ))}
      </div>

      {openSection && (
        <FloatingSectionModal ui={ui} title={openSection.title} onClose={() => setOpenSectionId(null)}>
          {fields.map((f) => (
            <div key={f.id}>
              {fields.length > 1 && <FieldLabel ui={ui}>{f.title}</FieldLabel>}
              {f.content({ ui, lab, palette })}
            </div>
          ))}
        </FloatingSectionModal>
      )}
    </div>
  );
}
