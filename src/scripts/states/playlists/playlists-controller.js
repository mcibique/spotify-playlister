(function (ng, $) {
  'use strict';

  ng.module('playlister.states.playlists.controllers', ['playlister.filters', 'playlister.spotify.resources'])
    .controller('PlaylistsController', function ($scope, $log, $filter, profile, SpotifyPlaylist, duplicatesFinder,
      playlistComparer, playlistMerge) {
      $scope.profile = profile;
      $scope.selected = [];
      $scope.duplicates = {};
      $scope.playlists = SpotifyPlaylist.get({
        userId: profile.id,
        limit: 50
      });

      $scope.selectPlaylist = function (selected, playlist) {
        var index = selected.indexOf(playlist);
        if (index === -1) {
          selected.push(playlist);
        } else {
          selected.splice(index, 1);
        }
      };

      $scope.findPlaylistDuplicates = function (selected) {
        $scope.duplicates = {};
        if (!selected.length || selected.length !== 1) {
          return;
        }

        duplicatesFinder.find(selected[0]).then(function (duplicates) {
          $log.debug('duplicates found: ', duplicates);
          $scope.duplicates = duplicates;
        });
      };

      $scope.comparePlaylists = function (selected) {
        $scope.commonTracks = [];
        if (!selected.length || selected.length !== 2) {
          return;
        }

        playlistComparer.compare(selected[0], selected[1]).then(function (commonTracks) {
          $log.debug('common tracks: ', commonTracks);
          $scope.commonTracks = commonTracks.ids.map(function (track) {
            return $filter('track')(track);
          });
          $scope.commonTracks.sort();
          $scope.similarTracks = commonTracks.titles.map(function (track) {
            return $filter('track')(track.a) + ' vs. ' + $filter('track')(track.b);
          });
          $scope.similarTracks.sort();
        });
      };

      $scope.mergePlaylists = function (selected) {
        if (!selected.length || selected.length !== 2) {
          return;
        }

        playlistMerge.merge(selected[0], selected[1]).then(function () {
          $log.debug('playlists merged');
        });
      };
    })
    .controller('PlaylistController', function ($scope, $timeout, playlist, tracksCache) {
      $scope.playlist = playlist;

      var loadItems = function (playlist) {
        $scope.loadingProgress = {
          current: 0,
          total: playlist.tracks.total
        };

        var notificationsCount = 0;

        tracksCache.get(playlist, 0).then(function (result) {
          $scope.trackItems = result;
          $scope.loadingProgress = null;
        }, function () {
          $scope.loadingProgress = null;
        }, function (items) {
          if (notificationsCount === 0 || !$scope.trackItems) {
            $scope.trackItems = [];
          }

          notificationsCount++;
          $scope.trackItems = $scope.trackItems.concat(items);
          $scope.loadingProgress.current = $scope.trackItems.length;
        });
      };

      loadItems(playlist);

      $scope.refreshTracks = function (playlist) {
        tracksCache.refresh(playlist);
        loadItems(playlist);
      };
    });

})(angular, jQuery);