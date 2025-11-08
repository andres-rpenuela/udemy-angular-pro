import { MenuItem } from "./menu-item.interface";
import { SectionMenu } from "../types/menu-section.type";

export interface GroupedSection {
  name: string;
  key: SectionMenu;
  items: MenuItem[];
  priority: number;
}
