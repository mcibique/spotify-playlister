(function (ng) {
  'use strict';

  ng.module('playlister.spotify.resources.user', ['ngResource'])
    .factory('SpotifyUser', function ($resource, spotifyApiUrl) {
      return $resource(spotifyApiUrl + '/me');
    });

})(angular, jQuery);
