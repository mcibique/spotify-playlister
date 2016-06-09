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
        profile: '=',
        refreshTracks: '&'
      },
      bindToController: true,
      controllerAs: 'vm',
      controller: 'PlaylistToolbarController'
    };
  })
  .controller('PlaylistToolbarController', function PlaylistToolbarController($uibModal, $log, tracksCache, tracksComparer, tracksReplacement, choosePlaylist, playlistsMerge, alerts, playlistDuplicates) {
    const vm = this;
    vm.findPlaylistDuplicates = findPlaylistDuplicates;
    vm.findReplacements = findReplacements;
    vm.comparePlaylists = comparePlaylists;
    vm.mergePlaylists = mergePlaylists;

    const playlist = vm.playlist;
    const profile = vm.profile;

    // find duplicates button logic
    function findPlaylistDuplicates() {
      const trackItems = vm.trackItems;
      const result = tracksComparer.compare(trackItems);
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
          vm.refreshTracks(vm.playlist).then(() => alerts.info('Tracks have been refreshed.'));
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
        const currentTracks = vm.trackItems;
        const startingOffset = 0;
        tracksCache.get(selectedPlaylist, startingOffset).then(trackItems => {
          const tracksToCompare = trackItems;
          const result = tracksComparer.compare(currentTracks, tracksToCompare);
          $log.debug('duplicates', result);

          if (!result.ids.length && !result.titles.length) {
            $log.debug('No duplicates found.');
            alerts.info('No duplicates found.');
            return;
          }

          displayComparisonResult(playlist, currentTracks, result);
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
      playlistDuplicates.show(playlist, trackItems, result);
    }
  });
