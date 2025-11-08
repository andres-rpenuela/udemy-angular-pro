import { SECTION_PRIORITIES } from "../data/section-priority.data";
import { SectionMenu } from "../types/menu-section.type";

// ✅ FUNCIÓN HELPER PARA OBTENER PRIORIDAD
export function getSectionPriority(section: SectionMenu): number {
  return SECTION_PRIORITIES[section] || 999;
}

// ✅ FUNCIÓN HELPER PARA OBTENER NOMBRE LEGIBLE
export function getSectionDisplayName(section: SectionMenu): string {
  const displayNames: Record<SectionMenu, string> = {
    auth: 'Autenticación',
    main: 'Principal',
    settings: 'Configuración',
    profile: 'Perfil',
    help: 'Ayuda'
  };
  return displayNames[section] || section;
}
