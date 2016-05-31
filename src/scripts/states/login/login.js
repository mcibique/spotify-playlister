'use strict';

angular
  .module('playlister.states.login', ['ui.router', 'playlister.states.login.controller', 'playlister.services.auth'])
  .config(function loginStateConfig($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login/',
        templateUrl: '/scripts/states/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      });
  })
  .run(function loginStateRun($window, $location, auth) {
    let search = $window.location.hash;
    let matches = (/access_token=([^&]*)/g).exec(search);
    if (matches) {
      let code = matches[1];
      if (code) {
        auth.setKey(code);
        $location.path('playlists');
      }
    }
  });
