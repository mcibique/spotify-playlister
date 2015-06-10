(function (ng, $) {
  'use strict';

  ng.module('playlister', ['ui.bootstrap', 'playlister.config', 'playlister.states', 'playlister.filters',
      'playlister.services', 'playlister.directives', 'playlister.templates'
    ])
    .config(function ($urlRouterProvider, $httpProvider, $logProvider, config) {
      $logProvider.debugEnabled(config.debug);

      $urlRouterProvider.otherwise('/playlists/');

      $httpProvider.defaults.useXDomain = true;
    })
    .run(function ($log) {
      $log.debug('Playlister is running.');
    });

})(angular, jQuery);
