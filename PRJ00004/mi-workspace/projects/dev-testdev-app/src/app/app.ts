import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { DevarpSideMenu, MenuAction, MenuItem, SECTION_MENU_TYPES, TextColorType, UserInfo as BaseUserInfo } from 'devarp-side-menu';
import { sidevarMenuItems } from './shared/menu-items.data';
import { notificationsData, Notification } from './shared/notifications.data';
import { NotificationService } from './shared/notification.service';

// ✅ INTERFAZ EXTENDIDA CON DEPARTAMENTO
export interface ExtendedUserInfo extends BaseUserInfo {
  department?: string;
}

@Component({
  selector: 'app-root',
  imports: [DevarpSideMenu, CommonModule, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  // ✅ INYECTAR SERVICIO DE NOTIFICACIONES
  private notificationService = inject(NotificationService);

  // ✅ ===========================================
  // ✅ CONFIGURACIÓN DE TEMA Y TÍTULO
  // ✅ ===========================================

  protected readonly title = signal('DevArp');
  protected isDarkMode = signal(true);

  protected readonly titleColor = computed(() => {
    return this.isDarkMode() ? TextColorType.blue : TextColorType.pink;
  });

  // ✅ ===========================================
  // ✅ GESTIÓN DE USUARIOS Y AUTENTICACIÓN
  // ✅ ===========================================

  // ✅ Signal base del usuario (sin hasNotifications calculado automáticamente)
  private baseUserInfo = signal<ExtendedUserInfo | null>({
    id: '123',
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    roles: ['admin', 'user'],
    hasNotifications: false, // Valor inicial, se calculará dinámicamente
    department: 'desarrollo'
  });


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

  // ✅ ===========================================
  // ✅ SISTEMA DE NOTIFICACIONES CON SERVICIO
  // ✅ ===========================================

  private showNotificationsPanelSignal = signal(false);
  protected readonly showNotificationsPanel = computed(() => this.showNotificationsPanelSignal());

  // ✅ COMPUTED: Notificaciones específicas para el usuario actual
  protected readonly userNotifications = computed(() => {
    const user = this.baseUserInfo(); // Usar baseUserInfo para evitar ciclo infinito
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

  // ✅ MÉTODOS PARA MANEJO DE NOTIFICACIONES

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

  // ✅ MÉTODOS PARA CREAR NOTIFICACIONES ESPECÍFICAS

  sendTaskToUser(targetUserId: string, taskTitle: string): void {
    const currentUser = this.baseUserInfo();
    if (!currentUser) return;

    this.notificationService.createTaskNotification(
      targetUserId,
      `Nueva tarea: ${taskTitle}`,
      `${currentUser.name} te ha asignado una nueva tarea: ${taskTitle}`,
      currentUser.id
    );

    console.log(`Tarea enviada al usuario ${targetUserId}`);
  }

  sendAnnouncementToRole(role: string, title: string, message: string): void {
    const currentUser = this.baseUserInfo();
    if (!currentUser) return;

    this.notificationService.createRoleNotification(
      [role],
      title,
      message,
      currentUser.id
    );

    console.log(`Anuncio enviado a rol ${role}`);
  }

  sendGlobalAnnouncement(title: string, message: string): void {
    this.notificationService.createGlobalNotification(title, message);
    console.log('Anuncio global enviado');
  }

  // ✅ ===========================================
  // ✅ GESTIÓN DE USUARIOS (TESTING MEJORADO)
  // ✅ ===========================================

  changeUser(newUser: ExtendedUserInfo): void {
    console.log('Changing user to:', newUser);
    // ✅ Actualizar el usuario base (sin hasNotifications)
    const userWithoutNotifications = {
      ...newUser,
      // No incluir hasNotifications aquí, se calculará automáticamente
    };
    delete (userWithoutNotifications as any).hasNotifications;

    this.baseUserInfo.set(userWithoutNotifications);
    console.log('Notificaciones para nuevo usuario:', this.userNotifications().length);
    console.log('Tiene notificaciones no leídas:', this.hasNotifications());
  }

  logout(): void {
    console.log('User logged out');
    this.baseUserInfo.set(null);
    this.showNotificationsPanelSignal.set(false);
  }

  openLoginModal(): void {
    console.log('Abrir modal de login');
  }

  // ✅ USUARIOS DE TESTING CON hasNotifications
  testUsers: ExtendedUserInfo[] = [
    {
      id: '123',
      name: 'Juan Pérez (Admin)',
      email: 'juan.perez@example.com',
      hasNotifications: false, // ✅ Campo requerido - se sobreescribirá dinámicamente
      roles: ['admin', 'user'],
      department: 'desarrollo'
    },
    {
      id: '456',
      name: 'María García (Manager)',
      email: 'maria.garcia@example.com',
      hasNotifications: false, // ✅ Campo requerido - se sobreescribirá dinámicamente
      roles: ['manager', 'user'],
      department: 'administracion'
    },
    {
      id: '789',
      name: 'Carlos López (Developer)',
      email: 'carlos.lopez@example.com',
      hasNotifications: false, // ✅ Campo requerido - se sobreescribirá dinámicamente
      roles: ['developer', 'user'],
      department: 'desarrollo'
    },
    {
      id: '101',
      name: 'Ana Rodríguez (HR)',
      email: 'ana.rodriguez@example.com',
      hasNotifications: false, // ✅ Campo requerido - se sobreescribirá dinámicamente
      roles: ['hr', 'user'],
      department: 'recursos-humanos'
    }
  ];

  // ✅ MÉTODOS DE TESTING
  testSendTaskToCurrentUser(): void {
    const currentUser = this.baseUserInfo();
    if (!currentUser) return;

    this.sendTaskToUser(currentUser.id, 'Revisar documentación técnica');
  }

  testSendAnnouncementToAdmins(): void {
    this.sendAnnouncementToRole('admin', 'Reunión de administradores', 'Reunión urgente mañana a las 10:00 AM');
  }

  testSendGlobalAnnouncement(): void {
    this.sendGlobalAnnouncement('Mantenimiento programado', 'El sistema estará en mantenimiento esta noche');
  }

  // ✅ MÉTODOS ADICIONALES PARA TESTING DE NOTIFICACIONES

  addNotificationToCurrentUser(): void {
    const currentUser = this.baseUserInfo();
    if (!currentUser) return;

    this.notificationService.createTaskNotification(
      currentUser.id,
      'Tarea de prueba',
      'Esta es una notificación de prueba para verificar que hasNotifications se actualiza',
      'system'
    );

    console.log('Notificación agregada. hasNotifications ahora es:', this.userInfo()?.hasNotifications);
  }

  clearAllNotificationsForCurrentUser(): void {
    const currentUser = this.baseUserInfo();
    if (!currentUser) return;

    this.markAllAsRead();

    console.log('Todas las notificaciones marcadas como leídas. hasNotifications ahora es:', this.userInfo()?.hasNotifications);
  }

  // ✅ ===========================================
  // ✅ RESTO DEL CÓDIGO (SIDEBAR, TEMA, ETC.)
  // ✅ ===========================================

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

  debugAppState(): void {
    console.log('=== APP STATE DEBUG ===');
    console.log('User:', this.userInfo());
    console.log('Base user:', this.baseUserInfo());
    console.log('User notifications:', this.userNotifications().length);
    console.log('Unread notifications:', this.unreadNotificationsCount());
    console.log('Has notifications (computed):', this.hasNotifications());
    console.log('Has notification permissions:', this.hasNotificationPermissions());
    console.log('=======================');
  }
}
