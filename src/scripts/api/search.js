angular
  .module('playlister.spotify.api.search', [])
  .factory('searchService', function searchService($http, spotifyApiUrl) {
    function tracks(query) {
      return $http.get(`${spotifyApiUrl}/search/`, {
        params: {
          q: query,
          type: 'track'
        }
      });
    }

    return { tracks };
  });
