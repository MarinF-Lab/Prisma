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
    <div className="lg:grid lg:grid-cols-[380px_1fr] lg:gap-6 lg:items-start">
      {/* Canvas primero en el DOM: por debajo de "lg" no hay grid/flex en este
          contenedor, así que queda arriba sin necesitar ninguna clase de orden.
          Recién en "lg" (donde el padre pasa a grid) lg:order-2 lo manda a la
          columna derecha. "sticky" solo aplica desde "lg": ahí el canvas vive
          en su propia columna y no puede solaparse con nada; en mobile/tablet,
          donde todo está en una sola columna apilada, hacerlo sticky superpondría
          el canvas sobre los controles de abajo al scrollear (lo probamos y
          bloqueaba los clicks) — ahí alcanza con que los controles tengan su
          propio scroll acotado debajo, sin que el canvas se mueva de su lugar. */}
      <div className="lg:order-2 lg:sticky lg:top-14 lg:z-10 pb-3 lg:pb-0" style={{ background: ui.bg }}>
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
      </div>

      <div className="mt-4 lg:mt-0 lg:order-1 max-h-[50vh] lg:max-h-[calc(100vh-3.5rem)] overflow-y-auto lg:pr-1">
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
