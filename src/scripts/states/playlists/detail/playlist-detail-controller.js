'use strict';

angular
  .module('playlister.states.playlists.detail.controller', [])
  .controller('PlaylistDetailController', function PlaylistDetailController($scope, $uibModal, $log, profile, playlist, tracksCache) {
    const vm = this;
    vm.playlist = playlist;
    vm.refreshTracks = refreshTracks;
    vm.profile = profile;

    function loadItems(playlist) {
      let notificationsCount = 0;

      vm.loadingProgress = {
        current: 0,
        total: playlist.tracks.total
      };

      return tracksCache.get(playlist, 0).then(onItemsLoaded, onItemsLoadFailed, onItemsLoadNotification);

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

    loadItems(playlist);

    function refreshTracks(playlist) {
      tracksCache.refresh(playlist);
      return loadItems(playlist);
    }
  });
