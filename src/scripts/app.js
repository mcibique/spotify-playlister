'use strict';

angular
  .module('playlister', ['ui.bootstrap', 'playlister.config', 'playlister.states', 'playlister.filters', 'playlister.services', 'playlister.directives', 'playlister.templates'])
  .config(function appConfig($urlRouterProvider, $httpProvider, $logProvider, $compileProvider, config) {
    $compileProvider.debugInfoEnabled(config.debug);

    $logProvider.debugEnabled(config.debug);

    $urlRouterProvider.otherwise('/playlists/');

    $httpProvider.defaults.useXDomain = true;
  })
  .run(function appRun($log, config) {
    const version = config.version;
    $log.debug('Playlister is running.', version);
  });
