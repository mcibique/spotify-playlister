'use strict';

angular.module('playlister.spotify', ['playlister.spotify.credentials', 'playlister.spotify.resources',
  'playlister.spotify.tracksCache', 'playlister.spotify.playlistTracks', 'playlister.spotify.replacements',
  'playlister.spotify.comparer', 'playlister.spotify.choose-playlist', 'playlister.spotify.playlists-merge'
]);
