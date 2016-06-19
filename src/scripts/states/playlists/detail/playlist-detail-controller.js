angular
  .module('playlister.states.playlists.detail.controller', [])
  .controller('PlaylistDetailController', function PlaylistDetailController($scope, $uibModal, $log, profile, playlist, tracksCache) {
    const vm = this;
    vm.playlist = playlist;
    vm.refreshTracks = refreshTracks;
    vm.profile = profile;

    loadItems(vm.playlist);

    function loadItems(playlist) {
      let notificationsCount = 0;

      vm.loadingProgress = {
        current: 0,
        total: playlist.tracks.total
      };

      const startingOffset = 0;
      return tracksCache.get(playlist, startingOffset).then(onItemsLoaded, onItemsLoadFailed, onItemsLoadNotification);

      function onItemsLoaded(result) {
        vm.trackItems = result;
        vm.loadingProgress = null;
        return result;
      }

      function onItemsLoadFailed(error) {
        vm.loadingProgress = null;
        return error;
      }

      function onItemsLoadNotification(items) {
        if (notificationsCount === 0 || !vm.trackItems) {
          vm.trackItems = [];
        }

        notificationsCount++;
        vm.trackItems = vm.trackItems.concat(items);
        vm.loadingProgress.current = vm.trackItems.length;
        $scope.$broadcast('updateScrollbar');
        return items;
      }
    }

    function refreshTracks(playlist) {
      tracksCache.invalidate(playlist);
      return loadItems(playlist);
    }
  });
