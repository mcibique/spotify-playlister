angular
  .module('playlister.containers.header.controller', [])
  .controller('HeaderController', function HeaderController($state, auth) {
    const vm = this;
    vm.logout = logout;
    vm.isLoggedIn = isLoggedIn;

    function logout() {
      auth.clearKey();
      $state.go('login');
    }

    function isLoggedIn() {
      return !!auth.getKey();
    }
  });
