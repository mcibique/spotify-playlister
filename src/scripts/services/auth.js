'use strict';

angular
  .module('playlister.services.auth', [])
  .run(($log, $rootScope, $state, auth) => {
    $rootScope.$on('$stateChangeStart', (event, toState) => {
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
  .factory('auth', ($window, $log) => {
    let localStorage = $window.localStorage;
    function getKey() {
      let key = localStorage.getItem('authKey') || '';
      if (!key) {
        $log.debug('No auth code present.');
      }
      return key;
    }

    function setKey(key) {
      $log.debug('New auth code set: ', key);
      localStorage.setItem('authKey', key);
    }

    function clearKey() {
      localStorage.removeItem('authKey');
      $log.debug('Auth code cleared.');
    }

    return { getKey, setKey, clearKey };
  });
