angular
  .module('playlister.states.playlists.playlistTracks', [])
  .directive('playlistTracks', function playlistTracks() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/scripts/states/playlists/detail/playlist-tracks.html',
      scope: {
        trackItems: '='
      },
      bindToController: true,
      controllerAs: 'vm',
      controller: angular.noop
    };
  });
