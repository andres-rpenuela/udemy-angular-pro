/** type for section menu, with assertions */
export const SECTION_MENU_TYPES = {
  main: 'main',
  settings: 'settings',
  profile: 'profile',
  help: 'help',
  auth: 'auth'
} as const;

export type SectionMenu = typeof SECTION_MENU_TYPES[keyof typeof SECTION_MENU_TYPES];
