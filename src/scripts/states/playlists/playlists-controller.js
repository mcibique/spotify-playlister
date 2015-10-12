'use strict';

angular
  .module('playlister.states.playlists.controllers', ['playlister.filters', 'playlister.spotify.resources'])
  .controller('PlaylistsController', ($scope, profile, SpotifyPlaylist) => {
    $scope.profile = profile;
    $scope.selected = [];
    $scope.duplicates = {};
    $scope.playlists = SpotifyPlaylist.get({
      userId: profile.id,
      limit: 50
    }, () => {
      $scope.$broadcast('updateScrollbar');
    });
  })
  .controller('PlaylistController', ($scope, $modal, $log, profile, playlist, tracksCache, tracksComparer,
    tracksReplacement, choosePlaylist, playlistsMerge) => {
    $scope.playlist = playlist;

    function loadItems(playlist) {
      $scope.loadingProgress = {
        current: 0,
        total: playlist.tracks.total
      };

      let notificationsCount = 0;

      tracksCache.get(playlist, 0).then((result) => {
        $scope.trackItems = result;
        $scope.loadingProgress = null;
      }, () => {
        $scope.loadingProgress = null;
      }, (items) => {
        if (notificationsCount === 0 || !$scope.trackItems) {
          $scope.trackItems = [];
        }

        notificationsCount++;
        $scope.trackItems = $scope.trackItems.concat(items);
        $scope.loadingProgress.current = $scope.trackItems.length;
        $scope.$broadcast('updateScrollbar');
      });
    }

    loadItems(playlist);

    $scope.refreshTracks = function (playlist) {
      tracksCache.refresh(playlist);
      loadItems(playlist);
    };

    // find duplicates button logic
    $scope.findPlaylistDuplicates = function () {
      let trackItems = $scope.trackItems;
      let result = tracksComparer.compare(trackItems);
      $log.debug('duplicates', result);

      if (!result.ids.length && !result.titles.length) {
        $log.debug('No duplicates found.');
        return;
      }

      displayComparisonResult(playlist, trackItems, result);
    };

    // Find replacements logic
    $scope.findReplacements = function () {
      tracksReplacement.replace($scope.playlist, profile).then((numberOfReplaced) => {
        $log.debug('tracks replaced: ', numberOfReplaced);
        if (numberOfReplaced) {
          $scope.refreshTracks($scope.playlist);
        }
      }, () => {
        $log.debug('canceled');
      });
    };

    // Compare playlists logic
    $scope.comparePlaylists = function () {
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
    };

    // Merge playlists logic
    $scope.mergePlaylists = function () {
      choosePlaylist.show(playlist, profile).then((selectedPlaylist) => {
        playlistsMerge.merge(playlist, selectedPlaylist).then(() => {
          $log.debug('playlists merged');
        });
      });
    };

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
        controller: function FindCuplicatesModalController($scope, $modalInstance, duplicates, playlist, trackItems
          /* , SpotifyPlaylist */) {
          $scope.duplicates = duplicates;
          $scope.playlist = playlist;
          $scope.trackItems = trackItems;

          $scope.close = function () {
            $modalInstance.dismiss('ok');
          };

          $scope.removeDuplicate = function (/* duplicate */) {
            // TODO  http delete doesn't support params in angular
            // var item = duplicate.b.item;
            // SpotifyPlaylist.removeTracks({
            //   userId: playlist.owner.id,
            //   playlistId: playlist.id
            // }, {
            //   tracks: [{
            //     uri: item.track.uri
            //   }]
            // }, function (response) {
            //   $log.debug('response', response);
            // });
          };
        }
      });
    }
  });
