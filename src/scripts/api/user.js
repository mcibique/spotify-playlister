angular
  .module('playlister.spotify.api.user', [])
  .factory('userService', function userService($http, spotifyApiUrl) {
    function get() {
      return $http.get(`${spotifyApiUrl}/me/`);
    }

    return { get };
  });
