angular
  .module('playlister.components.modals.playlist-duplicates', [])
  .factory('playlistDuplicates', function playlistDuplicates($uibModal) {
    function show(playlist, trackItems, duplicates) {
      const modalInstance = $uibModal.open({
        templateUrl: '/scripts/components/modals/playlist-duplicates/playlist-duplicates.html',
        windowClass: 'playlist-duplicates-modal',
        size: 'lg',
        resolve: {
          duplicates: () => duplicates,
          playlist: () => playlist,
          trackItems: () => trackItems
        },
        controller: 'FindDuplicatesModalController',
        controllerAs: 'vm'
      });

      return modalInstance.result;
    }

    return { show };
  })
  .controller('FindDuplicatesModalController', function FindDuplicatesModalController($scope, $uibModalInstance, $log, duplicates, playlist, trackItems, playlistService) {
    const vm = this;
    vm.duplicates = duplicates;
    vm.playlist = playlist;
    vm.trackItems = trackItems;
    vm.close = close;
    vm.removeDuplicate = removeDuplicate;

    function close() {
      $uibModalInstance.dismiss();
    }

    function removeDuplicate(duplicate) {
      const item = duplicate.item;
      const index = duplicate.index;

      const tracksToRemove = [{
        uri: item.track.uri,
        positions: [index]
      }];
      playlistService
        .removeTracks(playlist.owner.id, playlist.id, { tracks: tracksToRemove })
        .then(onTrackRemoved.bind(null, duplicate, index), onTrackRemoveFailed);
    }

    function onTrackRemoved(duplicate, index, response) {
      duplicate.removed = true;
      vm.trackItems.splice(index, 1);
      $log.debug('response', response);
    }

    function onTrackRemoveFailed(error) {
      $log.error(error);
    }
  });
