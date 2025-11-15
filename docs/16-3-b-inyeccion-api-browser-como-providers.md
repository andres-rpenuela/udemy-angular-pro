# Indice

[1](#-inyección-de-apis-del-navegador-como-providers)
  [1.1](#-qué-es-esto)
  [1.2](#-para-qué-sirve)
    [1.2.a](#1--testabilidad)
    [1.2.b](#2-️-compatibilidad-ssr)
    [1.2.c](#3--flexibilidad-y-mocking)
  [1.3](#-ejemplos-prácticos)
    [1.3.a](#servicio-que-usa-estos-providers)
    [1.3.b](#en-tests)
  [1.4](#-configuración-completa-recomendada)
  [1.5](#-ventajas-principales)

[2](#-lista-completa-de-apis-del-navegador-como-providers)
  [2.1](#-storage-apis)
  [2.2](#-navigation--location-apis)
  [2.3](#-document-apis)
  [2.4](#-media-apis)
  [2.5](#-network--communication)
  [2.6](#-notifications--permissions)
  [2.7](#-performance--timing)
  [2.8](#-device--hardware)
  [2.9](#-security--crypto)
  [2.10](#-graphics--animation)
  [2.11](#️-file--data-apis)

[3](#-ejemplo-configuración-completa-de-ejemplo)

[4](#-ejemplo-uso-en-servicios)


# 🔧 **Inyección de APIs del Navegador como Providers**

## 🎯 **¿Qué es esto?**

Son **providers personalizados** que hacen que las **APIs nativas del navegador** estén disponibles para **inyección de dependencias** en Angular.

```typescript
// En lugar de usar directamente:
localStorage.setItem('key', 'value');
window.location.href = '/page';
navigator.geolocation.getCurrentPosition();

// Puedes inyectarlas como servicios:
constructor(
  @Inject('BROWSER_STORAGE') private storage: Storage,
  @Inject('WINDOW') private window: Window,
  @Inject('GEOLOCATION') private geo: Geolocation
) {}
```

---

## 🤔 **¿Para qué sirve?**

### **1. 🧪 Testabilidad**
```typescript
// ❌ DIFÍCIL DE TESTEAR
@Component({})
export class MyComponent {
  saveData() {
    localStorage.setItem('data', 'value'); // Hard-coded dependency
  }
}

// ✅ FÁCIL DE TESTEAR
@Component({})
export class MyComponent {
  constructor(@Inject('BROWSER_STORAGE') private storage: Storage) {}
  
  saveData() {
    this.storage.setItem('data', 'value'); // Mockeable!
  }
}

// En tests:
TestBed.configureTestingModule({
  providers: [
    { provide: 'BROWSER_STORAGE', useValue: mockStorage } // 🎭 Mock
  ]
});
```

### **2. 🖥️ Compatibilidad SSR**
```typescript
// ❌ ERROR EN SSR
export class BadService {
  getData() {
    return localStorage.getItem('data'); // 💥 ReferenceError: localStorage is not defined
  }
}

// ✅ FUNCIONA EN SSR
export class GoodService {
  constructor(@Inject('BROWSER_STORAGE') private storage: Storage | null) {}
  
  getData() {
    return this.storage?.getItem('data') || null; // 🛡️ Safe
  }
}
```
### **3. 🔄 Flexibilidad y Mocking**
```typescript
// Diferentes implementaciones según el entorno
const appConfig: ApplicationConfig = {
  providers: [
    // 🌐 En producción
    { provide: 'BROWSER_STORAGE', useValue: localStorage },
    
    // 🧪 En desarrollo (con logging)
    { 
      provide: 'BROWSER_STORAGE', 
      useValue: {
        setItem: (key: string, value: string) => {
          console.log(`Setting ${key} = ${value}`);
          localStorage.setItem(key, value);
        },
        getItem: (key: string) => {
          const value = localStorage.getItem(key);
          console.log(`Getting ${key} = ${value}`);
          return value;
        }
      }
    }
  ]
};
```

## 💡 **Ejemplos prácticos**

### **Servicio que usa estos providers:**
Se puede crear un servicio que maneje estos providers y de compatibilidad con `ssr`.

```typescript
@Injectable()
export class PlatformService {
  
  constructor(
    @Inject('WINDOW') private window: Window | null,
    @Inject('DOCUMENT') private document: Document | null,
    @Inject('BROWSER_STORAGE') private storage: Storage | null,
    @Inject('GEOLOCATION') private geo: Geolocation | null,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // 🌍 Obtener ubicación
  async getCurrentLocation(): Promise<GeolocationPosition | null> {
    if (isPlatformBrowser(this.platformId) && this.geo) {
      return new Promise((resolve, reject) => {
        this.geo!.getCurrentPosition(resolve, reject);
      });
    }
    return null;
  }

  // 💾 Guardar en storage
  saveUserPreference(key: string, value: string): boolean {
    if (isPlatformBrowser(this.platformId) && this.storage) {
      this.storage.setItem(key, value);
      return true;
    }
    return false;
  }

  // 🔗 Navegar
  navigateToUrl(url: string): void {
    if (isPlatformBrowser(this.platformId) && this.window) {
      this.window.location.href = url;
    }
  }

  // 📱 Detectar dispositivo
  isMobileDevice(): boolean {
    if (isPlatformBrowser(this.platformId) && this.window) {
      return /Mobile|Android|iPhone/i.test(this.window.navigator.userAgent);
    }
    return false;
  }
}
```

### **En tests:**
Como se ha mencionado, permiten ser testables de forma sencilla
```typescript
describe('PlatformService', () => {
  let service: PlatformService;
  const mockWindow = {
    location: { href: '' },
    navigator: { userAgent: 'Chrome Desktop' }
  };
  const mockStorage = {
    setItem: jasmine.createSpy('setItem'),
    getItem: jasmine.createSpy('getItem').and.returnValue('test-value')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'WINDOW', useValue: mockWindow },
        { provide: 'BROWSER_STORAGE', useValue: mockStorage },
        { provide: 'GEOLOCATION', useValue: null },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    
    service = TestBed.inject(PlatformService);
  });

  it('should save user preference', () => {
    service.saveUserPreference('theme', 'dark');
    expect(mockStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });
});
```

## 🚀 **Configuración completa recomendada**

```typescript
// app.config.ts
import { ApplicationConfig, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    // 🌐 APIs del navegador (solo en cliente)
    {
      provide: 'WINDOW',
      useFactory: (platformId: Object) => 
        isPlatformBrowser(platformId) ? window : null,
      deps: [PLATFORM_ID]
    },
    {
      provide: 'DOCUMENT', 
      useFactory: (platformId: Object) => 
        isPlatformBrowser(platformId) ? document : null,
      deps: [PLATFORM_ID]
    },
    {
      provide: 'BROWSER_STORAGE',
      useFactory: (platformId: Object) => 
        isPlatformBrowser(platformId) ? localStorage : null,
      deps: [PLATFORM_ID]
    },
    {
      provide: 'SESSION_STORAGE',
      useFactory: (platformId: Object) => 
        isPlatformBrowser(platformId) ? sessionStorage : null,
      deps: [PLATFORM_ID]
    },
    {
      provide: 'GEOLOCATION',
      useFactory: (platformId: Object) => 
        isPlatformBrowser(platformId) ? navigator.geolocation : null,
      deps: [PLATFORM_ID]
    }
  ]
};
```

## 🎯 **Ventajas principales**

✅ **Testeable**: Puedes mockear fácilmente las APIs del navegador  
✅ **SSR Safe**: No crashes en el servidor  
✅ **Flexible**: Diferentes implementaciones según el entorno  
✅ **Type Safe**: Mantienes el tipado de TypeScript  
✅ **Inyectable**: Sigue el patrón de DI de Angular  

**En resumen: Convierte las APIs globales del navegador en servicios inyectables de Angular para mayor control y testabilidad.** 🛡️

---- 
# 🌐 **Lista completa de APIs del navegador como Providers**

**¡Con estos providers tienes acceso controlado y testeable a todas las APIs principales del navegador! 🚀**

## 📱 **Storage APIs**
```typescript
// 💾 Almacenamiento local
{ provide: 'LOCAL_STORAGE', useValue: localStorage },
{ provide: 'SESSION_STORAGE', useValue: sessionStorage },

// 🗄️ IndexedDB
{ provide: 'INDEXED_DB', useValue: indexedDB },

// 🍪 Cookies (nativo)
{ provide: 'DOCUMENT_COOKIE', useFactory: () => document?.cookie },
```

## 🌍 **Navigation & Location APIs**
```typescript
// 🧭 Navegación
{ provide: 'WINDOW', useValue: window },
{ provide: 'LOCATION', useValue: location },
{ provide: 'HISTORY', useValue: history },
{ provide: 'NAVIGATOR', useValue: navigator },

// 📍 Geolocalización
{ provide: 'GEOLOCATION', useValue: navigator?.geolocation },
```

## 📄 **Document APIs**
```typescript
// 📋 DOM
{ provide: 'DOCUMENT', useValue: document },
{ provide: 'DOCUMENT_HEAD', useValue: document?.head },
{ provide: 'DOCUMENT_BODY', useValue: document?.body },

// 🎨 Selection
{ provide: 'SELECTION', useFactory: () => window?.getSelection() },
```

## 🎥 **Media APIs**
```typescript
// 📹 Cámara y micrófono
{ provide: 'MEDIA_DEVICES', useValue: navigator?.mediaDevices },
{ provide: 'GET_USER_MEDIA', useValue: navigator?.getUserMedia },

// 🔊 Audio Context
{ provide: 'AUDIO_CONTEXT', useFactory: () => 
  new (window.AudioContext || window.webkitAudioContext)()
},

// 🖼️ Canvas
{ provide: 'CANVAS_2D', useFactory: () => {
  const canvas = document.createElement('canvas');
  return canvas.getContext('2d');
}},
```

## 🌐 **Network & Communication**
```typescript
// 🌐 Fetch API
{ provide: 'FETCH', useValue: fetch.bind(window) },

// 🔌 WebSockets
{ provide: 'WEBSOCKET', useValue: WebSocket },

// 📡 Server-Sent Events
{ provide: 'EVENT_SOURCE', useValue: EventSource },

// 💬 Broadcast Channel
{ provide: 'BROADCAST_CHANNEL', useFactory: () => 
  (name: string) => new BroadcastChannel(name)
},
```
## 🔔 **Notifications & Permissions**
```typescript
// 🔔 Notificaciones
{ provide: 'NOTIFICATION', useValue: Notification },

// 🔐 Permisos
{ provide: 'PERMISSIONS', useValue: navigator?.permissions },

// 📳 Vibration
{ provide: 'VIBRATE', useValue: navigator?.vibrate?.bind(navigator) },
```
## ⚡ **Performance & Timing**
```typescript
// ⏱️ Performance
{ provide: 'PERFORMANCE', useValue: performance },

// 🕐 Timing
{ provide: 'REQUEST_ANIMATION_FRAME', useValue: requestAnimationFrame },
{ provide: 'CANCEL_ANIMATION_FRAME', useValue: cancelAnimationFrame },

// ⏰ Timers
{ provide: 'SET_TIMEOUT', useValue: setTimeout },
{ provide: 'SET_INTERVAL', useValue: setInterval },
```

## 📱 **Device & Hardware**
```typescript
// 🔋 Batería
{ provide: 'BATTERY', useFactory: () => navigator?.getBattery?.() },

// 📱 Device Orientation
{ provide: 'DEVICE_ORIENTATION', useFactory: () => ({
  addEventListener: (event: string, handler: Function) =>
    window.addEventListener(event, handler),
  removeEventListener: (event: string, handler: Function) =>
    window.removeEventListener(event, handler)
})},

// 📶 Network Information
{ provide: 'CONNECTION', useValue: (navigator as any)?.connection },

// 🎮 Gamepad
{ provide: 'GAMEPAD', useValue: navigator?.getGamepads?.bind(navigator) },
```

## 🔐 **Security & Crypto**
```typescript
// 🔒 Crypto
{ provide: 'CRYPTO', useValue: crypto },
{ provide: 'SUBTLE_CRYPTO', useValue: crypto?.subtle },

// 🔑 Credentials
{ provide: 'CREDENTIALS', useValue: navigator?.credentials },
```
## 🎨 **Graphics & Animation**
```typescript
// 🎨 Canvas 2D
{ provide: 'CANVAS_2D_CONTEXT', useFactory: () => {
  const canvas = document.createElement('canvas');
  return canvas.getContext('2d');
}},

// 🌈 WebGL
{ provide: 'WEBGL_CONTEXT', useFactory: () => {
  const canvas = document.createElement('canvas');
  return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
}},

// 🎪 Intersection Observer
{ provide: 'INTERSECTION_OBSERVER', useValue: IntersectionObserver },

// 👀 Mutation Observer
{ provide: 'MUTATION_OBSERVER', useValue: MutationObserver },
```

## 🛠️ **File & Data APIs**
```typescript
// 📁 File System
{ provide: 'FILE_READER', useValue: FileReader },
{ provide: 'BLOB', useValue: Blob },
{ provide: 'FILE', useValue: File },

// 📊 Data URLs
{ provide: 'URL', useValue: URL },
{ provide: 'CREATE_OBJECT_URL', useValue: URL.createObjectURL },
{ provide: 'REVOKE_OBJECT_URL', useValue: URL.revokeObjectURL },
```

## 📐 **Measurement & Layout**
```typescript
// 📏 Resize Observer
{ provide: 'RESIZE_OBSERVER', useValue: ResizeObserver },

// 📍 Scroll APIs
{ provide: 'SCROLL_TO', useValue: window?.scrollTo?.bind(window) },
{ provide: 'SCROLL_BY', useValue: window?.scrollBy?.bind(window) },
```

--- 
# 🎯 **Ejemplo: Configuración completa de ejemplo**

```typescript
// app.config.ts
import { ApplicationConfig, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

function createBrowserProvider<T>(token: string, factory: () => T) {
  return {
    provide: token,
    useFactory: (platformId: Object) => 
      isPlatformBrowser(platformId) ? factory() : null,
    deps: [PLATFORM_ID]
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    // 💾 Storage
    createBrowserProvider('LOCAL_STORAGE', () => localStorage),
    createBrowserProvider('SESSION_STORAGE', () => sessionStorage),
    createBrowserProvider('INDEXED_DB', () => indexedDB),

    // 🌐 Navigation
    createBrowserProvider('WINDOW', () => window),
    createBrowserProvider('DOCUMENT', () => document),
    createBrowserProvider('LOCATION', () => location),
    createBrowserProvider('HISTORY', () => history),
    createBrowserProvider('NAVIGATOR', () => navigator),

    // 📍 Geolocation
    createBrowserProvider('GEOLOCATION', () => navigator.geolocation),

    // 🎥 Media
    createBrowserProvider('MEDIA_DEVICES', () => navigator.mediaDevices),
    
    // 🔔 Notifications
    createBrowserProvider('NOTIFICATION', () => Notification),
    
    // ⚡ Performance
    createBrowserProvider('PERFORMANCE', () => performance),
    
    // 🔒 Security
    createBrowserProvider('CRYPTO', () => crypto),
    
    // 🌐 Network
    createBrowserProvider('FETCH', () => fetch.bind(window)),
    
    // 🎨 Graphics
    createBrowserProvider('INTERSECTION_OBSERVER', () => IntersectionObserver),
    createBrowserProvider('RESIZE_OBSERVER', () => ResizeObserver),
    
    // 📁 Files
    createBrowserProvider('FILE_READER', () => FileReader),
    createBrowserProvider('URL_API', () => URL)
  ]
};
```

---

# 🎯 **Ejemplo: Uso en servicios**

```typescript
@Injectable()
export class BrowserAPIService {
  constructor(
    @Inject('LOCAL_STORAGE') private localStorage: Storage | null,
    @Inject('GEOLOCATION') private geolocation: Geolocation | null,
    @Inject('NOTIFICATION') private notification: typeof Notification | null,
    @Inject('PERFORMANCE') private performance: Performance | null,
    @Inject('CRYPTO') private crypto: Crypto | null
  ) {}

  // 💾 Storage methods
  saveData(key: string, value: string): boolean {
    if (this.localStorage) {
      this.localStorage.setItem(key, value);
      return true;
    }
    return false;
  }

  // 📍 Location methods
  async getCurrentLocation(): Promise<GeolocationPosition | null> {
    if (this.geolocation) {
      return new Promise((resolve, reject) => {
        this.geolocation!.getCurrentPosition(resolve, reject);
      });
    }
    return null;
  }

  // 🔔 Notification methods
  showNotification(title: string, options?: NotificationOptions): boolean {
    if (this.notification && this.notification.permission === 'granted') {
      new this.notification(title, options);
      return true;
    }
    return false;
  }

  // ⚡ Performance methods
  getPageLoadTime(): number | null {
    if (this.performance) {
      return this.performance.now();
    }
    return null;
  }

  // 🔒 Crypto methods
  generateUUID(): string | null {
    if (this.crypto) {
      return this.crypto.randomUUID();
    }
    return null;
  }
}
```
