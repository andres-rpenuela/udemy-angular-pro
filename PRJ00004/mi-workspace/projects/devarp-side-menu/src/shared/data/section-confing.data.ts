import { SectionConfig } from '../interfaces/section-config.interface';
import { SECTION_PRIORITIES } from './section-priority.data';

export const SECTION_CONFIGS: SectionConfig[] = [
  { key: 'auth', displayName: 'Autenticación', priority: SECTION_PRIORITIES.auth },        // 1
  { key: 'main', displayName: 'Principal', priority: SECTION_PRIORITIES.main },           // 2
  { key: 'settings', displayName: 'Configuración', priority: SECTION_PRIORITIES.settings }, // 3
  { key: 'profile', displayName: 'Perfil', priority: SECTION_PRIORITIES.profile },        // 4
  { key: 'help', displayName: 'Ayuda', priority: SECTION_PRIORITIES.help },              // 5
];
