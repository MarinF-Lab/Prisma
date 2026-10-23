import { useState } from "react";
import {
  DEFAULT_VISIBLE_COMPONENTS,
  SEMANTIC_ROLE_DEFAULT_COLORS,
  BUTTON_INSTANCE_IDS,
  BLOCK_INSTANCE_IDS,
} from "./sampleLabConstants.js";

// Todo el estado nuevo del Laboratorio de Muestras vive acá (no en Prisma()),
// expuesto como un único objeto `lab` para no inflar las firmas de componentes.
export function useSampleLabState() {
  const [visibleComponents, setVisibleComponents] = useState(DEFAULT_VISIBLE_COMPONENTS);

  const [roleAssignments, setRoleAssignmentsRaw] = useState({
    Principal: 0, Secundario: 1, Acento: 2, Superficie: 3,
    "Éxito": "personalizado", "Advertencia": "personalizado", "Error": "personalizado",
  });
  const [customRoleColors, setCustomRoleColors] = useState({ ...SEMANTIC_ROLE_DEFAULT_COLORS });

  const [buttonStyles, setButtonStylesRaw] = useState({
    btnPrincipal: "relleno", btnSecundario: "relleno", btnEnviar: "relleno", btnModal: "relleno",
  });
  const [blockFrames, setBlockFramesRaw] = useState({
    frameTarjeta: "borde", frameFormulario: "borde", frameBarras: "borde",
    frameDona: "borde", frameTabla: "borde", frameModal: "borde",
  });

  const [shape, setShape] = useState("suave");
  const [density, setDensity] = useState("comoda");
  const [elevation, setElevation] = useState("sutil");
  const [backgroundMode, setBackgroundMode] = useState("oscuro");
  const [customBackground, setCustomBackground] = useState("#2B6CFF");
  const [gradientFromIndex, setGradientFromIndex] = useState(0);
  const [gradientToIndex, setGradientToIndex] = useState(1);
  const [fontPair, setFontPair] = useState("sistema");
  const [devicePreset, setDevicePreset] = useState("movil");
  const [showA11yBadges, setShowA11yBadges] = useState(true);

  // Interacciones de demo dentro de las piezas (no forman parte del export).
  const [switchOn, setSwitchOn] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [selectedChips, setSelectedChips] = useState({ 0: true, 2: true });
  const [currentPage, setCurrentPage] = useState(2);
  const [modalOpenDemo, setModalOpenDemo] = useState(true);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Edición por instancia, estilo Canva.
  const [editGroup, setEditGroup] = useState(null); // "boton" | "marco" | null
  const [editInstance, setEditInstance] = useState(null);

  const [labExportOpen, setLabExportOpen] = useState(false);

  const toggleComponent = (id) => setVisibleComponents((prev) => ({ ...prev, [id]: !prev[id] }));

  const setRoleAssignment = (role, value) => {
    setRoleAssignmentsRaw((prev) => ({ ...prev, [role]: value }));
    if (value === "personalizado") {
      setCustomRoleColors((prev) =>
        prev[role] ? prev : { ...prev, [role]: SEMANTIC_ROLE_DEFAULT_COLORS[role] || "#888888" }
      );
    }
  };
  const setCustomRoleColor = (role, hex) => setCustomRoleColors((prev) => ({ ...prev, [role]: hex }));

  const setButtonStyleFor = (instanceId, value) =>
    setButtonStylesRaw((prev) =>
      instanceId === "ALL"
        ? Object.fromEntries(BUTTON_INSTANCE_IDS.map((id) => [id, value]))
        : { ...prev, [instanceId]: value }
    );
  const setBlockFrameFor = (instanceId, value) =>
    setBlockFramesRaw((prev) =>
      instanceId === "ALL"
        ? Object.fromEntries(BLOCK_INSTANCE_IDS.map((id) => [id, value]))
        : { ...prev, [instanceId]: value }
    );

  const roleColor = (role, palette) => {
    const value = roleAssignments[role];
    if (value === "personalizado") return customRoleColors[role] || "#888888";
    return palette[value % palette.length];
  };

  const openEdit = (group, instanceId) => { setEditGroup(group); setEditInstance(instanceId); };
  const closeEdit = () => { setEditGroup(null); setEditInstance(null); };

  const toggleChip = (index) => setSelectedChips((prev) => ({ ...prev, [index]: !prev[index] }));

  return {
    visibleComponents, toggleComponent,
    roleAssignments, setRoleAssignment, customRoleColors, setCustomRoleColor, roleColor,
    buttonStyles, setButtonStyleFor, blockFrames, setBlockFrameFor,
    shape, setShape,
    density, setDensity,
    elevation, setElevation,
    backgroundMode, setBackgroundMode,
    customBackground, setCustomBackground,
    gradientFromIndex, setGradientFromIndex,
    gradientToIndex, setGradientToIndex,
    fontPair, setFontPair,
    devicePreset, setDevicePreset,
    showA11yBadges, setShowA11yBadges,
    switchOn, setSwitchOn,
    activeTabIndex, setActiveTabIndex,
    selectedChips, toggleChip,
    currentPage, setCurrentPage,
    modalOpenDemo, setModalOpenDemo,
    tooltipOpen, setTooltipOpen,
    formSubmitted, setFormSubmitted,
    editGroup, editInstance, openEdit, closeEdit,
    labExportOpen, setLabExportOpen,
  };
}
