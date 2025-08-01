// karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {
        // Aquí puedes configurar opciones de Jasmine si necesitas
      },
      clearContext: false // deja los resultados visibles en el navegador
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,

    // ✅ Usamos una versión personalizada de ChromeHeadless que funciona en Docker
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',           // ✅ Necesario en contenedores Docker
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--remote-debugging-port=9222'
        ]
      }
    },

    // ✅ Mantén esto en false si quieres que Karma siga ejecutándose
    singleRun: false,
    restartOnFileChange: true,

    // ✅ Cobertura de código (si usas ng test --code-coverage)
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    }
  });
};
