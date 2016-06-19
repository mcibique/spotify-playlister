angular
  .module('playlister.services.alerts', [])
  .factory('alerts', function alerts($window) {
    const sweetAlert = $window.swal;

    function info(title, message) {
      return sweetAlert(title, message);
    }

    function success(title, message) {
      return sweetAlert(title, message, 'success');
    }

    function warning(title, message) {
      return sweetAlert(title, message, 'warning');
    }

    function error(title, message) {
      return sweetAlert(title, message, 'error');
    }

    return { info, success, warning, error };
  });
