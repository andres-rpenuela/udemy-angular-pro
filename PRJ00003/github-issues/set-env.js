const { writeFileSync, mkdirSync, existsSync } = require('fs');
const { resolve, dirname } = require('path');
const dotenv = require('dotenv');

// Cargar variables desde .env
const result = dotenv.config({ path: '.env' });
if (result.error) {
  throw result.error;
}

// Lista de entornos soportados
const environments = [
  {
    name: 'dev',
    file: 'environment.development.ts',
    production: false,
    apiUrl: process.env.GITHUB_ANGULAR_PATH_BASE_DEV,
    companyName: process.env.COMPANY_NAME_DEV,
  },
  {
    name: 'staging',
    file: 'environment.staging.ts',
    production: false,
    apiUrl: process.env.GITHUB_ANGULAR_PATH_BASE_STAGING,
    companyName: process.env.COMPANY_NAME_STAGING,
  },
  {
    name: 'prod',
    file: 'environment.prod.ts',
    production: true,
    apiUrl: process.env.GITHUB_ANGULAR_PATH_BASE_PROD,
    companyName: process.env.COMPANY_NAME_PROD,
  },
   {
    name: 'base',
    file: 'environment.ts', // 👈 este es el que Angular importa siempre
    production: false,
    apiUrl: process.env.GITHUB_ANGULAR_PATH_BASE_DEV, // por defecto apunta a dev
    companyName: process.env.COMPANY_NAME_DEV,
  }
];

environments.forEach(env => {
  const targetPath = resolve(__dirname, `./src/environments/${env.file}`);

  // 📌 Crea la carpeta environments si no existe
  mkdirSync(dirname(targetPath), { recursive: true });

  // 📌 Crea o sobrescribe el archivo environment
  const content = `
export const environment = {
  production: ${env.production},
  GITHUB_ANGULAR_PATH_BASE: '${env.apiUrl}',
  COMPANY_NAME: '${env.companyName}',
  GITHUB_TOKEN: '${process.env.GITHUB_TOKEN}' // ⚠️ No usar en producción, solo para desarrollo local
};
`;

  // si no eixte los crea, y si no los actualiza
  writeFileSync(targetPath, content.trim(), { encoding: 'utf-8' });
  console.log(`✅ Archivo generado/actualizado: ${targetPath}`);

  // Solo escribe si no existe, o si quieres forzar, usa siempre writeFileSync
  //if (!existsSync(targetPath)) {
  //  writeFileSync(targetPath, content.trim(), { encoding: 'utf-8' });
  //  console.log(`✅ Archivo creado: ${targetPath}`);
  //} else {
  //  console.log(`ℹ️ Ya existe: ${targetPath}`);
  //}
});
