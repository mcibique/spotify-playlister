'use strict';

angular
  .module('playlister.spotify.replacements', ['ui.slider', 'playlister.spotify.resources'])
  .factory('tracksReplacement', function ($q, $modal, tracksCache) {
    var replace = function (playlist, profile) {
      var defer = $q.defer();
      var fields = 'items(added_at,is_local,track(name,id,uri,duration_ms,album(name,id),artists(id,name)))';

      var modal = $modal.open({
        templateUrl: '/views/modals/replace.html',
        size: 'lg',
        resolve: {
          trackItems: function () {
            return tracksCache.get(playlist, 0, fields);
          },
          playlist: function () {
            return playlist;
          },
          profile: function () {
            return profile;
          }
        },
        controller: 'TracksReplacementModalController'
      });

      modal.result.then(function (result) {
        defer.resolve(result);
      }, function (reason) {
        defer.reject(reason);
      });

      return defer.promise;
    };

    return {
      replace: replace
    };
  })
  .controller('TracksReplacementModalController', function ($scope, $modalInstance, $filter, trackItems, playlist,
    profile, SpotifySearch, SpotifyPlaylist) {
    $scope.trackItems = trackItems.slice().sort(function (t1, t2) {
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

    var getSearchString = function (trackItem) {
      var track = trackItem.track;
      var result = $filter('artists')(trackItem.track.artists);

      if (result) {
        result += ' - ';
      }
      result += track.name;
      return result;
    };

    var doSearch = function (searchString) {
      if (slidingInProgress) {
        return;
      }
      if (searchString) {
        SpotifySearch.tracks({
          q: searchString
        }, function (response) {
          console.log('response', response);
          $scope.possibleReplacements = response.tracks.items;

          for (var i = 0, len = $scope.possibleReplacements.length; i < len; i++) {
            var replacement = $scope.possibleReplacements[i];
            var available = !$scope.isAvailableForMarket(replacement);
            if (available) {
              replacement.selected = true;
              break;
            }
          }
        });
      } else {
        $scope.possibleReplacements = [];
      }
    };

    $scope.searchString = getSearchString($scope.currentTrackItem);
    doSearch($scope.searchString);

    $scope.$watch(function (scope) {
      return scope.searchString;
    }, function (newValue, oldValue) {
      if (newValue === oldValue || !newValue) {
        return;
      }

      doSearch(newValue);
    });

    $scope.getDurationDiff = function (trackA, trackB) {
      return ((trackA.duration_ms - trackB.duration_ms) / 1000).toFixed(1);
    };

    $scope.getDurationDiffClass = function (diff) {
      var abs = Math.round(Math.abs(diff));
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

    var saveCurrentTrackItem = function () {
      var selected = $scope.possibleReplacements.filter(function (replacement) {
        return replacement.selected;
      });
      if (selected.length) {
        $scope.currentTrackItem.replacement = selected;
      } else {
        $scope.currentTrackItem.replacement = null;
      }

      $scope.currentTrackItem.searchString = $scope.searchString;
    };

    var slidingInProgress = false;
    var slidingState;

    $scope.sliderOptions = {
      start: function () {
        console.log('start');
        saveCurrentTrackItem();
        slidingState = $scope.currentIndex;
        slidingInProgress = true;
      },
      stop: function () {
        console.log('stop');
        slidingInProgress = false;

        if (slidingState !== $scope.currentIndex) {
          doSearch($scope.searchString);
        }
      }
    };

    $scope.$watch(function (scope) {
      return scope.currentIndex;
    }, function (newValue, oldValue) {
      if (newValue !== oldValue) {
        var trackItem = $scope.trackItems[newValue];
        if (trackItem) {
          $scope.currentTrackItem = trackItem;
          $scope.searchString = $scope.currentTrackItem.searchString || getSearchString($scope.currentTrackItem);
        }
      }
    });

    // buttons
    $scope.save = function () {
      saveCurrentTrackItem();
      var items = $scope.trackItems;
      var selectedItems = items.filter(function (item) {
        return item.replacement && item.replacement.length;
      });

      if (!selectedItems.length) {
        return;
      }

      var toDelete = [];
      var toAdd = [];

      selectedItems.forEach(function (selectedItem) {
        if (!selectedItem.keep) {
          toDelete.push(selectedItem.track.uri);
        }
        toAdd = toAdd.concat(selectedItem.replacement.map(function (replacement) {
          return replacement.uri;
        }));
      });

      if (toAdd.length) {
        SpotifyPlaylist.addTracks({
          userId: playlist.owner.id,
          playlistId: playlist.id
        }, {
          uris: toAdd
        }, function (/*response*/) {
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
