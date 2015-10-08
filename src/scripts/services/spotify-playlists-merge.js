(function (ng) {
  'use strict';

  ng.module('playlister.spotify.playlists-merge', [])
    .factory('playlistsMerge', function ($q, $modal, tracksCache) {
      var merge = function (fromPlaylist, toPlaylist) {
        var defer = $q.defer();
        var fields = 'items(added_at,track(name,id,uri,album(name,id),artists(id,name)))';

        $modal.open({
          templateUrl: '/views/modals/merge.html',
          resolve: {
            fromTracks: function () {
              return tracksCache.get(fromPlaylist, 0, fields);
            },
            toTracks: function () {
              return tracksCache.get(toPlaylist, 0, fields);
            }
          },
          controller: function MergePlaylistsModalController ($scope, $modalInstance, $log, fromTracks, toTracks,
            tracksComparer, SpotifyPlaylist) {
            $scope.fromPlaylist = fromPlaylist;
            $scope.fromTracks = fromTracks;
            $scope.filteredFromTracks = fromTracks;
            $scope.toPlaylist = toPlaylist;
            $scope.toTracks = toTracks;
            $scope.lastXDays = 7;
            $scope.ok = function () {
              $modalInstance.dismiss('ok');
              defer.resolve();
            };
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
              defer.resolve();
            };

            // filtering
            var filterTracks = function (tracks, days) {
              var fromDate = new Date();
              fromDate.setDate(fromDate.getDate() - days);
              return tracks.filter(function (item) {
                return new Date(item.added_at) >= fromDate;
              });
            };

            $scope.filteredFromTracks = filterTracks(fromTracks, $scope.lastXDays);

            $scope.$watch(function (scope) {
              return scope.lastXDays;
            }, function (newValue, oldValue) {
              if (newValue !== oldValue && !isNaN(newValue) && newValue >= 0) {
                $scope.filteredFromTracks = filterTracks(fromTracks, newValue);
              }
            });

            // compare
            // $scope.commonTracks = [];

            /*tracksComparer.compare(fromTracks, toTracks).then(function (commonTracks) {
              $scope.commonTracks = commonTracks.ids;
              $scope.commonTracks.forEach(function (track) {
                track.isCommon = true;
              });
            });*/
            var compareResult = tracksComparer.compare(fromTracks, toTracks);
            compareResult.ids.forEach(function (result) {
              result.a.isCommon = true;
            });

            compareResult.titles.forEach(function (result) {
              result.a.isCommon = true;
            });

            $scope.getUniqueTracks = function (tracks) {
              return tracks.filter(function (item) {
                return !item.track.isCommon || item.userOverride;
              });
            };

            $scope.getDuplicateTracks = function (tracks) {
              return tracks.filter(function (item) {
                return item.track.isCommon && !item.userOverride;
              });
            };

            $scope.addSelectedToPlaylist = function () {
              var selected = $scope.filteredFromTracks.filter(function (item) {
                return item.selected;
              }).map(function (item) {
                return item.track.uri;
              });

              if (selected.length) {
                SpotifyPlaylist.addTracks({
                  userId: toPlaylist.owner.id,
                  playlistId: toPlaylist.id
                }, {
                  uris: selected
                }, function (/*response*/) {
                  $log.debug('success');
                  $scope.ok();
                });
              }
            };
          }
        });

        return defer.promise;
      };

      return {
        merge: merge
      };
    });

})(angular);
