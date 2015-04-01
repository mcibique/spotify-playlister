(function (ng, $) {
  'use strict';

  ng.module('playlister.playlists', ['ui.router', 'playlister.filters', 'playlister.spotify-resources'])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
      $stateProvider
        .state('playlists', {
          url: '/playlists/',
          templateUrl: 'views/playlists.html',
          controller: 'PlaylistsController',
          resolve: {
            profile: function (SpotifyUser) {
              return SpotifyUser.get().$promise;
            }
          }
        });
    })
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
    .factory('playlistTracks', function ($q, SpotifyPlaylist) {
      var defaultLimit = 100;
      var getTracksResponse = function (response, playlist, offset, fields) {
        var defer = $q.defer();
        if (response.items.length && response.items.length === defaultLimit) {
          getTracks(playlist, offset + defaultLimit, fields).then(function (tracks) {
            defer.resolve(response.items.concat(tracks));
          });
        } else {
          defer.resolve(response.items);
        }

        return defer.promise;
      };

      var getTracks = function (playlist, offset, fields) {
        var defer = $q.defer();
        SpotifyPlaylist.tracks({
          userId: playlist.owner.id,
          playlistId: playlist.id,
          limit: defaultLimit,
          offset: offset,
          fields: fields
        }, function (response) {
          getTracksResponse(response, playlist, offset, fields).then(function (tracks) {
            defer.resolve(tracks);
          });
        });

        return defer.promise;
      };

      return {
        get: getTracks
      };
    })
    .factory('duplicatesFinder', function ($q, playlistTracks, spotifyNamesSanitizer) {
      var find = function (playlist) {
        var fields = 'items(track(name,id,album(name,id),artists(id,name)))';

        return playlistTracks.get(playlist, 0, fields).then(function (items) {
          var tracks = items.map(function (item) {
            var track = item.track;
            track.name = spotifyNamesSanitizer.sanitize(track.name);
            track.artists.forEach(function (artist) {
              artist.name = spotifyNamesSanitizer.sanitize(artist.name);
            });
            track.album.name = spotifyNamesSanitizer.sanitize(track.album.name);

            return track;
          });

          // IDs
          var duplicateIds = [];
          var idTemp = {};

          tracks.forEach(function (track) {
            if (track.id && idTemp[track.id]) {
              duplicateIds.push([idTemp[track.id], track]);
              return;
            }
            idTemp[track.id] = track;
          });

          // artist and title
          var artistTemp = {};
          var titlesDuplicates = [];
          tracks.forEach(function (track) {
            var key = track.artists.map(function (a) {
              return a.name;
            }).join('');
            var value = artistTemp[key];
            if (value) {
              value.push(track.name);
            } else {
              artistTemp[key] = [track.name];
            }
          });

          var filterFn = function (v) {
            return name.indexOf(v) === 0 || v.indexOf(name) === 0;
          };

          for (var key in artistTemp) {
            var value = artistTemp[key];
            for (var i = 0, len = value.length; i < len; i++) {
              var name = value[i];
              var filtered = value.filter(filterFn);
              if (filtered.length > 1) {
                titlesDuplicates.push({
                  name: name,
                  filtered: filtered,
                  key: key
                });
              }
            }
          }

          return {
            ids: duplicateIds,
            titles: titlesDuplicates
          };
        });
      };

      return {
        find: find
      };
    })
    .factory('playlistComparer', function ($q, playlistTracks, tracksComparer) {
      var compare = function (playlistA, playlistB) {
        var defer = $q.defer();
        var fields = 'items(track(name,id,album(name,id),artists(id,name)))';

        var promiseA = playlistTracks.get(playlistA, 0, fields);
        var promiseB = playlistTracks.get(playlistB, 0, fields);

        $q.all([promiseA, promiseB]).then(function (results) {
          tracksComparer.compare(results[0], results[1]).then(function (duplicates) {
            defer.resolve(duplicates);
          });
        });

        return defer.promise;
      };

      return {
        compare: compare
      };
    })
    .factory('tracksComparer', function ($q, spotifyNamesSanitizer) {
      var compare = function (tracksA, tracksB) {
        var defer = $q.defer();
        if (tracksA[0] && tracksA[0].track) {
          tracksA = tracksA.map(function (i) {
            return i.track;
          });
        }
        if (tracksB[0] && tracksB[0].track) {
          tracksB = tracksB.map(function (i) {
            return i.track;
          });
        }

        // IDs
        var temp = {};
        tracksA.forEach(function (track) {
          if (track.id) {
            temp[track.id] = track;
          }
        });

        var duplicates = [];

        tracksB.forEach(function (track) {
          var existingTrack = temp[track.id];
          if (track.id && existingTrack) {
            duplicates.push(existingTrack);
          }
        });

        // names
        var uniqueKeyTemp = {};
        var titles = [];
        tracksA.forEach(function (track) {
          if (track.id) {
            var artists = track.artists.map(function (artist) {
              return spotifyNamesSanitizer.sanitize(artist.name);
            });
            artists.sort();
            var key = artists.join('') + spotifyNamesSanitizer.sanitize(track.name);
            uniqueKeyTemp[key] = track;
          }
        });

        tracksB.forEach(function (track) {
          if (track.id) {
            var artists = track.artists.map(function (artist) {
              return spotifyNamesSanitizer.sanitize(artist.name);
            });
            artists.sort();
            var key = artists.join('') + spotifyNamesSanitizer.sanitize(track.name);
            var existing = uniqueKeyTemp[key];
            if (existing) {
              titles.push({
                a: existing,
                b: track
              });
            }
          }
        });

        defer.resolve({
          ids: duplicates,
          titles: titles
        });
        return defer.promise;
      };

      return {
        compare: compare
      };
    })
    .factory('playlistMerge', function ($q, $modal, playlistTracks) {
      var merge = function (fromPlaylist, toPlaylist) {
        var defer = $q.defer();
        var fields = 'items(added_at,track(name,id,uri,album(name,id),artists(id,name)))';

        $modal.open({
          templateUrl: 'views/modals/merge.html',
          resolve: {
            fromTracks: function () {
              return playlistTracks.get(fromPlaylist, 0, fields);
            },
            toTracks: function () {
              return playlistTracks.get(toPlaylist, 0, fields);
            }
          },
          controller: function ($scope, $modalInstance, $log, fromTracks, toTracks, tracksComparer,
            SpotifyPlaylist) {
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
            $scope.commonTracks = [];

            tracksComparer.compare(fromTracks, toTracks).then(function (commonTracks) {
              $scope.commonTracks = commonTracks.ids;
              $scope.commonTracks.forEach(function (track) {
                track.isCommon = true;
              });
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
                }, function (response) {
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
    })
    .factory('spotifyNamesSanitizer', function () {
      var sanitize = function (name) {
        if (!name) {
          return name;
        }
        return name.replace(/[\W]/g, '').toLowerCase();
      };

      return {
        sanitize: sanitize
      };
    });

})(angular, jQuery);