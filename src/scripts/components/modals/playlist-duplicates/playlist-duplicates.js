angular
  .module('playlister.components.modals.playlist-duplicates', [])
  .factory('playlistDuplicates', function playlistDuplicates($uibModal) {
    function show(playlist, trackItems, duplicates) {
      const modalInstance = $uibModal.open({
        templateUrl: '/scripts/components/modals/playlist-duplicates/playlist-duplicates.html',
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
  .controller('FindDuplicatesModalController', function FindDuplicatesModalController($scope, $uibModalInstance,
    duplicates, playlist, trackItems) {
    const vm = this;
    vm.duplicates = duplicates;
    vm.playlist = playlist;
    vm.trackItems = trackItems;
    vm.close = close;
    // vm.removeDuplicate = removeDuplicate;

    function close() {
      $uibModalInstance.dismiss();
    }

    // function removeDuplicate(duplicate) {
    //   // TODO  http delete doesn't support params in angular
    //   var item = duplicate.b.item;
    //   SpotifyPlaylist.removeTracks({
    //     userId: playlist.owner.id,
    //     playlistId: playlist.id
    //   }, {
    //     tracks: [{
    //       uri: item.track.uri
    //     }]
    //   }, function (response) {
    //     $log.debug('response', response);
    //   });
    // }
  });
