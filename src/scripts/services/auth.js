angular
  .module('playlister.services.auth', [])
  .run(function authRun($log, $rootScope, $state, auth) {
    const changeStartOff = $rootScope.$on('$stateChangeStart', function onStateChange(event, toState) {
      if (toState.name === 'login') {
        return;
      }

      if (!auth.getKey()) {
        $log.debug('Unauthenticated request. Redirecting to login.');
        event.preventDefault();
        $state.go('login');
      }
    });

    $rootScope.$on('$destroy', changeStartOff);
  })
  .factory('auth', function auth($window, $log) {
    const localStorage = $window.localStorage;
    function getKey() {
      const key = localStorage.getItem('authKey') || '';
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
