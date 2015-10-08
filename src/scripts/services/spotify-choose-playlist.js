(function (ng) {
  'use strict';

  ng.module('playlister.spotify.choose-playlist', [])
    .factory('choosePlaylist', function ($modal, $q, SpotifyPlaylist) {
      var show = function (currentPlaylist, profile) {
        var defer = $q.defer();
        SpotifyPlaylist.get({
          userId: profile.id,
          limit: 50
        }, function (playlists) {
          if (playlists.items && playlists.items.length <= 1) {
            defer.reject();
            return;
          }
          $modal.open({
            templateUrl: '/views/modals/choose-playlist.html',
            resolve: {
              playlists: function () {
                return playlists.items;
              },
              currentPlaylist: function () {
                return currentPlaylist;
              }
            },
            controller: function ChoosePlaylistModalController ($scope, $modalInstance, playlists, currentPlaylist) {
              $scope.playlists = playlists;
              $scope.currentPlaylist = currentPlaylist;
              $scope.selectedPlaylist = null;

              if (currentPlaylist) {
                $scope.playlists = playlists.filter(function (playlist) {
                  return playlist.id !== currentPlaylist.id;
                });
              }

              $scope.close = function () {
                $modalInstance.dismiss('ok');
                defer.reject();
              };

              $scope.select = function (playlist) {
                if (playlist) {
                  if (currentPlaylist && playlist.id === currentPlaylist.id) {
                    return;
                  }
                  $modalInstance.dismiss();
                  defer.resolve(playlist);
                }
              };
            }
          });
        });

        return defer.promise;
      };

      return {
        show: show
      };
    });

})(angular);
