import { MenuAction } from "../enums/menu-action.enum";
import { SectionMenu } from "../types/menu-section.type";

export interface MenuItem {
  id: string;
  label: string;
  route?: string; // ✅ Opcional para items padre
  action?: MenuAction;
  href?: string;
  icon?: string;
  requiresAuth?: boolean;
  section?:SectionMenu;
  exact?: boolean;
  subItems?: MenuItem[]; // ✅ Array de sub-items
  isExpandable?: boolean; // ✅ Flag para items expandibles
  level?: number; // ✅ Nivel de anidación (0 = padre, 1 = hijo, etc.)
}










