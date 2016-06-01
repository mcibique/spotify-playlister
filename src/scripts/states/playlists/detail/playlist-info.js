angular
  .module('playlister.states.playlists.playlistInfo', [])
  .directive('playlistInfo', function playlistInfo() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/scripts/states/playlists/detail/playlist-info.html',
      scope: {
        playlist: '=',
        trackItems: '=',
        loadingProgress: '=',
        refreshTracks: '&'
      },
      bindToController: true,
      controllerAs: 'vm',
      controller: angular.noop
    };
  });
