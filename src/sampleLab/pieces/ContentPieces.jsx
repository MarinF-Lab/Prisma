import React from "react";
import { bestTextColor } from "../../colorUtils.js";

export function Tarjeta({ ctx, superficie, acento }) {
  const frameId = "frameTarjeta";
  const editing = ctx.isEditing("marco", frameId);
  return (
    <div
      onClick={() => ctx.onEditFrame(frameId)}
      style={{
        ...ctx.frameStyle(superficie, frameId), borderRadius: ctx.radBlock, padding: ctx.dens.pad,
        cursor: "pointer", outline: editing ? "2px dashed #8B5CF6" : "none", outlineOffset: 2,
      }}
    >
      <p style={{ fontFamily: ctx.fontDisplay, fontSize: 12, fontWeight: 600, color: ctx.surf.fg, margin: "0 0 4px" }}>
        Tarjeta
      </p>
      <p style={{ fontFamily: ctx.fontBody, fontSize: 11, color: ctx.surf.muted, margin: 0 }}>
        Contenido con un <span style={{ color: acento, fontWeight: 600 }}>link de acento</span>.
      </p>
    </div>
  );
}

export function Avatar({ ctx, secundario }) {
  return (
    <div className="flex items-center" style={{ gap: 10 }}>
      <div
        className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{ width: 40, height: 40, background: secundario, color: bestTextColor(secundario), fontSize: 13, fontWeight: 700 }}
      >
        MP
      </div>
      <div>
        <p style={{ fontFamily: ctx.fontDisplay, fontSize: 12, fontWeight: 600, color: ctx.surf.fg, margin: 0 }}>María Paz</p>
        <p style={{ fontFamily: ctx.fontBody, fontSize: 10, color: ctx.surf.muted, margin: 0 }}>Diseñadora</p>
      </div>
    </div>
  );
}

export function Formulario({ ctx, superficie, principal, formSubmitted, onSubmit }) {
  const frameId = "frameFormulario";
  const btnId = "btnEnviar";
  const editingFrame = ctx.isEditing("marco", frameId);
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      onClick={() => ctx.onEditFrame(frameId)}
      style={{
        ...ctx.frameStyle(superficie, frameId), borderRadius: ctx.radBlock, padding: ctx.dens.pad,
        cursor: "pointer", outline: editingFrame ? "2px dashed #8B5CF6" : "none", outlineOffset: 2,
      }}
    >
      <label style={{ display: "block", fontFamily: ctx.fontBody, fontSize: 10, color: ctx.surf.muted, marginBottom: 4 }}>
        Correo electrónico
      </label>
      <input
        type="email"
        placeholder="nombre@correo.com"
        style={{
          width: "100%", background: ctx.surf.bg, border: `1px solid ${ctx.surf.border}`,
          borderRadius: `min(${ctx.radBlock}, 10px)`, padding: "7px 9px", fontSize: 11, color: ctx.surf.fg,
          marginBottom: 8, fontFamily: ctx.fontBody,
        }}
      />
      <button
        type="submit"
        onClick={(e) => { e.stopPropagation(); ctx.onEditButton(btnId); }}
        style={{
          ...ctx.buttonStyle(principal, btnId), borderRadius: ctx.rad, padding: "7px 14px",
          fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: ctx.fontBody,
          outline: ctx.isEditing("boton", btnId) ? "2px dashed #8B5CF6" : "none", outlineOffset: 2,
        }}
      >
        Enviar
      </button>
      <span
        style={{
          fontFamily: ctx.fontBody, fontSize: 10, color: ctx.surf.muted, marginLeft: 8,
          opacity: formSubmitted ? 1 : 0, transition: "opacity .15s ease",
        }}
      >
        ✓ Listo (no se envía nada de verdad)
      </span>
    </form>
  );
}

