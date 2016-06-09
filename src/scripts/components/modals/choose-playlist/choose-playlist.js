angular
  .module('playlister.components.modals.choose-playlist', [])
  .factory('choosePlaylist', function choosePlaylist($uibModal, $q, playlistService) {
    function show(currentPlaylist, profile) {
      return $q(function showPromise(resolve, reject) {
        playlistService.getPlaylists(profile.id, { limit: 50 })
          .then(response => response.data)
          .then(onPlaylistsLoaded);

        function onPlaylistsLoaded(playlists) {
          if (playlists.items && playlists.items.length <= 1) {
            reject();
            return;
          }
          const modalInstance = $uibModal.open({
            templateUrl: '/scripts/components/modals/choose-playlist/choose-playlist.html',
            resolve: {
              playlists: () => playlists.items,
              currentPlaylist: () => currentPlaylist
            },
            controller: 'ChoosePlaylistModalController',
            controllerAs: 'vm'
          });

          modalInstance.result.then(resolve, reject);
        }
      });
    }

    return { show };
  })
  .controller('ChoosePlaylistModalController', function ChoosePlaylistModalController($uibModalInstance, playlists, currentPlaylist) {
    const vm = this;
    vm.playlists = playlists;
    vm.currentPlaylist = currentPlaylist;
    vm.selectedPlaylist = null;

    if (currentPlaylist) {
      vm.playlists = playlists.filter(playlist => playlist.id !== currentPlaylist.id);
    }

    vm.close = function close() {
      $uibModalInstance.dismiss();
    };

    vm.select = function select(playlist) {
      if (!playlist) {
        return;
      }
      if (currentPlaylist && playlist.id === currentPlaylist.id) {
        return;
      }
      $uibModalInstance.close(playlist);
    };
  });
