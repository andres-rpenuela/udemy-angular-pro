import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { DevarpSideMenu, MenuAction, MenuItem, SECTION_MENU_TYPES, TextColorType, UserInfo as BaseUserInfo, ExtendedUserInfo } from 'devarp-side-menu';
import { sidevarMenuItems } from './shared/menu-items.data';
import { notificationsData, Notification } from './shared/notifications.data';
import { NotificationService } from './shared/notification.service';
import { systemUsers, UserUtils } from './shared/system-users.data';


@Component({
  selector: 'app-root',
  imports: [DevarpSideMenu, CommonModule, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  // ✅ INYECTAR SERVICIO DE NOTIFICACIONES
  private notificationService = inject(NotificationService);

  // ✅ NUEVO: Control del sidebar horizontal
  protected isHorizontalSidebarOpen = signal<boolean>(true);

  public toggleHorizontalSidebar(): void {
    this.isHorizontalSidebarOpen.update(current => !current);
  }

  // ✅ ===========================================
  // ✅ CONFIGURACIÓN DE TEMA Y TÍTULO
  // ✅ ===========================================

  protected readonly title = signal('DevArp');
  protected isDarkMode = signal(true);

  protected readonly titleColor = computed(() => {
    return this.isDarkMode() ? TextColorType.blue : TextColorType.pink;
  });

  // ✅ ===========================================
  // ✅ GESTIÓN DE USUARIOS UNIFICADA
  // ✅ ===========================================

  // ✅ Signal base del usuario usando el primer usuario del sistema
  private baseUserInfo = signal<ExtendedUserInfo | null>(systemUsers[0]); // Juan Pérez por defecto

  // ✅ COMPUTED: Usuario con hasNotifications calculado dinámicamente
  protected readonly userInfo = computed<ExtendedUserInfo | null>(() => {
    const user = this.baseUserInfo();
    if (!user) return null;

    // Calcular si tiene notificaciones no leídas
    const userNotifications = this.notificationService.getNotificationsForUser(
      user.id,
      user.roles || [],
      user.department
    )();

    const hasUnreadNotifications = userNotifications.some(n => !n.isRead);

    return {
      ...user,
      hasNotifications: hasUnreadNotifications // ✅ Calculado dinámicamente
    };
  });

  protected readonly isAuthenticated = computed<boolean>(() => this.userInfo() !== null);

  // ✅ USUARIOS CENTRALIZADOS PARA TESTING
  protected readonly testUsers = computed(() => UserUtils.getUsersForTesting());

  // ✅ ===========================================
  // ✅ SISTEMA DE NOTIFICACIONES (sin cambios)
  // ✅ ===========================================

  private showNotificationsPanelSignal = signal(false);
  protected readonly showNotificationsPanel = computed(() => this.showNotificationsPanelSignal());

  // ✅ COMPUTED: Notificaciones específicas para el usuario actual
  protected readonly userNotifications = computed(() => {
    const user = this.baseUserInfo();
    if (!user) return [];

    return this.notificationService.getNotificationsForUser(
      user.id,
      user.roles || [],
      user.department
    )();
  });

  // ✅ COMPUTED: Verificar permisos para ver notificaciones
  protected readonly hasNotificationPermissions = computed(() => {
    const notificationItem = this.menuItems().find(item =>
      item.route === '/notifications' ||
      item.label?.toLowerCase().includes('notification')
    );

    if (!notificationItem) return false;

    if (notificationItem.requiresAuth && !this.isAuthenticated()) {
      return false;
    }

    if (!notificationItem.allowedRoles || notificationItem.allowedRoles.length === 0) {
      return true;
    }

    const userRoles = this.userInfo()?.roles || [];
    return notificationItem.allowedRoles.some(role => userRoles.includes(role));
  });

  // ✅ COMPUTED: Verificar si hay notificaciones no leídas
  protected readonly hasNotifications = computed(() => {
    return this.userNotifications().some(notification => !notification.isRead);
  });

  // ✅ COMPUTED: Obtener lista de notificaciones para mostrar
  protected readonly getNotificationsList = computed(() => {
    return this.userNotifications()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  });

  // ✅ COMPUTED: Contar notificaciones no leídas
  protected readonly unreadNotificationsCount = computed(() => {
    return this.userNotifications().filter(n => !n.isRead).length;
  });

  // ✅ MÉTODOS PARA MANEJO DE NOTIFICACIONES (sin cambios)

  toggleNotificationsPanel(): void {
    this.showNotificationsPanelSignal.update(value => !value);
  }

  handleNotificationClick(notification: Notification): void {
    const user = this.baseUserInfo();
    if (!user) return;

    this.notificationService.markAsRead(notification.id, user.id);
    this.showNotificationsPanelSignal.set(false);

    if (notification.actionUrl) {
      console.log('Navegando a:', notification.actionUrl);
    }

    console.log('Notificación procesada:', notification);
  }

  markAllAsRead(): void {
    const user = this.baseUserInfo();
    if (!user) return;

    this.notificationService.markAllAsReadForUser(user.id, user.roles || []);
  }

  viewAllNotifications(): void {
    this.showNotificationsPanelSignal.set(false);
    console.log('Navegando a todas las notificaciones');
  }

  // ✅ MÉTODOS PARA CREAR NOTIFICACIONES MEJORADOS

  sendTaskToUser(targetUserId: string, taskTitle: string): void {
    const currentUser = this.baseUserInfo();
    if (!currentUser) return;

    const targetUser = UserUtils.getUserById(targetUserId);
    const targetName = targetUser ? targetUser.name : 'Usuario';

    this.notificationService.createTaskNotification(
      targetUserId,
      `Nueva tarea: ${taskTitle}`,
      `${currentUser.name} te ha asignado: ${taskTitle}`,
      currentUser.id
    );

    console.log(`Tarea "${taskTitle}" enviada a ${targetName} (${targetUserId})`);
  }

  sendAnnouncementToRole(role: string, title: string, message: string): void {
    const currentUser = this.baseUserInfo();
    if (!currentUser) return;

    const usersWithRole = UserUtils.getUsersByRole(role);

    this.notificationService.createRoleNotification(
      [role],
      title,
      message,
      currentUser.id
    );

    console.log(`Anuncio "${title}" enviado a rol ${role} (${usersWithRole.length} usuarios)`);
  }

  sendGlobalAnnouncement(title: string, message: string): void {
    this.notificationService.createGlobalNotification(title, message);
    console.log(`Anuncio global "${title}" enviado a todos los usuarios`);
  }

  // ✅ ===========================================
  // ✅ GESTIÓN DE USUARIOS UNIFICADA
  // ✅ ===========================================

  changeUser(newUser: ExtendedUserInfo): void {
    console.log('Cambiando a usuario:', newUser.name);

    // Buscar el usuario real en el sistema
    const systemUser = UserUtils.getUserById(newUser.id);
    if (systemUser) {
      const userWithoutNotifications = { ...systemUser };
      delete (userWithoutNotifications as any).hasNotifications;

      this.baseUserInfo.set(userWithoutNotifications);

      // Debug mejorado
      setTimeout(() => {
        console.log(`=== CAMBIO A ${systemUser.name.toUpperCase()} ===`);
        console.log('ID:', systemUser.id);
        console.log('Roles:', systemUser.roles?.join(', '));
        console.log('Departamento:', systemUser.department);
        console.log('Notificaciones visibles:', this.userNotifications().length);
        console.log('Notificaciones no leídas:', this.unreadNotificationsCount());
        console.log('hasNotifications:', this.userInfo()?.hasNotifications);
        console.log('=====================================');
      }, 100);
    }
  }

  logout(): void {
    console.log('Usuario desconectado');
    this.baseUserInfo.set(null);
    this.showNotificationsPanelSignal.set(false);
  }

  openLoginModal(): void {
    console.log('Abrir modal de login');
  }

  // ✅ MÉTODOS DE TESTING MEJORADOS

  testSendTaskToCurrentUser(): void {
    const currentUser = this.baseUserInfo();
    if (!currentUser) return;

    this.sendTaskToUser(currentUser.id, 'Revisar documentación técnica actualizada');
  }

  testSendTaskToRandomUser(): void {
    const currentUser = this.baseUserInfo();
    if (!currentUser) return;

    const otherUsers = systemUsers.filter(u => u.id !== currentUser.id);
    const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];

    this.sendTaskToUser(randomUser.id, `Tarea asignada por ${currentUser.name}`);
  }

  testSendAnnouncementToAdmins(): void {
    this.sendAnnouncementToRole('admin', 'Reunión de administradores', 'Reunión urgente mañana a las 10:00 AM');
  }

  testSendAnnouncementToDevelopers(): void {
    this.sendAnnouncementToRole('developer', 'Sprint Planning', 'Reunión de planificación del próximo sprint');
  }

  testSendGlobalAnnouncement(): void {
    this.sendGlobalAnnouncement('Actualización de políticas', 'Se han actualizado las políticas de seguridad de la empresa');
  }

  // ✅ MÉTODOS DE TESTING AVANZADOS (actualizados)

  addNotificationToCurrentUser(): void {
    const currentUser = this.baseUserInfo();
    if (!currentUser) return;

    this.notificationService.createTaskNotification(
      currentUser.id,
      'Tarea de prueba automática',
      `Notificación de prueba generada para ${currentUser.name}`,
      'system'
    );

    console.log(`Notificación de prueba agregada para ${currentUser.name}`);
  }

  clearAllNotificationsForCurrentUser(): void {
    const currentUser = this.baseUserInfo();
    if (!currentUser) return;

    this.markAllAsRead();
    console.log(`Todas las notificaciones marcadas como leídas para ${currentUser.name}`);
  }

  // ✅ MÉTODOS DE TESTING ESPECÍFICOS PARA USUARIOS UNIFICADOS

  testSwitchToUser(userId: string): void {
    const user = UserUtils.getUserById(userId);
    if (user) {
      this.changeUser(user);
    }
  }

  testShowAllUsersStats(): void {
    console.log('=== ESTADÍSTICAS DE TODOS LOS USUARIOS ===');
    systemUsers.forEach(user => {
      const notifications = this.notificationService.getNotificationsForUser(
        user.id, user.roles || [], user.department
      )();
      const unreadCount = notifications.filter(n => !n.isRead).length;

      console.log(`${user.name}:`);
      console.log(`  - Roles: ${user.roles?.join(', ')}`);
      console.log(`  - Departamento: ${user.department}`);
      console.log(`  - Notificaciones: ${notifications.length} total, ${unreadCount} sin leer`);
      console.log('---');
    });
    console.log('==========================================');
  }

  // ✅ RESTO DEL CÓDIGO (sin cambios significativos)

  testMarkAsUnread(): void {
    const currentUser = this.baseUserInfo();
    if (!currentUser) return;

    const firstNotification = this.userNotifications()[0];
    if (firstNotification) {
      this.notificationService.markAsUnread(firstNotification.id, currentUser.id);
      console.log(`"${firstNotification.title}" marcada como NO leída para ${currentUser.name}`);
    }
  }

  testDebugNotifications(): void {
    const currentUser = this.baseUserInfo();
    if (!currentUser) return;

    this.notificationService.debugUserNotifications(
      currentUser.id,
      currentUser.roles || [],
      currentUser.department
    );
  }

  testDebugGlobalNotification(): void {
    const globalNotification = this.notificationService.getAllNotifications()()
      .find(n => n.isGlobal);

    if (globalNotification) {
      this.notificationService.debugNotificationReads(globalNotification.id);
    }
  }

  simulateMultipleUsersReading(): void {
    const globalNotification = this.notificationService.getAllNotifications()()
      .find(n => n.isGlobal);

    if (globalNotification) {
      const userIds = UserUtils.getAllUserIds().slice(0, 3); // Primeros 3 usuarios
      userIds.forEach(userId => {
        const user = UserUtils.getUserById(userId);
        this.notificationService.markAsRead(globalNotification.id, userId);
        console.log(`${user?.name} leyó la notificación global`);
      });

      this.testDebugGlobalNotification();
    }
  }

  // ✅ RESTO DEL CÓDIGO (sidebar, tema, etc. - sin cambios)

  protected menuItems = signal<MenuItem[]>(sidevarMenuItems);
  private readonly activateButtonInSidebar: boolean = false;
  useFloatingButtonChildren = signal<boolean>(this.activateButtonInSidebar);
  isSidevarOpen = signal<boolean>(false);

  public toggleChildSidebar(): void {
    this.isSidevarOpen.update(current => !current);
  }

  public onSidebarStateChange(newState: boolean): void {
    this.isSidevarOpen.set(newState);
  }

  onThemeChange(isDark: boolean): void {
    this.isDarkMode.set(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  ngOnInit(): void {
    console.log('App initialized');

    // ✅ CARGAR NOTIFICACIONES EN EL SERVICIO
    this.notificationService.loadInitialNotifications(notificationsData);

    this.loadThemeFromStorage();
    this.debugAppState();
  }

  private loadThemeFromStorage(): void {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    this.isDarkMode.set(shouldUseDark);

    if (shouldUseDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  getUserButtonClass(role: string): string {
    const baseClasses = 'transition-all duration-200 hover:shadow-md';
    switch (role?.toLowerCase()) {
      case 'admin':
        return `${baseClasses} bg-red-500 hover:bg-red-600 shadow-red-500/25`;
      case 'manager':
        return `${baseClasses} bg-blue-500 hover:bg-blue-600 shadow-blue-500/25`;
      case 'developer':
        return `${baseClasses} bg-green-500 hover:bg-green-600 shadow-green-500/25`;
      case 'designer':
        return `${baseClasses} bg-purple-500 hover:bg-purple-600 shadow-purple-500/25`;
      case 'hr':
        return `${baseClasses} bg-pink-500 hover:bg-pink-600 shadow-pink-500/25`;
      case 'qa':
        return `${baseClasses} bg-orange-500 hover:bg-orange-600 shadow-orange-500/25`;
      default:
        return `${baseClasses} bg-gray-500 hover:bg-gray-600 shadow-gray-500/25`;
    }
  }

  debugAppState(): void {
    console.log('=== APP STATE DEBUG ===');
    console.log('Usuario actual:', this.userInfo()?.name);
    console.log('Roles:', this.userInfo()?.roles?.join(', '));
    console.log('Departamento:', this.userInfo()?.department);
    console.log('Notificaciones del usuario:', this.userNotifications().length);
    console.log('No leídas:', this.unreadNotificationsCount());
    console.log('hasNotifications:', this.hasNotifications());
    console.log('Total usuarios en sistema:', systemUsers.length);
    console.log('=======================');
  }
}
