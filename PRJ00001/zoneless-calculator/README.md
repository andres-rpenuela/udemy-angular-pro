# ZonelessCalculator

## 🚀 Angular Dev Environment with Docker

Este entorno utiliza Docker para ejecutar una aplicación Angular en modo desarrollo con **hot reload**, usando `yarn`, Angular CLI y `docker-compose`.

---

### 📦 Características

* 🐳 Multi-stage Dockerfile con 3 etapas:

  * **hot-reload**: Imagen base Alpine + Angular CLI.
  * **build-deps**: Instalación de dependencias vía `yarn`.
  * **start**: Copia el código y arranca la app con `yarn start`.
* 🔁 Soporte para **hot reload** gracias al montaje de volúmenes (`volumes`) en `docker-compose.yml`.
* 🧩 Basado en `node:24.4.1-alpine` para imágenes livianas.
* ⚡ Angular CLI versión configurable (por default `20.1.3`).
* ✅ `node_modules` dentro del contenedor para evitar problemas de compatibilidad con tu host.

---

### ▶️ Cómo usar

#### 1. Clona el repositorio y navega a la raíz del proyecto:

```bash
git clone <repo-url>
cd <repo>
```

#### 2. Ejecuta en modo desarrollo (con hot reload):

```bash
docker compose up --build
```

O en segundo plano:

```bash
docker compose up -d --build
```

#### 3. Accede a la app:

Abre tu navegador en [http://localhost:4200](http://localhost:4200)

---

### 🧹 Comandos útiles

| Acción                                   | Comando                             |             |
| ---------------------------------------- | ----------------------------------- | ----------- |
| Apagar y eliminar contenedor y volúmenes | `docker compose down --volumes`     |             |
| Forzar reconstrucción limpia             | `docker compose build --no-cache`   |             |
| Abrir terminal dentro del contenedor     | `docker exec -it <container_id> sh` |             |
| Verificar si el server está corriendo    | \`netstat -tlnp                     | grep 4200\` |
| Ver procesos relacionados a Angular      | \`ps aux                            | grep ng\`   |

---

### 📁 Estructura de archivos

```
/
├── Dockerfile
├── docker-compose.yml
├── zoneless-calculator/
│   ├── package.json
│   ├── yarn.lock
│   ├── src/
│   └── ...
```

---

### 🛠 Requisitos

* Docker 20+
* Docker Compose 1.29+
* Recomendado: Git, WSL2 (si estás en Windows), VSCode + Docker extension

---