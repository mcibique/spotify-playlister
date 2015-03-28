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
      playlistComparer) {
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

        duplicatesFinder.find(profile.id, selected[0]).then(function (duplicates) {
          $log.debug('duplicates found: ', duplicates);
          $scope.duplicates = duplicates;
        });
      };

      $scope.comparePlaylists = function (selected) {
        $scope.commonTracks = [];
        if (!selected.length || selected.length !== 2) {
          return;
        }

        playlistComparer.compare(profile.id, selected[0], selected[1]).then(function (commonTracks) {
          $log.debug('common tracks: ', commonTracks);
          $scope.commonTracks = commonTracks.map(function (track) {
            return $filter('track')(track);
          });
          $scope.commonTracks.sort();
        });
      };
    })
    .factory('playlistTracks', function ($q, SpotifyPlaylist) {
      var defaultLimit = 100;
      var getTracksResponse = function (response, userId, playlist, offset, fields) {
        var defer = $q.defer();
        if (response.items.length && response.items.length === defaultLimit) {
          getTracks(userId, playlist, offset + defaultLimit, fields).then(function (tracks) {
            defer.resolve(response.items.concat(tracks));
          });
        } else {
          defer.resolve(response.items);
        }

        return defer.promise;
      };

      var getTracks = function (userId, playlist, offset, fields) {
        var defer = $q.defer();
        SpotifyPlaylist.tracks({
          userId: userId,
          playlistId: playlist.id,
          limit: defaultLimit,
          offset: offset,
          fields: fields
        }, function (response) {
          getTracksResponse(response, userId, playlist, offset, fields).then(function (tracks) {
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
      var find = function (userId, playlist) {
        var fields = 'items(track(name,id,album(name,id),artists(id,name)))';

        return playlistTracks.get(userId, playlist, 0, fields).then(function (items) {
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
    .factory('playlistComparer', function ($q, playlistTracks) {
      var compare = function (userId, playlistA, playlistB) {
        var defer = $q.defer();
        var fields = 'items(track(name,id,album(name,id),artists(id,name)))';

        var promiseA = playlistTracks.get(userId, playlistA, 0, fields);
        var promiseB = playlistTracks.get(userId, playlistB, 0, fields);

        $q.all([promiseA, promiseB]).then(function (results) {
          var tracksA = results[0].map(function (i) {
            return i.track;
          });
          var tracksB = results[1].map(function (i) {
            return i.track;
          });

          var temp = {};
          tracksA.forEach(function (track) {
            if (track.id) {
              temp[track.id] = track;
            }
          });

          var duplicates = [];

          tracksB.forEach(function (track) {
            if (track.id && temp[track.id]) {
              duplicates.push(track);
            }
          });

          defer.resolve(duplicates);
        });

        return defer.promise;
      };

      return {
        compare: compare
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