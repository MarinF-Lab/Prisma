import React from "react";
import { bestTextColor, contrastRatio, wcagLabel } from "../colorUtils.js";
import { SHAPE_RADIUS, SHAPE_RADIUS_BLOCK, DENSITY_VALUES, ELEVATION_SHADOWS, DEVICE_PRESETS, FONT_PAIRS } from "./sampleLabConstants.js";
import { resolveSampleSurface } from "./sampleSurface.js";
import { Navbar, Breadcrumbs, Hero, Tabs, Badges, Chips, Alerta } from "./pieces/LayoutPieces.jsx";
import { Tarjeta, Avatar, Formulario, GraficoBarras, BarraProgreso, GraficoDona, Tabla, Paginacion } from "./pieces/ContentPieces.jsx";
import { Botones, Switch, Modal, Tooltip } from "./pieces/InteractivePieces.jsx";

// Marco de dispositivo alrededor del lienzo — siempre hay uno (no existe la
// opción "sin marco"): navegador para escritorio, celular para móvil/tablet.
function DeviceChrome({ deviceFrame, maxWidth, children }) {
  if (deviceFrame === "navegador") {
    return (
      <div
        className="mx-auto overflow-hidden"
        style={{ maxWidth, width: "100%", background: "#D8D8DC", borderRadius: 14, boxShadow: "0 10px 30px rgba(0,0,0,.18)" }}
      >
        <div className="flex" style={{ gap: 6, padding: "10px 12px", background: "#E8E8EC" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
        </div>
        {children}
      </div>
    );
  }
  return (
    <div
      className="mx-auto"
      style={{ maxWidth, width: "100%", background: "#1A1A1E", padding: "14px 10px 20px", borderRadius: 34, boxShadow: "0 14px 34px rgba(0,0,0,.28)" }}
    >
      <div className="mx-auto" style={{ width: 64, height: 16, background: "#1A1A1E", borderRadius: "0 0 10px 10px", marginBottom: 8, position: "relative" }}>
        <div style={{ position: "absolute", top: 5, left: "50%", transform: "translateX(-50%)", width: 30, height: 4, borderRadius: 2, background: "#000" }} />
      </div>
      {children}
    </div>
  );
}

export function SampleLabCanvas({ ui, palette, lab }) {
  const surf = resolveSampleSurface({
    backgroundMode: lab.backgroundMode,
    customBackground: lab.customBackground,
    gradientFromIndex: lab.gradientFromIndex,
    gradientToIndex: lab.gradientToIndex,
    palette,
  });
  const rad = SHAPE_RADIUS[lab.shape];
  const radBlock = SHAPE_RADIUS_BLOCK[lab.shape];
  const dens = DENSITY_VALUES[lab.density];
  const elevationShadow = ELEVATION_SHADOWS[lab.elevation];
  const fontPairResolved = FONT_PAIRS[lab.fontPair];
  const preset = DEVICE_PRESETS[lab.devicePreset];

  const principal = lab.roleColor("Principal", palette);
  const secundario = lab.roleColor("Secundario", palette);
  const acento = lab.roleColor("Acento", palette);
  const superficie = lab.roleColor("Superficie", palette);
  const exito = lab.roleColor("Éxito", palette);

  function a11yBadge(fg, bg) {
    if (!lab.showA11yBadges) return null;
    const ratio = contrastRatio(fg, bg);
    const { tag, ok } = wcagLabel(ratio);
    return (
      <span
        className="text-[9px] font-semibold px-1.5 py-0.5 rounded ml-1"
        style={{ background: ok ? "rgba(60,200,120,.16)" : "rgba(230,70,70,.16)", color: ok ? "#2E9E5B" : "#D64545" }}
      >
        {ratio.toFixed(1)} · {tag}
      </span>
    );
  }

  function buttonStyleKey(instanceId) {
    return lab.buttonStyles[instanceId] || "relleno";
  }
  function buttonStyle(color, instanceId) {
    switch (buttonStyleKey(instanceId)) {
      case "contorno": return { background: "transparent", color, border: `1.5px solid ${color}`, textDecoration: "none" };
      case "fantasma": return { background: "transparent", color, border: "none", textDecoration: "none" };
      case "suave": return { background: color + "22", color, border: "none", textDecoration: "none" };
      case "enlace": return { background: "transparent", color, border: "none", textDecoration: "underline", textUnderlineOffset: "2px" };
      default: return { background: color, color: bestTextColor(color), border: "none", textDecoration: "none" };
    }
  }
  function frameStyle(tint, instanceId) {
    const key = lab.blockFrames[instanceId] || "borde";
    switch (key) {
      case "sinBorde": return { background: tint + "1c", border: "none", boxShadow: elevationShadow };
      case "sombra": return { background: surf.panel, border: "none", boxShadow: "0 8px 20px rgba(0,0,0,.16), 0 2px 6px rgba(0,0,0,.10)" };
      case "acento": return { background: tint + "14", border: "none", borderLeft: `4px solid ${tint}`, boxShadow: elevationShadow };
      default: return { background: tint + "14", border: `1px solid ${tint}44`, boxShadow: elevationShadow };
    }
  }
  function isEditing(group, instanceId) {
    return lab.editGroup === group && lab.editInstance === instanceId;
  }

  const ctx = {
    surf, rad, radBlock, dens, elevationShadow,
    fontDisplay: fontPairResolved.display, fontBody: fontPairResolved.body,
    a11yBadge, buttonStyle, buttonStyleKey, frameStyle, isEditing,
    onEditButton: (instanceId) => lab.openEdit("boton", instanceId),
    onEditFrame: (instanceId) => lab.openEdit("marco", instanceId),
  };

  const vc = lab.visibleComponents;
  const innerBlocks = [];
  if (vc.breadcrumbs) innerBlocks.push(<Breadcrumbs key="breadcrumbs" ctx={ctx} principal={principal} />);
  if (vc.hero) innerBlocks.push(<Hero key="hero" ctx={ctx} />);
  if (vc.tabs) innerBlocks.push(<Tabs key="tabs" ctx={ctx} principal={principal} activeTabIndex={lab.activeTabIndex} onSelectTab={lab.setActiveTabIndex} />);
  if (vc.botones) innerBlocks.push(<Botones key="botones" ctx={ctx} principal={principal} secundario={secundario} />);
  if (vc.chips) innerBlocks.push(<Chips key="chips" ctx={ctx} acento={acento} selectedChips={lab.selectedChips} onToggleChip={lab.toggleChip} />);
  if (vc.alerta) innerBlocks.push(<Alerta key="alerta" ctx={ctx} acento={acento} />);
  if (vc.tarjeta) innerBlocks.push(<Tarjeta key="tarjeta" ctx={ctx} superficie={superficie} acento={acento} />);
  if (vc.avatar) innerBlocks.push(<Avatar key="avatar" ctx={ctx} secundario={secundario} />);
  if (vc.formulario)
    innerBlocks.push(
      <Formulario
        key="formulario"
        ctx={ctx}
        superficie={superficie}
        principal={principal}
        formSubmitted={lab.formSubmitted}
        onSubmit={() => {
          lab.setFormSubmitted(true);
          setTimeout(() => lab.setFormSubmitted(false), 1400);
        }}
      />
    );
  if (vc.barras) innerBlocks.push(<GraficoBarras key="barras" ctx={ctx} superficie={superficie} palette={palette} />);
  if (vc.progreso) innerBlocks.push(<BarraProgreso key="progreso" ctx={ctx} exito={exito} />);
  if (vc.dona) innerBlocks.push(<GraficoDona key="dona" ctx={ctx} superficie={superficie} palette={palette} />);
  if (vc.tabla) innerBlocks.push(<Tabla key="tabla" ctx={ctx} superficie={superficie} palette={palette} />);
  if (vc.paginacion) innerBlocks.push(<Paginacion key="paginacion" ctx={ctx} principal={principal} currentPage={lab.currentPage} onSelectPage={lab.setCurrentPage} />);
  if (vc.badges) innerBlocks.push(<Badges key="badges" ctx={ctx} palette={palette} />);
  if (vc.switch)
    innerBlocks.push(
      <Switch key="switch" ctx={ctx} principal={principal} switchOn={lab.switchOn} onToggle={() => lab.setSwitchOn((v) => !v)} />
    );
  if (vc.modal)
    innerBlocks.push(
      <Modal
        key="modal"
        ctx={ctx}
        superficie={superficie}
        principal={principal}
        modalOpenDemo={lab.modalOpenDemo}
        onToggleModal={() => lab.setModalOpenDemo((v) => !v)}
      />
    );
  if (vc.tooltip)
    innerBlocks.push(<Tooltip key="tooltip" ctx={ctx} tooltipOpen={lab.tooltipOpen} onToggle={() => lab.setTooltipOpen((v) => !v)} />);

  const maxWidth = preset.width ? preset.width : "100%";

  return (
    <div>
      <div
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-2.5 py-1 mb-2"
        style={{ color: ui.muted, background: ui.panel, border: `1px solid ${ui.border}` }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#8B5CF6" }} />
        {preset.label}
      </div>
      <div className="rounded-2xl p-5 flex justify-center overflow-x-auto" style={{ background: ui.panel2, border: `1px solid ${ui.border}` }}>
        <DeviceChrome deviceFrame={preset.frame} maxWidth={maxWidth}>
          <div
            className="flex flex-col overflow-hidden max-h-[55vh] lg:max-h-[70vh]"
            style={{
              background: surf.bg,
              borderRadius: preset.frame === "navegador" ? `0 0 ${radBlock} ${radBlock}` : radBlock,
            }}
          >
            {vc.navbar && <Navbar ctx={ctx} palette={palette} principal={principal} />}
            <div
              className="overflow-y-auto min-h-0"
              style={{ padding: dens.pad, display: "flex", flexDirection: "column", gap: dens.gap }}
            >
              {innerBlocks.length ? (
                innerBlocks
              ) : (
                <p style={{ fontSize: 12, color: surf.muted, fontFamily: ctx.fontBody, margin: 0 }}>
                  Marcá al menos un componente para ver la muestra.
                </p>
              )}
            </div>
          </div>
        </DeviceChrome>
      </div>
    </div>
  );
}
