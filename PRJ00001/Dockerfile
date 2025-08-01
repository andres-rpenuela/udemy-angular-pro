# Stage 1: Hot reload environment
# node:24.4.1-bookworm
FROM node:24.4.1-alpine as hot-reload  
ARG ANGULAR_VERSION=20.1.3

# Instalar utilidades opcionales en Alpine
#RUN apt update && apt install -y curl net-tools ca-certificates
RUN apk add --no-cache curl net-tools ca-certificates

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli@$ANGULAR_VERSION

# Directorio de trabajo
WORKDIR /app

## Copiar package.json y yarn.lock primero para instalar dependencias
#COPY ./zoneless-calculator/package.json ./zoneless-calculator/yarn.lock* ./ 
## Instalar dependencias
#RUN yarn install --frozen-lockfile
## Copiar el resto del código fuente
#COPY ./zoneless-calculator/ .
## Por defecto no exponemos puertos, Docker Compose lo hará
# EXPOSE 4200
## El comando de arranque lo dejas en docker-compose.yml

# ####################################################################
# Stage 2: Build dependencies, heredando de hot-reload
# ####################################################################
FROM hot-reload as build-deps
WORKDIR /app
# Copiar package.json y yarn.lock primero para instalar dependencias
COPY ./zoneless-calculator/package.json ./zoneless-calculator/yarn.lock* ./

# Instalar dependencias
RUN yarn install --frozen-lockfile

# ####################################################################
# Stage 3: Start app (desarrollo)
# ####################################################################
FROM build-deps as dev
WORKDIR /app
# Copiar el resto del código fuente
COPY ./zoneless-calculator/ .

# Exponer puerto por defecto de Angular
EXPOSE 4200

# Comando para iniciar Angular en modo desarrollo
CMD ["yarn", "start"]

# ####################################################################
# Stage 4: Test con Chrome Headless
# ####################################################################
FROM build-deps as test
WORKDIR /app

# Instalar Chrome (solo en este stage)
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont

ENV CHROME_BIN=/usr/bin/chromium-browser
ENV PATH="$CHROME_BIN:$PATH"

# Copiar todo para ejecutar tests
COPY ./zoneless-calculator/ ./
RUN yarn test

# ####################################################################
# Stage 5: Build app for production
# ####################################################################
FROM hot-reload as prod-build
WORKDIR /app

# Instalar Chrome (solo en este stage)
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont

ENV CHROME_BIN=/usr/bin/chromium-browser
ENV PATH="$CHROME_BIN:$PATH"

# Copiar package.json y yarn.lock primero para instalar dependencias

COPY ./zoneless-calculator/package.json ./zoneless-calculator/yarn.lock* ./
#RUN yarn install --frozen-lockfile --production
RUN yarn install --frozen-lockfile

# Test + Compilar
COPY ./zoneless-calculator/ .
#RUN npx ng build --configuration production
RUN yarn build --configuration production

# ####################################################################
# Stage 6: NGINX for production
# ####################################################################
FROM nginx:alpine as prod

COPY --from=prod-build /app/dist/zoneless-calculator/browser /usr/share/nginx/html
COPY ./nginx-conf/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
