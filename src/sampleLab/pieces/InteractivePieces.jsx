import React from "react";
import { bestTextColor } from "../../colorUtils.js";

export function Botones({ ctx, principal, secundario }) {
  const primId = "btnPrincipal";
  const secId = "btnSecundario";
  const primKey = ctx.buttonStyleKey(primId);
  const secKey = ctx.buttonStyleKey(secId);
  const primBg = primKey === "relleno" ? principal : ctx.surf.bg;
  const secBg = secKey === "relleno" ? secundario : ctx.surf.bg;
  return (
    <div className="flex flex-wrap" style={{ gap: 8 }}>
      <button
        onClick={() => ctx.onEditButton(primId)}
        style={{
          ...ctx.buttonStyle(principal, primId), borderRadius: ctx.rad, padding: "8px 14px",
          fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: ctx.fontBody,
          outline: ctx.isEditing("boton", primId) ? "2px dashed #8B5CF6" : "none", outlineOffset: 2,
        }}
      >
        Primario
        {ctx.a11yBadge(primKey === "relleno" ? bestTextColor(principal) : principal, primBg)}
      </button>
      <button
        onClick={() => ctx.onEditButton(secId)}
        style={{
          ...ctx.buttonStyle(secundario, secId), borderRadius: ctx.rad, padding: "7px 14px",
          fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: ctx.fontBody,
          outline: ctx.isEditing("boton", secId) ? "2px dashed #8B5CF6" : "none", outlineOffset: 2,
        }}
      >
        Secundario
        {ctx.a11yBadge(secKey === "relleno" ? bestTextColor(secundario) : secundario, secBg)}
      </button>
    </div>
  );
}

export function Switch({ ctx, principal, switchOn, onToggle }) {
  return (
    <div className="flex items-center justify-between" style={{ fontSize: 12, color: ctx.surf.fg, fontFamily: ctx.fontBody }}>
      <span>Notificaciones</span>
      <button
        onClick={onToggle}
        style={{
          width: 34, height: 20, borderRadius: 999, background: switchOn ? principal : ctx.surf.border,
          position: "relative", border: "none", cursor: "pointer",
        }}
      >
        <span
          style={{
            position: "absolute", top: 2, left: 2, width: 16, height: 16, borderRadius: "50%",
            background: "#fff", transform: switchOn ? "translateX(14px)" : "translateX(0)", transition: "transform .15s ease",
          }}
        />
      </button>
    </div>
  );
}

export function Modal({ ctx, superficie, principal, modalOpenDemo, onToggleModal }) {
  const frameId = "frameModal";
  const btnId = "btnModal";
  if (!modalOpenDemo) {
    return (
      <button
        onClick={onToggleModal}
        style={{
          background: "none", border: `1px dashed ${ctx.surf.border}`, borderRadius: ctx.radBlock,
          padding: ctx.dens.pad, width: "100%", fontSize: 11, color: ctx.surf.muted, cursor: "pointer", fontFamily: ctx.fontBody,
        }}
      >
        Abrir modal
      </button>
    );
  }
  const editingFrame = ctx.isEditing("marco", frameId);
  return (
    <div
      onClick={() => ctx.onEditFrame(frameId)}
      style={{
        ...ctx.frameStyle(superficie, frameId), borderRadius: ctx.radBlock, padding: ctx.dens.pad,
        cursor: "pointer", outline: editingFrame ? "2px dashed #8B5CF6" : "none", outlineOffset: 2,
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <p style={{ fontFamily: ctx.fontDisplay, fontSize: 13, fontWeight: 700, color: ctx.surf.fg, margin: 0 }}>
          Confirmar acción
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleModal(); }}
          style={{ background: "none", border: "none", color: ctx.surf.muted, fontSize: 13, cursor: "pointer", padding: 0 }}
        >
          ✕
        </button>
      </div>
      <p style={{ fontFamily: ctx.fontBody, fontSize: 11, color: ctx.surf.muted, margin: "0 0 12px" }}>
        Mockup de modal — así se vería con el estilo elegido.
      </p>
      <div className="flex justify-end" style={{ gap: 8 }}>
        <button
          onClick={(e) => { e.stopPropagation(); ctx.onEditButton(btnId); }}
          style={{
            ...ctx.buttonStyle(principal, btnId), borderRadius: ctx.rad, padding: "7px 14px",
            fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: ctx.fontBody,
            outline: ctx.isEditing("boton", btnId) ? "2px dashed #8B5CF6" : "none", outlineOffset: 2,
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

export function Tooltip({ ctx, tooltipOpen, onToggle }) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={onToggle}
        style={{
          width: 20, height: 20, borderRadius: "50%", background: ctx.surf.border, color: ctx.surf.fg,
          border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer",
        }}
      >
        ?
      </button>
      {tooltipOpen && (
        <div
          style={{
            position: "absolute", top: 26, left: 0, background: ctx.surf.fg, color: bestTextColor(ctx.surf.fg),
            fontSize: 10, padding: "6px 9px", borderRadius: 6, whiteSpace: "nowrap",
            boxShadow: "0 4px 10px rgba(0,0,0,.2)", zIndex: 1, fontFamily: ctx.fontBody,
          }}
        >
          Esto es un tooltip
        </div>
      )}
    </div>
  );
}
