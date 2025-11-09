import { computed, Injectable, linkedSignal, signal } from '@angular/core';
import { MenuItem } from '../interfaces/menu-item.interface';
import { ExtendedUserInfo } from '../interfaces/user-info.interface';

@Injectable({
  providedIn: 'root',
})
export class MenuFilterService {
  constructor() {}

  private _isAuthenticated = signal<boolean>(false);

  private _userInfo = linkedSignal<ExtendedUserInfo | null>(() => null);
  private _menuItems = linkedSignal<MenuItem[]>(() => []);

  /**
   * Filtrar items del menu por authentication
   * Oculta el items del menu que requieren autenticación si el usuario no está autenticado.
   * @returns
   */
  public filterMenuItemsMyAuth = computed<MenuItem[]>(() => {
    const isAuth = this._isAuthenticated();
    const items = this._menuItems();
    const user = this._userInfo();

    return this.filterMenuItemsAuthPermisive(items, isAuth);
  });

  /**
   * Filtra items y subItems del menú de forma permisiva según autenticación
   * - Items públicos (requiresAuth = false) → SIEMPRE MOSTRAR
   * - Items sin restricción (requiresAuth = undefined) → SIEMPRE MOSTRAR
   * - Items que requieren autenticación (requiresAuth = true) → MOSTRAR SOLO SI isAuth = true
   *
   * @param items items con subItems a filtrar
   * @param isAuth criterio de filtrado
   * @returns devuelve solo los items y subItems publicos y los que cumpla la condicion de autenticación
   */
  private filterMenuItemsAuthPermisive(    items: MenuItem[],   isAuth: boolean  ): MenuItem[] {
    return items
      .filter((item) => {
        // 1. PRIMERA FASE: Filtrar por autenticación del item principal

        // Items que requieren autenticación
        if (item.requiresAuth === true) {
          return isAuth; // Solo mostrar si está autenticado, Oculta si no lo está
        }

        // Items públicos o sin restricción → SIEMPRE MOSTRAR
        // Esto incluye:
        // - requiresAuth = false (público)
        // - requiresAuth = undefined (sin restricción)
        return true;
      }) // Luego, procesar subItems recursivamente
      .map((item) => ({
        ...item,
        // 2. SEGUNDA FASE: Procesar subItems recursivamente
        subItems: item.subItems
          ? this.filterMenuItemsAuthPermisive(item.subItems, isAuth)
          : undefined,
      }))
      .filter((item) => {
        // 3. TERCERA FASE: Eliminar items padre que quedaron sin hijos visibles

        // ✅ MANTENER items que NO tienen subItems (items hoja/finales)
        if (!item.subItems) {
          return true;
        }

        // ✅ MANTENER items que SÍ tienen subItems visibles después del filtrado
        if (item.subItems.length > 0) {
          return true;
        }

        // ❌ ELIMINAR items que tenían subItems pero todos fueron filtrados
        return false;
      });
  }


  /** Getters && Setters */
  get isAuthenticated() {
    return this._isAuthenticated;
  }

  get userInfo() {
    return this._userInfo;
  }

  get menuItems() {
    return this._menuItems;
  }

  set setMenuItems(items: MenuItem[]) {
    this._menuItems.set(items);
  }

  set setUserInfo(userInfo: ExtendedUserInfo ) {
    this._userInfo.set(userInfo);
  }

  set setIsAuthenticated(isAuth: boolean) {
    this._isAuthenticated.set(isAuth);
  }

}