export function GraficoBarras({ ctx, superficie, palette }) {
  const frameId = "frameBarras";
  const editing = ctx.isEditing("marco", frameId);
  const pattern = [55, 85, 40, 70, 95, 60, 80, 45];
  return (
    <div
      onClick={() => ctx.onEditFrame(frameId)}
      style={{
        ...ctx.frameStyle(superficie, frameId), borderRadius: ctx.radBlock, padding: ctx.dens.pad,
        cursor: "pointer", outline: editing ? "2px dashed #8B5CF6" : "none", outlineOffset: 2,
      }}
    >
      <p style={{ fontFamily: ctx.fontDisplay, fontSize: 11, fontWeight: 600, color: ctx.surf.fg, margin: "0 0 10px" }}>
        Gráfico de barras
      </p>
      <div className="flex items-end" style={{ gap: 5, height: 56 }}>
        {palette.map((c, i) => (
          <div key={i} style={{ flex: 1, height: `${pattern[i % pattern.length]}%`, background: c, borderRadius: "3px 3px 0 0" }} />
        ))}
      </div>
    </div>
  );
}

export function BarraProgreso({ ctx, exito }) {
  return (
    <div>
      <div className="flex justify-between" style={{ fontFamily: ctx.fontBody, fontSize: 10, color: ctx.surf.muted, marginBottom: 5 }}>
        <span>Progreso</span>
        <span>68%</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: ctx.surf.border, overflow: "hidden" }}>
        <div style={{ width: "68%", height: "100%", background: exito, borderRadius: 999 }} />
      </div>
    </div>
  );
}

export function GraficoDona({ ctx, superficie, palette }) {
  const frameId = "frameDona";
  const editing = ctx.isEditing("marco", frameId);
  const step = 100 / palette.length;
  const stops = palette.map((c, i) => `${c} ${i * step}% ${(i + 1) * step}%`).join(", ");
  return (
    <div
      onClick={() => ctx.onEditFrame(frameId)}
      style={{
        ...ctx.frameStyle(superficie, frameId), borderRadius: ctx.radBlock, padding: ctx.dens.pad,
        display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", cursor: "pointer",
        outline: editing ? "2px dashed #8B5CF6" : "none", outlineOffset: 2,
      }}
    >
      <div
        style={{
          width: 72, height: 72, borderRadius: "50%", background: `conic-gradient(${stops})`,
          flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: ctx.surf.bg }} />
      </div>
      <div className="flex flex-col" style={{ gap: 3, fontFamily: ctx.fontBody }}>
        {palette.map((c, i) => (
          <span key={i} style={{ fontSize: 10, color: ctx.surf.muted }}>
            <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: 2, background: c, marginRight: 5 }} />
            Serie {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Tabla({ ctx, superficie, palette }) {
  const frameId = "frameTabla";
  const editing = ctx.isEditing("marco", frameId);
  return (
    <div
      onClick={() => ctx.onEditFrame(frameId)}
      style={{
        ...ctx.frameStyle(superficie, frameId), borderRadius: ctx.radBlock, overflow: "hidden",
        cursor: "pointer", outline: editing ? "2px dashed #8B5CF6" : "none", outlineOffset: 2,
      }}
    >
      <div
        className="flex"
        style={{
          fontFamily: ctx.fontDisplay, background: superficie + "22", padding: `7px ${ctx.dens.pad}px`,
          fontSize: 10, fontWeight: 600, color: ctx.surf.fg,
        }}
      >
        <span style={{ flex: 2 }}>Elemento</span>
        <span style={{ flex: 1 }}>Estado</span>
      </div>
      {palette.slice(0, 4).map((c, i) => (
        <div
          key={i}
          className="flex items-center"
          style={{
            fontFamily: ctx.fontBody, padding: `7px ${ctx.dens.pad}px`, fontSize: 11,
            color: ctx.surf.muted, borderTop: `1px solid ${ctx.surf.border}`,
          }}
        >
          <span style={{ flex: 2 }}>Fila {i + 1}</span>
          <span className="flex items-center" style={{ flex: 1, gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: c, display: "inline-block" }} />
            Activo
          </span>
        </div>
      ))}
    </div>
  );
}

export function Paginacion({ ctx, principal, currentPage, onSelectPage }) {
  return (
    <div className="flex justify-center" style={{ gap: 5 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n === currentPage;
        return (
          <button
            key={n}
            onClick={() => onSelectPage(n)}
            style={{
              width: 26, height: 26, borderRadius: ctx.rad, border: `1px solid ${active ? principal : ctx.surf.border}`,
              background: active ? principal : "transparent", color: active ? bestTextColor(principal) : ctx.surf.muted,
              fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: ctx.fontBody,
            }}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
