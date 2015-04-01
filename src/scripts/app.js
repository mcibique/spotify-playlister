(function (ng, $) {
  'use strict';

  ng.module('playlister', ['ui.bootstrap', 'playlister.states', 'playlister.filters', 'playlister.services'])
    .config(function ($urlRouterProvider, $httpProvider) {
      $urlRouterProvider.otherwise('/playlists/');

      $httpProvider.defaults.useXDomain = true;
    })
    .run(function ($log) {
      $log.debug('Playlister is running.');
    });

})(angular, jQuery);