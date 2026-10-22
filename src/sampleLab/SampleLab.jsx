import React from "react";
import { useSampleLabState } from "./useSampleLabState.js";
import { SampleLabControls } from "./SampleLabControls.jsx";
import { SampleLabCanvas } from "./SampleLabCanvas.jsx";
import { EditPopover } from "./EditPopover.jsx";
import { SampleLabExportModal } from "./SampleLabExportModal.jsx";
import { buildExportSnapshot, buildExportCss } from "./sampleLabExport.js";
import { BUTTON_STYLE_LABELS, BLOCK_FRAME_LABELS } from "./sampleLabConstants.js";

// Reemplaza al antiguo InterfaceMockup: mockup de "Interfaz" de la Zona de
// pruebas, ahora con componentes seleccionables, roles ampliados + color
// personalizado, edición por instancia (estilo Canva), forma/densidad/
// elevación/fondo/tipografía/pantalla, y exportación de la configuración.
export function SampleLab({ ui, palette }) {
  const lab = useSampleLabState();

  const popoverConfig =
    lab.editGroup === "boton"
      ? { title: "Estilo de botón", options: BUTTON_STYLE_LABELS, currentValue: lab.buttonStyles[lab.editInstance] }
      : lab.editGroup === "marco"
      ? { title: "Marco del bloque", options: BLOCK_FRAME_LABELS, currentValue: lab.blockFrames[lab.editInstance] }
      : null;

  return (
    <div>
      <SampleLabCanvas ui={ui} palette={palette} lab={lab} />

      {popoverConfig && (
        <EditPopover
          ui={ui}
          title={popoverConfig.title}
          options={popoverConfig.options}
          currentValue={popoverConfig.currentValue}
          onSelect={(value) => {
            if (lab.editGroup === "boton") lab.setButtonStyleFor(lab.editInstance, value);
            else lab.setBlockFrameFor(lab.editInstance, value);
          }}
          onClose={lab.closeEdit}
        />
      )}

      <div className="mt-4">
        <SampleLabControls ui={ui} palette={palette} lab={lab} />
      </div>

      {lab.labExportOpen && (
        <SampleLabExportModal
          ui={ui}
          cssText={buildExportCss(lab, palette)}
          jsonText={JSON.stringify(buildExportSnapshot(lab, palette), null, 2)}
          onClose={() => lab.setLabExportOpen(false)}
        />
      )}
    </div>
  );
}
