'use strict';

angular
  .module('playlister.spotify.playlists-merge', [])
  .factory('playlistsMerge', ($q, $modal, tracksCache) => {
    function merge(fromPlaylist, toPlaylist) {
      const defer = $q.defer();
      const fields = 'items(added_at,track(name,id,uri,album(name,id),artists(id,name)))';

      $modal.open({
        templateUrl: '/views/modals/merge.html',
        resolve: {
          fromTracks() {
            return tracksCache.get(fromPlaylist, 0, fields);
          },
          toTracks() {
            return tracksCache.get(toPlaylist, 0, fields);
          }
        },
        controller: function MergePlaylistsModalController($scope, $modalInstance, $log, fromTracks, toTracks,
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
          function filterTracks(tracks, days) {
            let fromDate = new Date();
            fromDate.setDate(fromDate.getDate() - days);
            return tracks.filter((item) => {
              return new Date(item.added_at) >= fromDate;
            });
          }

          $scope.filteredFromTracks = filterTracks(fromTracks, $scope.lastXDays);

          $scope.$watch((scope) => {
            return scope.lastXDays;
          }, (newValue, oldValue) => {
            if (newValue !== oldValue && !isNaN(newValue) && newValue >= 0) {
              $scope.filteredFromTracks = filterTracks(fromTracks, newValue);
            }
          });

          // compare
          // $scope.commonTracks = [];

          // tracksComparer.compare(fromTracks, toTracks).then(function (commonTracks) {
          //   $scope.commonTracks = commonTracks.ids;
          //   $scope.commonTracks.forEach(function (track) {
          //     track.isCommon = true;
          //   });
          // });
          let compareResult = tracksComparer.compare(fromTracks, toTracks);
          compareResult.ids.forEach((result) => {
            result.a.isCommon = true;
          });

          compareResult.titles.forEach((result) => {
            result.a.isCommon = true;
          });

          $scope.getUniqueTracks = function (tracks) {
            return tracks.filter((item) => {
              return !item.track.isCommon || item.userOverride;
            });
          };

          $scope.getDuplicateTracks = function (tracks) {
            return tracks.filter((item) => {
              return item.track.isCommon && !item.userOverride;
            });
          };

          $scope.addSelectedToPlaylist = function () {
            let selected = $scope.filteredFromTracks.filter((item) => {
              return item.selected;
            }).map((item) => {
              return item.track.uri;
            });

            if (selected.length) {
              SpotifyPlaylist.addTracks({
                userId: toPlaylist.owner.id,
                playlistId: toPlaylist.id
              }, {
                uris: selected
              }, () => {
                $log.debug('success');
                $scope.ok();
              });
            }
          };
        }
      });

      return defer.promise;
    }

    return { merge };
  });
