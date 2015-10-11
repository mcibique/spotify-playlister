'use strict';

angular
  .module('playlister.filters.tracks', ['playlister.filters.artists'])
  .filter('track', function ($filter) {
    var artistsFilter = $filter('artists');
    return function (track) {
      if (!track) {
        return '';
      }
      var result = artistsFilter(track.artists);
      if (result) {
        result += ' - ';
      }
      result += track.name;
      if (track.album && track.album.name) {
        result += ' (' + track.album.name + ')';
      }
      return result;
    };
  });
