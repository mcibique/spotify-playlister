(function (ng) {

  ng.module('playlister', [])
    .run(function ($log) {
      $log.debug('Playlister is running.');
    });

})(angular);