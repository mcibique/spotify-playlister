'use strict';

angular
  .module('playlister.spotify.replacements', ['ui.slider', 'playlister.spotify.api'])
  .factory('tracksReplacement', function tracksReplacement($uibModal) {
    function replace(playlist, profile) {
      let fields = 'items(added_at,is_local,track(name,id,uri,duration_ms,album(name,id),artists(id,name)))';

      const modalInstance = $uibModal.open({
        templateUrl: '/views/modals/replace.html',
        size: 'lg',
        resolve: {
          trackItems: tracksCache => tracksCache.get(playlist, 0, fields),
          playlist: () => playlist,
          profile: () => profile
        },
        controller: 'TracksReplacementModalController',
        controllerAs: 'vm'
      });

      return modalInstance.result;
    }

    return { replace };
  })
  .controller('TracksReplacementModalController', function TracksReplacementModalController($scope, $uibModalInstance, $filter, trackItems, playlist, profile, searchService, playlistService) {
    const vm = this;

    // resolves
    vm.trackItems = trackItems.slice().sort(tracksSorting);
    vm.playlist = playlist;
    vm.profile = profile;

    // currentIndex
    vm.currentIndex = 0;
    vm.currentTrackItem = vm.trackItems[vm.currentIndex];

    $scope.$watch(() => vm.currentIndex, (newValue, oldValue) => {
      if (newValue === oldValue) {
        return;
      }
      let trackItem = vm.trackItems[newValue];
      if (trackItem) {
        vm.currentTrackItem = trackItem;
        vm.searchString = vm.currentTrackItem.searchString || getSearchString(vm.currentTrackItem);
      }
    });

    // availability
    vm.isAvailableForMarket = isAvailableForMarket.bind(vm, vm.profile);

    // duration diffs
    vm.getDurationDiff = getDurationDiff;
    vm.getDurationDiffClass = getDurationDiffClass;

    // possible replacements
    vm.possibleReplacements = [];

    let slidingInProgress = false;
    let slidingState = 0;

    vm.searchString = getSearchString(vm.currentTrackItem);
    $scope.$watch(() => vm.searchString, (newValue, oldValue) => {
      if (newValue === oldValue || !newValue) {
        return;
      }
      doSearch(newValue);
    });

    doSearch(vm.searchString);

    // slider
    vm.sliderOptions = {
      start() {
        saveCurrentTrackItem();
        slidingState = vm.currentIndex;
        slidingInProgress = true;
      },
      stop() {
        slidingInProgress = false;

        if (slidingState !== vm.currentIndex) {
          doSearch(vm.searchString);
        }
      }
    };

    // buttons
    vm.save = function () {
      saveCurrentTrackItem();
      let items = vm.trackItems;
      let selectedItems = items.filter(item => item.replacement && item.replacement.length);
      if (!selectedItems.length) {
        return;
      }

      let toDelete = [];
      let toAdd = [];

      selectedItems.forEach(selectedItem => {
        if (!selectedItem.keep) {
          toDelete.push(selectedItem.track.uri);
        }
        toAdd = toAdd.concat(selectedItem.replacement.map(replacement => replacement.uri));
      });

      if (toAdd.length) {
        playlistService
          .addTracks(playlist.owner.id, playlist.id, { uris: toAdd })
          .then(() => $uibModalInstance.close(toAdd.length));
      }
      // TODO: toDelete
    };

    vm.next = function () {
      if (vm.currentIndex < vm.trackItems.length - 1) {
        saveCurrentTrackItem();
        vm.currentIndex++;
      }
    };

    vm.previous = function () {
      if (vm.currentIndex > 0) {
        saveCurrentTrackItem();
        vm.currentIndex--;
      }
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss();
    };

    function getSearchString(trackItem) {
      let track = trackItem.track;
      let result = $filter('artists')(trackItem.track.artists);

      if (result) {
        result += ' - ';
      }
      result += track.name;
      return result;
    }

    function doSearch(searchString) {
      if (slidingInProgress) {
        return;
      }
      if (searchString) {
        searchService.tracks(searchString).then(response => {
          vm.possibleReplacements = response.data.tracks.items;

          for (let i = 0, len = vm.possibleReplacements.length; i < len; i++) {
            let replacement = vm.possibleReplacements[i];
            let available = !vm.isAvailableForMarket(replacement);
            if (available) {
              replacement.selected = true;
              break;
            }
          }
        });
      } else {
        vm.possibleReplacements = [];
      }
    }

    function getDurationDiff(trackA, trackB) {
      return ((trackA.duration_ms - trackB.duration_ms) / 1000).toFixed(1);
    }

    function getDurationDiffClass(diff) {
      const abs = Math.round(Math.abs(diff));
      if (abs === 0) {
        return 'diff-exact';
      } else if (abs < 5) {
        return 'diff-very-similiar';
      } else if (abs < 30) {
        return 'diff-similiar';
      } else {
        return 'diff';
      }
    }

    function saveCurrentTrackItem() {
      let selected = vm.possibleReplacements.filter(replacement => replacement.selected);
      if (selected.length) {
        vm.currentTrackItem.replacement = selected;
      } else {
        vm.currentTrackItem.replacement = null;
      }

      vm.currentTrackItem.searchString = vm.searchString;
    }

    function isAvailableForMarket(profile, track) {
      if (track.available_markets && track.available_markets.indexOf(profile.country) >= 0) {
        return '';
      }
      return 'N/A';
    }

    function tracksSorting(t1, t2) {
      if (t1.is_local && t2.is_local) {
        return 0;
      }
      if (t1.is_local && !t2.is_local) {
        return -1;
      }
      return 1;
    }
  });
