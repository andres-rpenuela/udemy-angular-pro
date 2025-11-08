export interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: 'task' | 'meeting' | 'system' | 'alert' | 'info';
  priority?: 'low' | 'medium' | 'high';
  actionUrl?: string;
  // ✅ NUEVOS CAMPOS PARA ENLAZAR CON USUARIOS
  targetUserId?: string;           // ID del usuario destinatario
  targetRoles?: string[];          // Roles que pueden ver esta notificación
  isGlobal?: boolean;             // Si es para todos los usuarios
  createdByUserId?: string;       // Quién creó la notificación
  department?: string;            // Departamento específico
  expiresAt?: Date;              // Fecha de expiración
}

// ✅ NOTIFICACIONES CON ENLACES A USUARIOS
export const notificationsData: Notification[] = [
  // Notificaciones globales (para todos)
  {
    id: 1,
    title: 'Actualización de sistema',
    message: 'El sistema se actualizará esta noche a las 2:00 AM',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    isRead: false,
    type: 'system',
    priority: 'medium',
    isGlobal: true,
    createdByUserId: 'system',
    actionUrl: '/system/maintenance'
  },

  // Notificaciones por roles
  {
    id: 2,
    title: 'Reporte mensual disponible',
    message: 'El reporte de productividad está listo para revisión',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: false,
    type: 'info',
    priority: 'high',
    targetRoles: ['admin', 'manager'],
    createdByUserId: 'system',
    department: 'administracion',
    actionUrl: '/reports/monthly'
  },

  // Notificaciones específicas por usuario
  {
    id: 3,
    title: 'Nueva tarea asignada',
    message: 'Se te ha asignado revisar el código del módulo de autenticación',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
    type: 'task',
    priority: 'high',
    targetUserId: '123', // Para Juan Pérez específicamente
    createdByUserId: 'manager001',
    department: 'desarrollo',
    actionUrl: '/tasks/auth-module-review'
  },

  {
    id: 4,
    title: 'Reunión de equipo',
    message: 'Reunión de standup mañana a las 9:00 AM',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    isRead: false,
    type: 'meeting',
    priority: 'medium',
    targetRoles: ['developer', 'manager'],
    department: 'desarrollo',
    createdByUserId: 'manager001',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // Expira en 24h
    actionUrl: '/calendar/standup-meeting'
  },

  {
    id: 5,
    title: 'Alerta de seguridad',
    message: 'Se detectó actividad sospechosa en tu cuenta',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isRead: false,
    type: 'alert',
    priority: 'high',
    targetUserId: '123',
    createdByUserId: 'security-system',
    actionUrl: '/security/alerts'
  }
];
