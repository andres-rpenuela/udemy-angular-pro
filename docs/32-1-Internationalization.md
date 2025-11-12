# Internationalization

## Documentacion oficial:

Base:
- [Template](https://www.creative-tim.com/twcomponents/component/magic-ai-blocks-pricing-table)
- [Talwincss v3.1](https://v3.tailwindcss.com/)
- [Angular](https://v17.angular.io/guide/setup-local)
- [Angular ssr](https://angular.dev/guide/ssr)

Uso de i18n:
- [i18n](https://angular.dev/guide/i18n) : Integracion propia de angular, baso en etiqeutas y archvios xml
- [The internationalization (i18n) library for Angular.](https://github.com/ngx-translate/core): Librearia de terceos basado en json

```bash
npm install @angular/cli

npx ng new i18n-app --ssr

npx npm run start
```

---

# 🌍 Comparativa: Angular i18n vs NGX-Translate

## 📋 Resumen Comparativo

| Aspecto | Angular i18n (Nativo) | NGX-Translate |
|---------|----------------------|---------------|
| **Tipo** | Solución oficial de Angular | Librería de terceros |
| **Formato** | XML/XLIFF | JSON |
| **Compilación** | Build-time (AOT) | Runtime |
| **Performance** | ⚡ Más rápido | 🐌 Más lento |
| **Tamaño bundle** | 📦 Menor | 📦 Mayor |
| **Flexibilidad** | 🔒 Menos flexible | 🔄 Muy flexible |
| **Curva aprendizaje** | 📈 Más compleja | 📉 Más simple |

---

## 🔧 Angular i18n (Nativo)

### ✅ **Ventajas**
- **Performance superior**: Las traducciones se compilan en build-time
- **Bundle más pequeño**: No incluye lógica de traducción en runtime
- **Soporte oficial**: Mantenido por el equipo de Angular
- **SEO friendly**: Genera builds separados por idioma
- **Tipado fuerte**: TypeScript puede validar las claves de traducción

### ❌ **Desventajas**
- **Compilación por idioma**: Necesitas un build separado para cada idioma
- **Menos flexible**: No puedes cambiar idioma dinámicamente sin recargar
- **Configuración compleja**: Requiere más setup inicial
- **Formato XML**: Menos intuitivo que JSON
- **Dependiente del build**: Cambios requieren recompilar

### 💻 **Ejemplo de uso**

```html
<!-- Marcar texto para traducir -->
<p i18n="@@welcome-message">Welcome to our app</p>
<button i18n="@@login-button">Login</button>
```

```bash
# Extraer textos
ng extract-i18n

# Build para español
ng build --localize
```

```xml
<!-- messages.es.xlf -->
<trans-unit id="welcome-message">
  <source>Welcome to our app</source>
  <target>Bienvenido a nuestra app</target>
</trans-unit>
```

---

## 🚀 NGX-Translate

### ✅ **Ventajas**
- **Cambio dinámico**: Puedes cambiar idioma sin recargar la página
- **Formato JSON**: Más fácil de leer y editar
- **Flexibilidad**: Carga traducciones desde APIs, lazy loading
- **Interpolación**: Fácil paso de parámetros dinámicos
- **Plugins**: Ecosistema de extensiones (loaders, parsers)

### ❌ **Desventajas**
- **Performance**: Procesamiento en runtime
- **Bundle más grande**: Incluye lógica de traducción
- **Dependencia externa**: Requiere mantenimiento de terceros
- **SEO limitado**: Un solo build para todos los idiomas
- **Menos optimizado**: Para aplicaciones grandes puede ser más lento

### 💻 **Ejemplo de uso**

```typescript
// app.module.ts
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
```

```html
<!-- Usar en template -->
<p>{{ 'WELCOME_MESSAGE' | translate }}</p>
<button>{{ 'LOGIN_BUTTON' | translate }}</button>
```

```json
// es.json
{
  "WELCOME_MESSAGE": "Bienvenido a nuestra app",
  "LOGIN_BUTTON": "Iniciar sesión"
}
```

---

## 🎯 **¿Cuándo usar cada uno?**

### **Usa Angular i18n cuando:**
- ✅ Performance es crítica
- ✅ Tienes pocos idiomas (2-5)
- ✅ No necesitas cambio dinámico de idioma
- ✅ Quieres SEO optimizado por idioma
- ✅ Prefieres soluciones oficiales

### **Usa NGX-Translate cuando:**
- ✅ Necesitas cambio dinámico de idioma
- ✅ Cargas traducciones desde APIs
- ✅ Quieres desarrollo más rápido
- ✅ Tienes muchos idiomas
- ✅ Necesitas lazy loading de traducciones

---

## 📊 **Comparativa Técnica Detallada**

### **Performance**
```
Angular i18n:    ████████████ (12/12)
NGX-Translate:   ████████     (8/12)
```

### **Facilidad de uso**
```
Angular i18n:    ██████       (6/12)
NGX-Translate:   ████████████ (12/12)
```

### **Flexibilidad**
```
Angular i18n:    ████         (4/12)
NGX-Translate:   ████████████ (12/12)
```

### **Bundle size**
```
Angular i18n:    ████████████ (12/12)
NGX-Translate:   ████████     (8/12)
```

---

## 🏆 **Recomendación Final**

### **Para aplicaciones empresariales grandes** → **Angular i18n**
- Mejor performance
- Menor bundle size
- Soporte oficial a largo plazo

### **Para aplicaciones medianas/pequeñas** → **NGX-Translate**
- Desarrollo más rápido
- Mayor flexibilidad
- Mejor experiencia de usuario

### **¿Híbrido?**
Algunas aplicaciones usan ambos: Angular i18n para textos estáticos y NGX-Translate para contenido dinámico.

**La elección depende de tus prioridades: performance vs flexibilidad** 🎯