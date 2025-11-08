import { Injectable, signal, computed } from '@angular/core';
import { Notification } from '../shared/notifications.data';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // ✅ SIGNAL CENTRAL DE NOTIFICACIONES
  private allNotificationsSignal = signal<Notification[]>([]);

  // ✅ COMPUTED: Obtener notificaciones para un usuario específico
  getNotificationsForUser(userId: string, userRoles: string[], department?: string) {
    return computed(() => {
      const now = new Date();

      return this.allNotificationsSignal().filter(notification => {
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
      });
    });
  }

  // ✅ MÉTODOS PARA GESTIONAR NOTIFICACIONES

  addNotification(notification: Notification): void {
    this.allNotificationsSignal.update(notifications =>
      [notification, ...notifications]
    );
  }

  markAsRead(notificationId: number, userId: string): void {
    // En una aplicación real, esto sería una llamada al backend
    this.allNotificationsSignal.update(notifications =>
      notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  }

  markAllAsReadForUser(userId: string, userRoles: string[]): void {
    const userNotifications = this.getNotificationsForUser(userId, userRoles, undefined)();

    this.allNotificationsSignal.update(notifications =>
      notifications.map(n =>
        userNotifications.some(un => un.id === n.id)
          ? { ...n, isRead: true }
          : n
      )
    );
  }

  removeNotification(notificationId: number): void {
    this.allNotificationsSignal.update(notifications =>
      notifications.filter(n => n.id !== notificationId)
    );
  }

  // ✅ MÉTODOS PARA CREAR NOTIFICACIONES ESPECÍFICAS

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
      actionUrl: '/tasks'
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
      actionUrl: '/announcements'
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
      isGlobal: true,
      createdByUserId: 'system'
    };

    this.addNotification(notification);
  }

  // ✅ INICIALIZAR CON DATOS
  loadInitialNotifications(notifications: Notification[]): void {
    this.allNotificationsSignal.set(notifications);
  }

  // ✅ OBTENER TODAS LAS NOTIFICACIONES (para admin)
  getAllNotifications() {
    return computed(() => this.allNotificationsSignal());
  }
}
