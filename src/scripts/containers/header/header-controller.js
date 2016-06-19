angular
  .module('playlister.containers.header.controller', [])
  .controller('HeaderController', function HeaderController($state, auth) {
    const vm = this;
    vm.logout = logout;
    vm.isLoggedIn = () => auth.isLoggedIn();

    function logout() {
      auth.logout();
      $state.go('login');
    }
  });
