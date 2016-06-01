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

    function error(title, message) {
      return sweetAlert(title, message, 'error');
    }

    function warning(title, message) {
      return sweetAlert(title, message, 'warning');
    }

    return { info, success, error, warning };
  });
