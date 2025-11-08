import { Injectable, signal, computed } from '@angular/core';
import { Notification } from '../shared/notifications.data';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // ✅ SIGNAL CENTRAL DE NOTIFICACIONES
  private allNotificationsSignal = signal<Notification[]>([]);

  // ✅ COMPUTED: Obtener notificaciones para un usuario específico con estado de lectura calculado
  getNotificationsForUser(userId: string, userRoles: string[], department?: string) {
    return computed(() => {
      const now = new Date();

      return this.allNotificationsSignal()
        .filter(notification => {
          // Filtrar notificaciones expiradas
          if (notification.expiresAt && notification.expiresAt < now) {
            return false;
          }

          // Notificaciones globales
          if (notification.isGlobal) {
            return true;
          }

          // Notificaciones específicas para el usuario
          if (notification.targetUserId === userId) {
            return true;
          }

          // Notificaciones por roles
          if (notification.targetRoles && notification.targetRoles.some(role => userRoles.includes(role))) {
            return true;
          }

          // Notificaciones por departamento
          if (notification.department && notification.department === department) {
            return true;
          }

          return false;
        })
        .map(notification => ({
          ...notification,
          // ✅ CALCULAR isRead BASADO EN SI EL USUARIO ESTÁ EN readByUsers
          isRead: this.isNotificationReadByUser(notification, userId)
        }));
    });
  }

  // ✅ MÉTODO PRIVADO: Verificar si una notificación ha sido leída por un usuario
  private isNotificationReadByUser(notification: Notification, userId: string): boolean {
    return notification.readByUsers?.includes(userId) || false;
  }

  // ✅ MÉTODOS PARA GESTIONAR NOTIFICACIONES CON ESTADO POR USUARIO

  addNotification(notification: Notification): void {
    const notificationWithEmptyReadList = {
      ...notification,
      readByUsers: notification.readByUsers || []
    };

    this.allNotificationsSignal.update(notifications =>
      [notificationWithEmptyReadList, ...notifications]
    );
  }

  // ✅ MARCAR COMO LEÍDA SOLO PARA UN USUARIO ESPECÍFICO
  markAsRead(notificationId: number, userId: string): void {
    this.allNotificationsSignal.update(notifications =>
      notifications.map(n => {
        if (n.id === notificationId) {
          const readByUsers = n.readByUsers || [];
          // Solo agregar el usuario si no está ya en la lista
          if (!readByUsers.includes(userId)) {
            return {
              ...n,
              readByUsers: [...readByUsers, userId]
            };
          }
        }
        return n;
      })
    );

    console.log(`Notificación ${notificationId} marcada como leída para usuario ${userId}`);
  }

  // ✅ MARCAR TODAS COMO LEÍDAS PARA UN USUARIO ESPECÍFICO
  markAllAsReadForUser(userId: string, userRoles: string[], department?: string): void {
    const userNotifications = this.getNotificationsForUser(userId, userRoles, department)();

    this.allNotificationsSignal.update(notifications =>
      notifications.map(n => {
        // Solo actualizar notificaciones que son visibles para este usuario
        const isUserNotification = userNotifications.some(un => un.id === n.id);

        if (isUserNotification) {
          const readByUsers = n.readByUsers || [];
          if (!readByUsers.includes(userId)) {
            return {
              ...n,
              readByUsers: [...readByUsers, userId]
            };
          }
        }
        return n;
      })
    );

    console.log(`Todas las notificaciones marcadas como leídas para usuario ${userId}`);
  }

  // ✅ MARCAR COMO NO LEÍDA PARA UN USUARIO (para testing)
  markAsUnread(notificationId: number, userId: string): void {
    this.allNotificationsSignal.update(notifications =>
      notifications.map(n => {
        if (n.id === notificationId) {
          const readByUsers = n.readByUsers || [];
          return {
            ...n,
            readByUsers: readByUsers.filter(id => id !== userId)
          };
        }
        return n;
      })
    );

    console.log(`Notificación ${notificationId} marcada como NO leída para usuario ${userId}`);
  }

  removeNotification(notificationId: number): void {
    this.allNotificationsSignal.update(notifications =>
      notifications.filter(n => n.id !== notificationId)
    );
  }

  // ✅ MÉTODOS PARA CREAR NOTIFICACIONES ESPECÍFICAS (actualizados)

  createTaskNotification(targetUserId: string, title: string, message: string, createdBy: string): void {
    const notification: Notification = {
      id: Date.now(),
      title,
      message,
      timestamp: new Date(),
      isRead: false,
      type: 'task',
      priority: 'medium',
      targetUserId,
      createdByUserId: createdBy,
      actionUrl: '/tasks',
      readByUsers: [] // ✅ Inicializar vacío
    };

    this.addNotification(notification);
  }

  createRoleNotification(targetRoles: string[], title: string, message: string, createdBy: string): void {
    const notification: Notification = {
      id: Date.now(),
      title,
      message,
      timestamp: new Date(),
      isRead: false,
      type: 'info',
      priority: 'medium',
      targetRoles,
      createdByUserId: createdBy,
      actionUrl: '/announcements',
      readByUsers: [] // ✅ Inicializar vacío
    };

    this.addNotification(notification);
  }

  createGlobalNotification(title: string, message: string, type: Notification['type'] = 'info'): void {
    const notification: Notification = {
      id: Date.now(),
      title,
      message,
      timestamp: new Date(),
      isRead: false,
      type,
      priority: 'medium',
      isGlobal: true, // ✅ Notificación global
      createdByUserId: 'system',
      readByUsers: [] // ✅ Ningún usuario la ha leído inicialmente
    };

    this.addNotification(notification);
  }

  // ✅ INICIALIZAR CON DATOS
  loadInitialNotifications(notifications: Notification[]): void {
    // Asegurar que todas las notificaciones tengan readByUsers
    const notificationsWithReadUsers = notifications.map(n => ({
      ...n,
      readByUsers: n.readByUsers || []
    }));

    this.allNotificationsSignal.set(notificationsWithReadUsers);
  }

  // ✅ OBTENER TODAS LAS NOTIFICACIONES (para admin)
  getAllNotifications() {
    return computed(() => this.allNotificationsSignal());
  }

  // ✅ MÉTODOS DE DEBUGGING MEJORADOS

  debugNotificationReads(notificationId: number): void {
    const notification = this.allNotificationsSignal().find(n => n.id === notificationId);
    if (notification) {
      console.log(`=== DEBUG NOTIFICATION ${notificationId} ===`);
      console.log('Título:', notification.title);
      console.log('Es global:', notification.isGlobal);
      console.log('Leída por usuarios:', notification.readByUsers);
      console.log('Total usuarios que la leyeron:', notification.readByUsers?.length || 0);
      console.log('=====================================');
    }
  }

  debugUserNotifications(userId: string, userRoles: string[], department?: string): void {
    const userNotifications = this.getNotificationsForUser(userId, userRoles, department)();
    console.log(`=== NOTIFICACIONES PARA USUARIO ${userId} ===`);
    console.log('Total notificaciones:', userNotifications.length);
    console.log('No leídas:', userNotifications.filter(n => !n.isRead).length);
    console.log('Leídas:', userNotifications.filter(n => n.isRead).length);

    userNotifications.forEach(n => {
      console.log(`- ${n.title}: ${n.isRead ? 'LEÍDA' : 'NO LEÍDA'} ${n.isGlobal ? '(GLOBAL)' : ''}`);
    });
    console.log('==========================================');
  }
}
