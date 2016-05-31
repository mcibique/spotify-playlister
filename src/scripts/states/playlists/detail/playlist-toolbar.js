'use strict';

angular
  .module('playlister.states.playlists.playlistToolbar', [])
  .directive('playlistToolbar', function playlistToolbar() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/scripts/states/playlists/detail/playlist-toolbar.html',
      scope: {
        playlist: '=',
        trackItems: '=',
        profile: '='
      },
      bindToController: true,
      controllerAs: 'vm',
      controller: 'PlaylistToolbarController'
    };
  })
  .controller('PlaylistToolbarController', function PlaylistToolbarController($uibModal, $log, tracksCache, tracksComparer, tracksReplacement, choosePlaylist, playlistsMerge, alerts) {
    const vm = this;
    vm.findPlaylistDuplicates = findPlaylistDuplicates;
    vm.findReplacements = findReplacements;
    vm.comparePlaylists = comparePlaylists;
    vm.mergePlaylists = mergePlaylists;

    const playlist = vm.playlist;
    const trackItems = vm.trackItems;
    const profile = vm.profile;

    // find duplicates button logic
    function findPlaylistDuplicates() {
      let result = tracksComparer.compare(trackItems);
      $log.debug('duplicates', result);

      if (!result.ids.length && !result.titles.length) {
        $log.debug('No duplicates found.');
        alerts.info('No duplicates found.');
        return;
      }

      displayComparisonResult(playlist, trackItems, result);
    }

    // Find replacements logic
    function findReplacements() {
      return tracksReplacement.replace(playlist, profile).then(onReplacementFinished, onReplacementCanceled);

      function onReplacementFinished(numberOfReplaced) {
        $log.debug('tracks replaced: ', numberOfReplaced);
        if (numberOfReplaced) {
          // vm.refreshTracks(vm.playlist).then(() => alerts.info('Tracks have been refreshed.'));
        }
      }

      function onReplacementCanceled() {
        $log.debug('canceled');
      }
    }

    // Compare playlists logic
    function comparePlaylists() {
      return choosePlaylist.show(playlist, profile).then(onPlaylistChosen, onPlaylistChooseCanceled);

      function onPlaylistChosen(selectedPlaylist) {
        let currentTracks = vm.trackItems;
        tracksCache.get(selectedPlaylist, 0).then(trackItems => {
          let tracksToCompare = trackItems;
          let result = tracksComparer.compare(currentTracks, tracksToCompare);
          $log.debug('duplicates', result);

          if (!result.ids.length && !result.titles.length) {
            $log.debug('No duplicates found.');
            alerts.info('No duplicates found.');
            return;
          }

          displayComparisonResult(playlist, vm.trackItems, result);
        });
      }

      function onPlaylistChooseCanceled() {
        $log.debug('Choose playlist canceled.');
      }
    }

    // Merge playlists logic
    function mergePlaylists() {
      choosePlaylist.show(playlist, profile).then(selectedPlaylist => {
        playlistsMerge.merge(playlist, selectedPlaylist).then(() => {
          $log.debug('Playlists have been merged successfully.');
          alerts.info('Playlists have been merged successfully.');
        });
      });
    }

    // Duplicates result
    function displayComparisonResult(playlist, trackItems, result) {
      $uibModal.open({
        templateUrl: '/views/modals/playlist-duplicates.html',
        resolve: {
          duplicates: () => result,
          playlist: () => playlist,
          trackItems: () => trackItems
        },
        controller: 'FindDuplicatesModalController',
        controllerAs: 'vm'
      });
    }
  })
  .controller('FindDuplicatesModalController', function FindDuplicatesModalController($scope, $uibModalInstance,
    duplicates, playlist, trackItems/* , SpotifyPlaylist */) {
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
