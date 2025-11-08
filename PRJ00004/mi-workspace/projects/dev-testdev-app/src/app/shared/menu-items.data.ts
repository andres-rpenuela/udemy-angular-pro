import { MenuAction, MenuItem, SECTION_MENU_TYPES } from "devarp-side-menu";

export const sidevarMenuItems: MenuItem[] = [
    {
      id: 'summary',
      label: 'Summary',
      icon: 'M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z',
      route: '/',
      action: MenuAction.itemClick,
      exact: true,
      section: SECTION_MENU_TYPES.main,
      allowedRoles: ['admin', 'manager', 'user'] // ✅ Accesible para todos
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z',
      route: '/profile',
      action: MenuAction.itemClick,
      requiresAuth: true,
      section: SECTION_MENU_TYPES.profile,
      allowedRoles: ['admin', 'manager', 'user'] // ✅ Todos los usuarios autenticados
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: 'M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625z',
      route: '/projects',
      action: MenuAction.itemClick,
      section: SECTION_MENU_TYPES.main,
      allowedRoles: ['admin', 'manager', 'user'], // ✅ Todos pueden ver proyectos
      subItems: [
        {
          id: 'active-projects',
          label: 'Active Projects',
          icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
          route: '/projects/active',
          section: SECTION_MENU_TYPES.main,
          allowedRoles: ['admin', 'manager', 'user'], // ✅ Todos pueden ver proyectos activos
          subItems: [
            {
              id: 'project-dashboard',
              label: 'Project Dashboard',
              icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z',
              route: '/projects/active/dashboard',
              section: SECTION_MENU_TYPES.main,
              allowedRoles: ['admin', 'manager'] // ✅ Solo admin y manager pueden ver dashboard
            },
            {
              id: 'project-tasks',
              label: 'Tasks Management',
              icon: 'M4.5 12.75l6 6 9-13.5',
              route: '/projects/active/tasks',
              section: SECTION_MENU_TYPES.main,
              allowedRoles: ['admin', 'manager', 'user'] // ✅ Todos pueden gestionar tareas
            }
          ]
        },
        {
          id: 'archived-projects',
          label: 'Archived Projects',
          icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
          route: '/projects/archived',
          section: SECTION_MENU_TYPES.main,
          allowedRoles: ['admin', 'manager'] // ✅ Solo admin y manager pueden ver archivados
        },
        {
          id: 'project-settings',
          label: 'Project Settings',
          icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
          route: '/projects/settings',
          requiresAuth: true,
          section: SECTION_MENU_TYPES.settings,
          allowedRoles: ['admin', 'manager'], // ✅ Solo admin y manager pueden configurar proyectos
          subItems: [
            {
              id: 'project-general-settings',
              label: 'General Settings',
              icon: 'M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z',
              route: '/projects/settings/general',
              section: SECTION_MENU_TYPES.settings,
              allowedRoles: ['admin', 'manager'] // ✅ Solo admin y manager
            },
            {
              id: 'project-security-settings',
              label: 'Security Settings',
              icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
              route: '/projects/settings/security',
              requiresAuth: true,
              section: SECTION_MENU_TYPES.settings,
              allowedRoles: ['admin'] // ✅ Solo admin puede ver configuración de seguridad
            }
          ]
        }
      ]
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9z',
      requiresAuth: true,
      route: '/notifications',
      action: MenuAction.itemClick,
      section: SECTION_MENU_TYPES.main,
      allowedRoles: ['admin', 'manager', 'user'] // ✅ Todos pueden ver notificaciones
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
      requiresAuth: true,
      section: SECTION_MENU_TYPES.main,
      allowedRoles: ['admin', 'manager'], // ✅ Solo admin y manager pueden ver reportes
      subItems: [
        {
          id: 'sales-report',
          label: 'Sales Report',
          icon: 'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941',
          route: '/reports/sales',
          section: SECTION_MENU_TYPES.main,
          allowedRoles: ['admin', 'manager'], // ✅ Solo admin y manager
          subItems: [
            {
              id: 'monthly-sales',
              label: 'Monthly Sales',
              icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
              route: '/reports/sales/monthly',
              section: SECTION_MENU_TYPES.main,
              allowedRoles: ['admin', 'manager'] // ✅ Solo admin y manager
            },
            {
              id: 'quarterly-sales',
              label: 'Quarterly Sales',
              icon: 'M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z',
              route: '/reports/sales/quarterly',
              section: SECTION_MENU_TYPES.main,
              allowedRoles: ['admin'] // ✅ Solo admin puede ver reportes trimestrales
            }
          ]
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: 'M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z',
          route: '/reports/analytics',
          section: SECTION_MENU_TYPES.main,
          allowedRoles: ['admin', 'manager'], // ✅ Solo admin y manager
          subItems: [
            {
              id: 'user-analytics',
              label: 'User Analytics',
              icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
              route: '/reports/analytics/users',
              section: SECTION_MENU_TYPES.main,
              allowedRoles: ['admin', 'manager'] // ✅ Solo admin y manager
            },
            {
              id: 'performance-analytics',
              label: 'Performance Analytics',
              icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
              route: '/reports/analytics/performance',
              section: SECTION_MENU_TYPES.main,
              allowedRoles: ['admin'] // ✅ Solo admin puede ver analytics de rendimiento
            }
          ]
        }
      ]
    },
    // ✅ Settings Section
    {
      id: 'app-settings',
      label: 'App Settings',
      icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      section: SECTION_MENU_TYPES.settings,
      allowedRoles: ['admin'], // ✅ Solo admin puede ver configuración de la app
      subItems: [
        {
          id: 'general-settings',
          label: 'General',
          icon: 'M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z',
          route: '/settings/general',
          section: SECTION_MENU_TYPES.settings,
          allowedRoles: ['admin'] // ✅ Solo admin
        },
        {
          id: 'theme-settings',
          label: 'Theme & Appearance',
          icon: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z',
          route: '/settings/theme',
          section: SECTION_MENU_TYPES.settings,
          allowedRoles: ['admin', 'manager', 'user'] // ✅ Todos pueden cambiar tema
        }
      ]
    },
    // ✅ Help Section
    {
      id: 'help-center',
      label: 'Help Center',
      icon: 'M9.879 7.519c0-1.018.132-1.854.394-2.508.263-.655.63-1.184 1.1-1.587A4.635 4.635 0 0113.5 2.25c.896 0 1.664.183 2.304.549.64.367 1.097.896 1.372 1.587.275.692.413 1.528.413 2.508 0 .934-.138 1.734-.413 2.4-.275.667-.732 1.2-1.372 1.6-.64.4-1.408.6-2.304.6-.896 0-1.664-.2-2.304-.6-.64-.4-1.097-.933-1.372-1.6-.275-.666-.413-1.466-.413-2.4zm4.621 0c0-.597-.108-1.097-.324-1.5-.216-.403-.532-.605-.948-.605s-.732.202-.948.605c-.216.403-.324.903-.324 1.5s.108 1.097.324 1.5c.216.403.532.605.948.605s.732-.202.948-.605c.216-.403.324-.903.324-1.5zM7.5 21L3 16.5l1.264-1.264a.5.5 0 01.854.353L6 18l6-6 1.5 1.5-6 6 2.411.882a.5.5 0 01.353.854L7.5 21z',
      section: SECTION_MENU_TYPES.help,
      allowedRoles: ['admin', 'manager', 'user'], // ✅ Todos pueden acceder a ayuda
      subItems: [
        {
          id: 'documentation',
          label: 'Documentation',
          icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
          route: '/help/documentation',
          section: SECTION_MENU_TYPES.help,
          allowedRoles: ['admin', 'manager', 'user'] // ✅ Todos pueden ver documentación
        },
        {
          id: 'contact-support',
          label: 'Contact Support',
          icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
          route: '/help/contact',
          section: SECTION_MENU_TYPES.help,
          allowedRoles: ['admin', 'manager', 'user'] // ✅ Todos pueden contactar soporte
        }
      ]
    },
    // ✅ Auth items
    {
      id: 'login',
      label: 'Login',
      icon: 'M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6z',
      section: SECTION_MENU_TYPES.auth,
      requiresAuth: false, // ✅ Solo visible cuando NO está autenticado
      action: MenuAction.login,
      route: '/login'
      // ✅ Sin allowedRoles porque es para usuarios no autenticados
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: 'M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122z',
      section: SECTION_MENU_TYPES.auth,
      requiresAuth: true, // ✅ Solo visible cuando SÍ está autenticado
      action: MenuAction.logout,
      route: '/logout',
      allowedRoles: ['admin', 'manager', 'user'] // ✅ Todos los usuarios autenticados pueden hacer logout
    }
  ];
