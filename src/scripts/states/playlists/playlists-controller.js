angular
  .module('playlister.states.playlists.controller', [])
  .controller('PlaylistsController', function PlaylistsController($scope, profile, playlistService) {
    const vm = this;
    vm.profile = profile;
    vm.selected = [];

    playlistService
      .getPlaylists(profile.id, { limit: 50 })
      .then(response => {
        vm.playlists = response.data;
        $scope.$broadcast('updateScrollbar');
      });
  });
