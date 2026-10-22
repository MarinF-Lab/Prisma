import React from "react";
import { bestTextColor } from "../../colorUtils.js";

export function Navbar({ ctx, palette, principal }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ background: principal, padding: ctx.dens.pad, borderRadius: `${ctx.radBlock} ${ctx.radBlock} 0 0` }}
    >
      <span style={{ fontFamily: ctx.fontDisplay, fontSize: 13, fontWeight: 700, color: bestTextColor(principal) }}>
        Marca
      </span>
      <div className="flex" style={{ gap: 5 }}>
        {palette.map((c, i) => (
          <span key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
        ))}
      </div>
    </div>
  );
}

export function Breadcrumbs({ ctx, principal }) {
  const crumbs = ["Inicio", "Categoría", "Producto"];
  return (
    <div className="flex items-center flex-wrap" style={{ gap: 4, fontFamily: ctx.fontBody, fontSize: 11 }}>
      {crumbs.map((c, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <React.Fragment key={c}>
            {i > 0 && <span style={{ color: ctx.surf.muted }}>/</span>}
            <span style={{ color: isLast ? principal : ctx.surf.muted, fontWeight: isLast ? 600 : 400 }}>{c}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function Hero({ ctx }) {
  const bgForContrast = typeof ctx.surf.bg === "string" && ctx.surf.bg.indexOf("gradient") < 0 ? ctx.surf.bg : "#808080";
  return (
    <div>
      <p style={{ fontFamily: ctx.fontDisplay, fontSize: 16, fontWeight: 700, color: ctx.surf.fg, margin: "0 0 4px" }}>
        Título de producto
      </p>
      <p style={{ fontFamily: ctx.fontBody, fontSize: 12, color: ctx.surf.muted, margin: 0 }}>
        Una descripción corta para evaluar el contraste sobre este fondo.
        {ctx.a11yBadge(ctx.surf.fg, bgForContrast)}
      </p>
    </div>
  );
}

export function Tabs({ ctx, principal, activeTabIndex, onSelectTab }) {
  const labels = ["Resumen", "Detalles", "Reseñas"];
  return (
    <div className="flex" style={{ gap: ctx.dens.gap, borderBottom: `1px solid ${ctx.surf.border}` }}>
      {labels.map((t, i) => {
        const active = i === activeTabIndex;
        return (
          <button
            key={t}
            onClick={() => onSelectTab(i)}
            style={{
              background: "none", border: "none", padding: "0 0 8px", fontSize: 12,
              fontFamily: ctx.fontBody, fontWeight: active ? 700 : 500,
              color: active ? principal : ctx.surf.muted,
              borderBottom: `2px solid ${active ? principal : "transparent"}`, cursor: "pointer",
            }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

export function Badges({ ctx, palette }) {
  return (
    <div className="flex flex-wrap" style={{ gap: 6 }}>
      {palette.map((c, i) => (
        <span
          key={i}
          style={{
            background: c, color: bestTextColor(c), fontSize: 10, fontWeight: 600,
            padding: "4px 9px", borderRadius: ctx.rad, fontFamily: ctx.fontBody,
          }}
        >
          Etiqueta {i + 1}
        </span>
      ))}
    </div>
  );
}

export function Chips({ ctx, acento, selectedChips, onToggleChip }) {
  const labels = ["Todo", "Nuevo", "Popular", "Oferta"];
  return (
    <div className="flex flex-wrap" style={{ gap: 6 }}>
      {labels.map((c, i) => {
        const sel = !!selectedChips[i];
        return (
          <button
            key={c}
            onClick={() => onToggleChip(i)}
            style={{
              background: sel ? acento : "transparent", color: sel ? bestTextColor(acento) : ctx.surf.muted,
              border: `1px solid ${sel ? acento : ctx.surf.border}`, borderRadius: 999, padding: "5px 12px",
              fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: ctx.fontBody,
            }}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}

export function Alerta({ ctx, acento }) {
  return (
    <div
      style={{
        background: acento + "22", border: `1px solid ${acento}`, borderRadius: ctx.radBlock,
        padding: ctx.dens.pad, fontSize: 12, color: ctx.surf.fg, fontFamily: ctx.fontBody,
      }}
    >
      <strong style={{ fontFamily: ctx.fontDisplay, color: acento }}>Aviso</strong>{" "}
      <span>— así se ve una alerta usando el color de acento.</span>
    </div>
  );
}
