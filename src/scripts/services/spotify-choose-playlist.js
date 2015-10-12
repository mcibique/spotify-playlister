'use strict';

angular
  .module('playlister.spotify.choose-playlist', [])
  .factory('choosePlaylist', ($modal, $q, SpotifyPlaylist) => {
    function show(currentPlaylist, profile) {
      const defer = $q.defer();
      SpotifyPlaylist.get({
        userId: profile.id,
        limit: 50
      }, (playlists) => {
        if (playlists.items && playlists.items.length <= 1) {
          defer.reject();
          return;
        }
        $modal.open({
          templateUrl: '/views/modals/choose-playlist.html',
          resolve: {
            playlists() {
              return playlists.items;
            },
            currentPlaylist() {
              return currentPlaylist;
            }
          },
          controller: function ChoosePlaylistModalController($scope, $modalInstance, playlists, currentPlaylist) {
            $scope.playlists = playlists;
            $scope.currentPlaylist = currentPlaylist;
            $scope.selectedPlaylist = null;

            if (currentPlaylist) {
              $scope.playlists = playlists.filter((playlist) => {
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
    }

    return { show };
  });
