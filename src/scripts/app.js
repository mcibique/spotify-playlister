'use strict';

angular
  .module('playlister', ['ui.bootstrap', 'playlister.config', 'playlister.states', 'playlister.filters',
    'playlister.services', 'playlister.directives', 'playlister.templates'
  ])
  .config(($urlRouterProvider, $httpProvider, $logProvider, config) => {
    $logProvider.debugEnabled(config.debug);

    $urlRouterProvider.otherwise('/playlists/');

    $httpProvider.defaults.useXDomain = true;
  })
  .run(($log, config) => {
    const version = config.version;
    $log.debug('Playlister is running.', version);
  });
