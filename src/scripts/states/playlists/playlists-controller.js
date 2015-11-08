'use strict';

angular
  .module('playlister.states.playlists.controllers', ['playlister.filters', 'playlister.spotify.resources'])
  .controller('PlaylistsController', function PlaylistsController($scope, profile, SpotifyPlaylist) {
    const vm = this;
    vm.profile = profile;
    vm.selected = [];
    vm.duplicates = {};
    vm.playlists = SpotifyPlaylist.get({
      userId: profile.id,
      limit: 50
    }, () => {
      $scope.$broadcast('updateScrollbar');
    });
  })
  .controller('PlaylistController', function PlaylistController($scope, $modal, $log, profile, playlist, tracksCache,
    tracksComparer, tracksReplacement, choosePlaylist, playlistsMerge) {
    const vm = this;
    vm.playlist = playlist;
    vm.refreshTracks = refreshTracks;
    vm.findPlaylistDuplicates = findPlaylistDuplicates;
    vm.findReplacements = findReplacements;
    vm.comparePlaylists = comparePlaylists;
    vm.mergePlaylists = mergePlaylists;

    function loadItems(playlist) {
      vm.loadingProgress = {
        current: 0,
        total: playlist.tracks.total
      };

      let notificationsCount = 0;

      tracksCache.get(playlist, 0).then((result) => {
        vm.trackItems = result;
        vm.loadingProgress = null;
      }, () => {
        vm.loadingProgress = null;
      }, (items) => {
        if (notificationsCount === 0 || !$scope.trackItems) {
          vm.trackItems = [];
        }

        notificationsCount++;
        vm.trackItems = $scope.trackItems.concat(items);
        $scope.loadingProgress.current = $scope.trackItems.length;
        $scope.$broadcast('updateScrollbar');
      });
    }

    loadItems(playlist);

    function refreshTracks(playlist) {
      tracksCache.refresh(playlist);
      loadItems(playlist);
    }

    // find duplicates button logic
    function findPlaylistDuplicates() {
      let trackItems = $scope.trackItems;
      let result = tracksComparer.compare(trackItems);
      $log.debug('duplicates', result);

      if (!result.ids.length && !result.titles.length) {
        $log.debug('No duplicates found.');
        return;
      }

      displayComparisonResult(playlist, trackItems, result);
    }

    // Find replacements logic
    function findReplacements() {
      tracksReplacement.replace($scope.playlist, profile).then((numberOfReplaced) => {
        $log.debug('tracks replaced: ', numberOfReplaced);
        if (numberOfReplaced) {
          vm.refreshTracks($scope.playlist);
        }
      }, () => {
        $log.debug('canceled');
      });
    }

    // Compare playlists logic
    function comparePlaylists() {
      choosePlaylist.show(playlist, profile).then((selectedPlaylist) => {
        let currentTracks = $scope.trackItems;
        tracksCache.get(selectedPlaylist, 0).then((trackItems) => {
          let tracksToCompare = trackItems;
          let result = tracksComparer.compare(currentTracks, tracksToCompare);
          $log.debug('duplicates', result);

          if (!result.ids.length && !result.titles.length) {
            $log.debug('No duplicates found.');
            return;
          }

          displayComparisonResult(playlist, $scope.trackItems, result);
        });
      }, () => {
        $log.debug('Choose playlist canceled.');
      });
    }

    // Merge playlists logic
    function mergePlaylists() {
      choosePlaylist.show(playlist, profile).then((selectedPlaylist) => {
        playlistsMerge.merge(playlist, selectedPlaylist).then(() => {
          $log.debug('playlists merged');
        });
      });
    }

    // Duplicates result
    function displayComparisonResult(playlist, trackItems, result) {
      $modal.open({
        templateUrl: '/views/modals/playlist-duplicates.html',
        resolve: {
          duplicates() {
            return result;
          },
          playlist() {
            return playlist;
          },
          trackItems() {
            return trackItems;
          }
        },
        controller: 'FindCuplicatesModalController'
      });
    }
  })
  .controller('FindCuplicatesModalController', function FindCuplicatesModalController($scope, $modalInstance,
    duplicates, playlist, trackItems/* , SpotifyPlaylist */) {
    const vm = this;
    vm.duplicates = duplicates;
    vm.playlist = playlist;
    vm.trackItems = trackItems;
    vm.close = close;
    // vm.removeDuplicate = removeDuplicate;

    function close() {
      $modalInstance.dismiss('ok');
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
