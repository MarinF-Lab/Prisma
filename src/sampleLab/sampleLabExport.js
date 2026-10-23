import {
  SAMPLE_ROLES, SAMPLE_ROLE_SLUGS, SAMPLE_COMPONENTS,
  DENSITY_VALUES, FONT_PAIRS, SHAPE_RADIUS, SHAPE_RADIUS_BLOCK,
  BUTTON_INSTANCE_IDS, BLOCK_INSTANCE_IDS, BUTTON_STYLE_LABELS, BLOCK_FRAME_LABELS,
  SHAPE_LABELS, DENSITY_LABELS, ELEVATION_LABELS, BACKGROUND_LABELS, FONT_PAIR_LABELS,
  DEVICE_PRESET_LABELS,
} from "./sampleLabConstants.js";

export function buildExportSnapshot(lab, palette) {
  const roles = {};
  SAMPLE_ROLES.forEach((r) => { roles[r] = lab.roleColor(r, palette); });
  return {
    paleta: palette,
    componentesActivos: SAMPLE_COMPONENTS.filter((c) => lab.visibleComponents[c.id]).map((c) => c.id),
    roles,
    forma: lab.shape,
    densidad: lab.density,
    elevacion: lab.elevation,
    fondo: lab.backgroundMode,
    estiloBotones: lab.buttonStyles,
    marcosDeBloque: lab.blockFrames,
    tipografia: lab.fontPair,
    dispositivo: lab.devicePreset,
  };
}

export function buildExportCss(lab, palette) {
  const dens = DENSITY_VALUES[lab.density];
  const fontPair = FONT_PAIRS[lab.fontPair];
  const lines = [":root {"];
  SAMPLE_ROLES.forEach((r) => {
    lines.push(`  --color-${SAMPLE_ROLE_SLUGS[r]}: ${lab.roleColor(r, palette)};`);
  });
  lines.push(`  --radius: ${SHAPE_RADIUS[lab.shape]};`);
  lines.push(`  --radius-block: ${SHAPE_RADIUS_BLOCK[lab.shape]};`);
  lines.push(`  --space: ${dens.pad}px;`);
  lines.push(`  --gap: ${dens.gap}px;`);
  lines.push(`  --font-display: ${fontPair.display};`);
  lines.push(`  --font-body: ${fontPair.body};`);
  lines.push("}");
  return lines.join("\n");
}

// Misma configuración, redactada como instrucciones para pasarle a un agente de
// IA (Claude Code, Cursor, etc.) y que la implemente en la app real — una consigna
// legible, no solo datos.
export function buildExportPromptMd(lab, palette) {
  const active = SAMPLE_COMPONENTS.filter((c) => lab.visibleComponents[c.id]);
  const dens = DENSITY_VALUES[lab.density];
  const fontPair = FONT_PAIRS[lab.fontPair];
  const lines = [];
  lines.push("# Especificación de diseño — Laboratorio de Muestras de Prisma");
  lines.push("");
  lines.push("Implementá esta configuración de interfaz en la aplicación real, reutilizando los");
  lines.push("componentes y el sistema de theming que ya existan en el proyecto. Los valores HEX y");
  lines.push("las variables CSS de abajo son el resultado exacto a reproducir.");
  lines.push("");
  lines.push("## Paleta de colores");
  lines.push("");
  palette.forEach((c, i) => lines.push(`- Color ${i + 1}: \`${c}\``));
  lines.push("");
  lines.push("## Roles de color");
  lines.push("");
  SAMPLE_ROLES.forEach((r) => lines.push(`- **${r}**: \`${lab.roleColor(r, palette)}\``));
  lines.push("");
  lines.push("## Componentes que deben estar visibles");
  lines.push("");
  if (active.length) active.forEach((c) => lines.push(`- ${c.label}`));
  else lines.push("- (ninguno seleccionado en este momento)");
  lines.push("");
  lines.push("## Estilo de botones, por instancia");
  lines.push("");
  BUTTON_INSTANCE_IDS.forEach((id) => lines.push(`- \`${id}\`: ${BUTTON_STYLE_LABELS[lab.buttonStyles[id] || "relleno"]}`));
  lines.push("");
  lines.push("## Marco de bloques, por instancia");
  lines.push("");
  BLOCK_INSTANCE_IDS.forEach((id) => lines.push(`- \`${id}\`: ${BLOCK_FRAME_LABELS[lab.blockFrames[id] || "borde"]}`));
  lines.push("");
  lines.push("## Forma, densidad y elevación");
  lines.push("");
  lines.push(`- Forma de bordes: ${SHAPE_LABELS[lab.shape]} (botones \`${SHAPE_RADIUS[lab.shape]}\`, bloques grandes \`${SHAPE_RADIUS_BLOCK[lab.shape]}\`)`);
  lines.push(`- Densidad: ${DENSITY_LABELS[lab.density]} (padding \`${dens.pad}px\`, separación \`${dens.gap}px\`)`);
  lines.push(`- Elevación: ${ELEVATION_LABELS[lab.elevation]}`);
  lines.push("");
  lines.push("## Fondo de la muestra");
  lines.push("");
  lines.push(`- Modo: ${BACKGROUND_LABELS[lab.backgroundMode]}`);
  if (lab.backgroundMode === "personalizado") lines.push(`- Color personalizado: \`${lab.customBackground}\``);
  if (lab.backgroundMode === "degrade") {
    lines.push(`- Degradé entre \`${palette[lab.gradientFromIndex % palette.length]}\` y \`${palette[lab.gradientToIndex % palette.length]}\``);
  }
  lines.push("");
  lines.push("## Tipografía");
  lines.push("");
  lines.push(`- Par de fuentes: ${FONT_PAIR_LABELS[lab.fontPair]} (títulos: \`${fontPair.display}\`, cuerpo: \`${fontPair.body}\`)`);
  lines.push("");
  lines.push("## Pantalla");
  lines.push("");
  lines.push(`- Dispositivo simulado: ${DEVICE_PRESET_LABELS[lab.devicePreset]}`);
  lines.push("");
  lines.push("## Variables CSS equivalentes");
  lines.push("");
  lines.push("```css");
  lines.push(buildExportCss(lab, palette));
  lines.push("```");
  return lines.join("\n");
}
