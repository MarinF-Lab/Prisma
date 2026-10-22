import {
  SAMPLE_ROLES, SAMPLE_ROLE_SLUGS, SAMPLE_COMPONENTS,
  DENSITY_VALUES, FONT_PAIRS, SHAPE_RADIUS, SHAPE_RADIUS_BLOCK,
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
