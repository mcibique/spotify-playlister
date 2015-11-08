'use strict';

angular
  .module('playlister.states.login', ['ui.router', 'playlister.states.login.controllers',
    'playlister.services.auth'
  ])
  .config(($stateProvider) => {
    $stateProvider
      .state('login', {
        url: '/login/',
        templateUrl: '/views/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      });
  })
  .run(($window, $state, auth) => {
    let search = $window.location.hash;
    let matches = (/access_token=([^&]*)/g).exec(search);
    if (matches) {
      let code = matches[1];
      if (code) {
        auth.setKey(code);
        $state.go('playlists');
      }
    }
  });
