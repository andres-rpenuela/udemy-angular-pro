import { UserUtils } from "./system-users.data";

export interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean; // ✅ Esto ahora será calculado dinámicamente
  type: 'task' | 'meeting' | 'system' | 'alert' | 'info';
  priority?: 'low' | 'medium' | 'high';
  actionUrl?: string;
  targetUserId?: string;
  targetRoles?: string[];
  isGlobal?: boolean;
  createdByUserId?: string;
  department?: string;
  expiresAt?: Date;
  // ✅ NUEVO: Rastrear quién ha leído la notificación
  readByUsers?: string[]; // Array de IDs de usuarios que han leído esta notificación
}

// ✅ NOTIFICACIONES ACTUALIZADAS CON IDS REALES DE USUARIOS
export const notificationsData: Notification[] = [
  // Notificación global del sistema
  {
    id: 1,
    title: 'Actualización de sistema programada',
    message: 'El sistema se actualizará esta noche a las 2:00 AM. Durante este tiempo no estará disponible.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    isRead: false,
    type: 'system',
    priority: 'medium',
    isGlobal: true,
    createdByUserId: 'system',
    actionUrl: '/system/maintenance',
    readByUsers: [] // Ningún usuario la ha leído
  },

  // Notificación para managers (María García está incluida)
  {
    id: 2,
    title: 'Reporte mensual de productividad',
    message: 'El reporte de productividad del mes está listo para revisión en el dashboard.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: false,
    type: 'info',
    priority: 'high',
    targetRoles: ['admin', 'manager'],
    createdByUserId: '456', // María García lo creó
    department: 'administracion',
    actionUrl: '/reports/monthly',
    readByUsers: ['456'] // María ya lo leyó porque ella lo creó
  },

  // Tarea específica para Juan Pérez (admin/developer)
  {
    id: 3,
    title: 'Revisar arquitectura del nuevo módulo',
    message: 'Se requiere tu revisión técnica del módulo de autenticación antes del deploy.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
    type: 'task',
    priority: 'high',
    targetUserId: '123', // Juan Pérez
    createdByUserId: '456', // Asignado por María García
    department: 'desarrollo',
    actionUrl: '/tasks/auth-module-review',
    readByUsers: []
  },

  // Reunión para desarrolladores
  {
    id: 4,
    title: 'Daily Standup - Equipo de Desarrollo',
    message: 'Reunión diaria del equipo de desarrollo mañana a las 9:00 AM en la sala de juntas.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    isRead: false,
    type: 'meeting',
    priority: 'medium',
    targetRoles: ['developer', 'admin'],
    department: 'desarrollo',
    createdByUserId: '123', // Juan Pérez (admin) organizó la reunión
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    actionUrl: '/calendar/standup-meeting',
    readByUsers: ['123'] // El organizador ya la leyó
  },

  // Alerta de seguridad para Juan Pérez
  {
    id: 5,
    title: 'Intento de acceso sospechoso detectado',
    message: 'Se detectó un intento de login desde una ubicación no reconocida en tu cuenta.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isRead: false,
    type: 'alert',
    priority: 'high',
    targetUserId: '123', // Juan Pérez
    createdByUserId: 'security-system',
    actionUrl: '/security/alerts',
    readByUsers: []
  },

  // Notificación para el departamento de RH
  {
    id: 6,
    title: 'Proceso de evaluaciones anuales',
    message: 'Ha comenzado el proceso de evaluaciones de desempeño anual. Revisa los formularios asignados.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    isRead: false,
    type: 'info',
    priority: 'medium',
    department: 'recursos-humanos',
    createdByUserId: '101', // Ana Rodríguez (HR)
    actionUrl: '/hr/evaluations',
    readByUsers: ['101'] // Ana ya la leyó
  },

  // Tarea para Carlos López (desarrollador)
  {
    id: 7,
    title: 'Code Review pendiente',
    message: 'Tienes un pull request esperando tu revisión en el repositorio principal.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    isRead: false,
    type: 'task',
    priority: 'medium',
    targetUserId: '789', // Carlos López
    createdByUserId: '123', // Asignado por Juan Pérez
    actionUrl: '/git/pull-requests',
    readByUsers: []
  },

  // Notificación global urgente
  {
    id: 8,
    title: 'Mantenimiento de emergencia',
    message: 'Se realizará un mantenimiento de emergencia en 2 horas. Guarda tu trabajo.',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    isRead: false,
    type: 'alert',
    priority: 'high',
    isGlobal: true,
    createdByUserId: 'system',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2), // Expira en 2 horas
    readByUsers: [] // Nadie la ha leído aún
  }
];

// ✅ UTILIDADES PARA NOTIFICACIONES CON USUARIOS REALES
export class NotificationUtils {
  static getNotificationsForUser(userId: string): Notification[] {
    const user = UserUtils.getUserById(userId);
    if (!user) return [];

    return notificationsData.filter(notification => {
      // Notificaciones globales
      if (notification.isGlobal) return true;

      // Notificaciones específicas para el usuario
      if (notification.targetUserId === userId) return true;

      // Notificaciones por roles
      if (notification.targetRoles && user.roles) {
        return notification.targetRoles.some(role => user.roles!.includes(role));
      }

      // Notificaciones por departamento
      if (notification.department === user.department) return true;

      return false;
    });
  }

  static getCreatorName(notification: Notification): string {
    if (notification.createdByUserId === 'system' || notification.createdByUserId === 'security-system') {
      return 'Sistema';
    }
    return UserUtils.getUserDisplayName(notification.createdByUserId || '');
  }

  static getUnreadCount(userId: string): number {
    return this.getNotificationsForUser(userId)
      .filter(n => !n.readByUsers?.includes(userId)).length;
  }
}
