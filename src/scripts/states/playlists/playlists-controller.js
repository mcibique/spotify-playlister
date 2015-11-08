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
    tracksComparer, tracksReplacement, choosePlaylist, playlistsMerge, alerts) {
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

      return tracksCache.get(playlist, 0).then((result) => {
        vm.trackItems = result;
        vm.loadingProgress = null;
        return result;
      }, (error) => {
        vm.loadingProgress = null;
        return error;
      }, (items) => {
        if (notificationsCount === 0 || !vm.trackItems) {
          vm.trackItems = [];
        }

        notificationsCount++;
        vm.trackItems = vm.trackItems.concat(items);
        vm.loadingProgress.current = vm.trackItems.length;
        $scope.$broadcast('updateScrollbar');
        return items;
      });
    }

    loadItems(playlist);

    function refreshTracks(playlist) {
      tracksCache.refresh(playlist);
      return loadItems(playlist);
    }

    // find duplicates button logic
    function findPlaylistDuplicates() {
      let trackItems = vm.trackItems;
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
      tracksReplacement.replace(vm.playlist, profile).then((numberOfReplaced) => {
        $log.debug('tracks replaced: ', numberOfReplaced);
        if (numberOfReplaced) {
          vm.refreshTracks(vm.playlist).then(() => {
            alerts.info('Tracks has been replaced.');
          });
        }
      }, () => {
        $log.debug('canceled');
      });
    }

    // Compare playlists logic
    function comparePlaylists() {
      choosePlaylist.show(playlist, profile).then((selectedPlaylist) => {
        let currentTracks = vm.trackItems;
        tracksCache.get(selectedPlaylist, 0).then((trackItems) => {
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
      }, () => {
        $log.debug('Choose playlist canceled.');
      });
    }

    // Merge playlists logic
    function mergePlaylists() {
      choosePlaylist.show(playlist, profile).then((selectedPlaylist) => {
        playlistsMerge.merge(playlist, selectedPlaylist).then(() => {
          $log.debug('Playlists has been merged successfully.');
          alerts.info('Playlists has been merged successfully.');
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
        controller: 'FindCuplicatesModalController',
        controllerAs: 'vm'
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
