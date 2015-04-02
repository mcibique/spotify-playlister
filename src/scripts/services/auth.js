(function (ng) {
  'use strict';

  ng.module('playlister.services.auth', [])
    .run(function ($log, $rootScope, $state, auth) {
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        if (toState.name === 'login') {
          return;
        }

        if (!auth.getKey()) {
          $log.debug('Unauthenticated request. Redirecting to login.');
          event.preventDefault();
          $state.go('login');
        }
      });
    })
    .factory('auth', function ($window, $log) {
      var localStorage = $window.localStorage;
      var getKey = function () {
        var key = localStorage.getItem('authKey') || '';
        if (!key) {
          $log.debug('No auth code present.');
        }
        return key;
      };

      var setKey = function (key) {
        $log.debug('New auth code set: ', key);
        localStorage.setItem('authKey', key);
      };

      var clearKey = function () {
        localStorage.removeItem('authKey');
        $log.debug('Auth code cleared.');
      };

      return {
        getKey: getKey,
        setKey: setKey,
        clearKey: clearKey
      };
    });

})(angular, jQuery);