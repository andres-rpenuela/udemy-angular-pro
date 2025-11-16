# Todos los comandos de nvm (Node Version Manager), incluyendo los que aparecen al ejecutar nvm --help y algunos otros que pueden ser útiles:

## Comandos Básicos

## WINDOWS

[NodeJS](https://nodejs.org/en)

- `nvm list`: Listar instaladas.
- `nvm list available`: Listar disponibles para descargar.
- `nvm uninstall <version>`: Desinstalar.
- `nvm install <version>`: Instalar
- `nvm use <version>`: Usar

## Otros comandos que hay que verificar si funcionan (algunos no funcionan en Windows sino en Linux)

- Descargar la ultima version de nvm: [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)
- Instalar `nvm-setup.exe`
- Actualizar nvm `nvm update`
- Listar versiones de Node.js disponibles `nvm ls-remote`
- Instalar una versión específica de Node.js `nvm install <version>`
- Usar una versión específica de Node.js `nvm use <version>`
- Establecer una versión predeterminada de Node.js `nvm alias default <version>`
- Eliminar una versión específica de Node.js `nvm uninstall <version>`
- Listar versiones instaladas de Node.js `nvm ls`
- Mostrar la versión actual de Node.js `nvm current`
- Ver la versión predeterminada establecida de Node.js `nvm alias default`

## Comandos Avanzados

- Establecer una versión específica de npm para una versión de Node.js `nvm install-latest-npm`
- Listar alias establecidos `nvm alias`
- Eliminar un alias específico `nvm unalias <name>`
- Actualizar npm en la versión actual de Node.js `nvm install-latest-npm`
- Mostrar la ruta al ejecutable de Node.js para una versión específica `nvm which <version>`
- Ejecutar un script con una versión específica de Node.js sin cambiar la versión activa `nvm exec <version> <script>`
- Ejecutar un comando con una versión específica de Node.js sin cambiar la versión activa `nvm run <version> <command>`
- Crear un alias para una versión específica de Node.js `nvm alias <name> <version>`
- Deshabilitar nvm temporalmente `nvm deactivate`
- Establecer automáticamente la versión de Node.js basada en el archivo .nvmrc del directorio actual `nvm use`
- Mostrar la ruta al directorio de Node.js de la versión actual `nvm which current`

## Ejemplos de Uso

- Instalar última versión LTS NodeJS `nvm install --lts`. En Windows no es necesario "--", solo `nvm install lts`
- Usar la última versión LTS de Node.js `nvm use --lts`
- Establecer la última versión LTS como predeterminada `nvm alias default lts/*`
- Comprobar la versión de npm instalada con una versión específica de Node.js `nvm use <version> && npm -v`
- Establecer una versión específica de Node.js para un proyecto `echo <version> > .nvmrc`