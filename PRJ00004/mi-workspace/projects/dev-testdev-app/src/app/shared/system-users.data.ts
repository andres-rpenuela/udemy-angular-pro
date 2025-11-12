import { ExtendedUserInfo } from "devarp-side-menu";

// ✅ USUARIOS CENTRALIZADOS PARA TODO EL SISTEMA
export const systemUsers: ExtendedUserInfo[] = [
  {
    id: '123',
    name: 'Juan Pérez',
    email: 'juan.perez@devarp.com',
    hasNotifications: false, // Se calculará dinámicamente
    roles: ['admin', 'user', 'developer'],
    department: 'desarrollo',
    avatar: 'JP'
  },
  {
    id: '456',
    name: 'María García',
    email: 'maria.garcia@devarp.com',
    hasNotifications: false,
    roles: ['manager', 'user'],
    department: 'administracion',
    avatar: 'MG'
  },
  {
    id: '789',
    name: 'Carlos López',
    email: 'carlos.lopez@devarp.com',
    hasNotifications: false,
    roles: ['developer', 'user'],
    department: 'desarrollo',
    avatar: 'CL'
  },
  {
    id: '101',
    name: 'Ana Rodríguez',
    email: 'ana.rodriguez@devarp.com',
    hasNotifications: false,
    roles: ['hr', 'user'],
    department: 'recursos-humanos',
    avatar: 'AR'
  },
  {
    id: '102',
    name: 'Pedro Martínez',
    email: 'pedro.martinez@devarp.com',
    hasNotifications: false,
    roles: ['designer', 'user'],
    department: 'diseño',
    avatar: 'PM'
  },
  {
    id: '103',
    name: 'Laura Silva',
    email: 'laura.silva@devarp.com',
    hasNotifications: false,
    roles: ['qa', 'user'],
    department: 'calidad',
    avatar: 'LS'
  }
];

// ✅ UTILIDADES PARA TRABAJAR CON USUARIOS
export class UserUtils {
  static getUserById(id: string): ExtendedUserInfo | undefined {
    return systemUsers.find(user => user.id === id);
  }

  static getUsersByRole(role: string): ExtendedUserInfo[] {
    return systemUsers.filter(user => user.roles?.includes(role));
  }

  static getUsersByDepartment(department: string): ExtendedUserInfo[] {
    return systemUsers.filter(user => user.department === department);
  }

  static getAllUserIds(): string[] {
    return systemUsers.map(user => user.id);
  }

  static getUserDisplayName(id: string): string {
    const user = this.getUserById(id);
    return user ? user.name : `Usuario ${id}`;
  }

  static getUsersForTesting(): ExtendedUserInfo[] {
    return systemUsers.map(user => ({
      ...user,
      name: `${user.name} (${user.roles?.[0]?.toUpperCase()})`
    }));
  }
}
