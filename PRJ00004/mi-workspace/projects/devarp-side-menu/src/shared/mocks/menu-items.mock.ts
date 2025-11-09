import { MenuItem } from "../interfaces/menu-item.interface";

export const mockMenuPublic: MenuItem[] = [
  {
    id: 'home',
    label: 'Inicio',
    route: '/home',
    requiresAuth: false,
    icon: 'home',
  },
  {
    id: 'about',
    label: 'Acerca de',
    route: '/about',
    requiresAuth: false,
    icon: 'info',
  },
  {
    id: 'contact',
    label: 'Contacto',
    route: '/contact',
    requiresAuth: false,
    icon: 'mail',
  },
];


export const mockMenuPrivate: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Panel',
    route: '/dashboard',
    requiresAuth: true,
    icon: 'dashboard',
  },
  {
    id: 'settings',
    label: 'Configuración',
    route: '/settings',
    requiresAuth: true,
    icon: 'settings',
  },
  {
    id: 'profile',
    label: 'Perfil',
    route: '/profile',
    requiresAuth: true,
    icon: 'user',
  },
];


export const mockMenuMixed: MenuItem[] = [
  {
    // Mixed
    id: 'main',
    label: 'Principal',
    route: '/main',
    requiresAuth: false,
    icon: 'menu',
    isExpandable: true,
    subItems: [
      {
        id: 'main-public',
        label: 'Público',
        route: '/main/public',
        requiresAuth: false,
        icon: 'earth',
        level: 1,
      },
      {
        id: 'main-private',
        label: 'Privado',
        route: '/main/private',
        requiresAuth: true,
        icon: 'lock',
        level: 1,
      },
    ]
  },
  {
    // Subitmes Auth
    id: 'profile',
    label: 'Perfil',
    route: '/profile',
    requiresAuth: false,
    icon: 'user',
    subItems: [
      {
        id: 'profile-info',
        label: 'Información',
        route: '/profile/info',
        requiresAuth: true,
        icon: 'info',
        level: 1,
      },
    ],
  }
];
