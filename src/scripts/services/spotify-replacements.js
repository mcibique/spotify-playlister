'use strict';

angular
  .module('playlister.spotify.replacements', ['ui.slider', 'playlister.spotify.resources'])
  .factory('tracksReplacement', ($q, $modal, tracksCache) => {
    function replace(playlist, profile) {
      const defer = $q.defer();
      let fields = 'items(added_at,is_local,track(name,id,uri,duration_ms,album(name,id),artists(id,name)))';

      const modal = $modal.open({
        templateUrl: '/views/modals/replace.html',
        size: 'lg',
        resolve: {
          trackItems() {
            return tracksCache.get(playlist, 0, fields);
          },
          playlist() {
            return playlist;
          },
          profile() {
            return profile;
          }
        },
        controller: 'TracksReplacementModalController'
      });

      modal.result.then((result) => {
        defer.resolve(result);
      }, (reason) => {
        defer.reject(reason);
      });

      return defer.promise;
    }

    return { replace };
  })
  .controller('TracksReplacementModalController', ($scope, $modalInstance, $filter, trackItems, playlist, profile,
    SpotifySearch, SpotifyPlaylist) => {
    $scope.trackItems = trackItems.slice().sort((t1, t2) => {
      if (t1.is_local && t2.is_local) {
        return 0;
      }
      if (t1.is_local && !t2.is_local) {
        return -1;
      }

      return 1;
    });
    $scope.playlist = playlist;
    $scope.profile = profile;

    $scope.currentIndex = 0;
    $scope.currentTrackItem = $scope.trackItems[$scope.currentIndex];

    $scope.possibleReplacements = [];

    $scope.isAvailableForMarket = function (track) {
      if (track.available_markets && track.available_markets.indexOf($scope.profile.country) >= 0) {
        return '';
      }

      return 'N/A';
    };

    let slidingInProgress = false;
    let slidingState = 0;

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
        SpotifySearch.tracks({
          q: searchString
        }, (response) => {
          $scope.possibleReplacements = response.tracks.items;

          for (let i = 0, len = $scope.possibleReplacements.length; i < len; i++) {
            let replacement = $scope.possibleReplacements[i];
            let available = !$scope.isAvailableForMarket(replacement);
            if (available) {
              replacement.selected = true;
              break;
            }
          }
        });
      } else {
        $scope.possibleReplacements = [];
      }
    }

    $scope.searchString = getSearchString($scope.currentTrackItem);
    doSearch($scope.searchString);

    $scope.$watch((scope) => {
      return scope.searchString;
    }, (newValue, oldValue) => {
      if (newValue === oldValue || !newValue) {
        return;
      }

      doSearch(newValue);
    });

    $scope.getDurationDiff = function (trackA, trackB) {
      return ((trackA.duration_ms - trackB.duration_ms) / 1000).toFixed(1);
    };

    $scope.getDurationDiffClass = function (diff) {
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
    };

    function saveCurrentTrackItem() {
      let selected = $scope.possibleReplacements.filter((replacement) => {
        return replacement.selected;
      });
      if (selected.length) {
        $scope.currentTrackItem.replacement = selected;
      } else {
        $scope.currentTrackItem.replacement = null;
      }

      $scope.currentTrackItem.searchString = $scope.searchString;
    }

    $scope.sliderOptions = {
      start() {
        saveCurrentTrackItem();
        slidingState = $scope.currentIndex;
        slidingInProgress = true;
      },
      stop() {
        slidingInProgress = false;

        if (slidingState !== $scope.currentIndex) {
          doSearch($scope.searchString);
        }
      }
    };

    $scope.$watch((scope) => {
      return scope.currentIndex;
    }, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        let trackItem = $scope.trackItems[newValue];
        if (trackItem) {
          $scope.currentTrackItem = trackItem;
          $scope.searchString = $scope.currentTrackItem.searchString || getSearchString($scope.currentTrackItem);
        }
      }
    });

    // buttons
    $scope.save = function () {
      saveCurrentTrackItem();
      let items = $scope.trackItems;
      let selectedItems = items.filter((item) => {
        return item.replacement && item.replacement.length;
      });

      if (!selectedItems.length) {
        return;
      }

      let toDelete = [];
      let toAdd = [];

      selectedItems.forEach((selectedItem) => {
        if (!selectedItem.keep) {
          toDelete.push(selectedItem.track.uri);
        }
        toAdd = toAdd.concat(selectedItem.replacement.map((replacement) => {
          return replacement.uri;
        }));
      });

      if (toAdd.length) {
        SpotifyPlaylist.addTracks({
          userId: playlist.owner.id,
          playlistId: playlist.id
        }, {
          uris: toAdd
        }, () => {
          $modalInstance.close(toAdd.length);
        });
      }
      // TODO: toDelete
    };

    $scope.next = function () {
      if ($scope.currentIndex < $scope.trackItems.length - 1) {
        saveCurrentTrackItem();
        $scope.currentIndex++;
      }
    };

    $scope.previous = function () {
      if ($scope.currentIndex > 0) {
        saveCurrentTrackItem();
        $scope.currentIndex--;
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss(0);
    };
  });
