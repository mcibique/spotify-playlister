angular
  .module('playlister.components.modals.playlists-merge', [])
  .factory('playlistsMerge', function playlistsMerge($uibModal) {
    function merge(fromPlaylist, toPlaylist) {
      const fields = 'items(added_at,track(name,id,uri,album(name,id),artists(id,name)))';

      const modalInstance = $uibModal.open({
        templateUrl: '/scripts/components/modals/playlists-merge/playlists-merge.html',
        resolve: {
          fromTracks: tracksCache => tracksCache.get(fromPlaylist, 0, fields),
          fromPlaylist: () => fromPlaylist,
          toTracks: tracksCache => tracksCache.get(toPlaylist, 0, fields),
          toPlaylist: () => toPlaylist
        },
        controller: 'MergePlaylistsModalController'
      });

      return modalInstance.result;
    }

    return { merge };
  })
  .controller('MergePlaylistsModalController', function MergePlaylistsModalController($scope, $uibModalInstance, $log, fromTracks, fromPlaylist, toTracks, toPlaylist, tracksComparer, playlistService) {
    const vm = this;
    vm.fromPlaylist = fromPlaylist;
    vm.fromTracks = fromTracks;
    vm.filteredFromTracks = fromTracks;
    vm.toPlaylist = toPlaylist;
    vm.toTracks = toTracks;
    vm.lastXDays = 7;
    vm.ok = function ok() {
      $uibModalInstance.close();
    };
    vm.cancel = function cancel() {
      $uibModalInstance.dismiss();
    };

    // filtering
    function filterTracks(tracks, days) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      return tracks.filter(item => new Date(item.added_at) >= fromDate);
    }

    vm.filteredFromTracks = filterTracks(fromTracks, vm.lastXDays);

    $scope.$watch(scope => scope.lastXDays, (newValue, oldValue) => {
      if (newValue !== oldValue && !isNaN(newValue) && newValue >= 0) {
        vm.filteredFromTracks = filterTracks(fromTracks, newValue);
      }
    });

    // compare
    // vm.commonTracks = [];

    // tracksComparer.compare(fromTracks, toTracks).then(function (commonTracks) {
    //   vm.commonTracks = commonTracks.ids;
    //   vm.commonTracks.forEach(function (track) {
    //     track.isCommon = true;
    //   });
    // });
    const compareResult = tracksComparer.compare(fromTracks, toTracks);
    compareResult.ids.forEach(result => (result.a.isCommon = true));
    compareResult.titles.forEach(result => (result.a.isCommon = true));

    vm.getUniqueTracks = function getUniqueTracks(tracks) {
      return tracks.filter(item => !item.track.isCommon || item.userOverride);
    };

    vm.getDuplicateTracks = function getDuplicateTracks(tracks) {
      return tracks.filter(item => item.track.isCommon && !item.userOverride);
    };

    vm.addSelectedToPlaylist = function addSelectedToPlaylist() {
      const selected = vm.filteredFromTracks.filter(item => item.selected).map(item => item.track.uri);
      if (!selected.length) {
        return;
      }

      playlistService
        .addTracks(toPlaylist.owner.id, toPlaylist.id, { uris: selected })
        .then(() => {
          $log.debug('success');
          vm.ok();
        });
    };
  });
