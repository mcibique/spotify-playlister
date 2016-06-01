angular
  .module('playlister.spotify.api.playlist', [])
  .factory('playlistService', function playlistService($http, spotifyApiUrl) {
    function get(userId, playlistId) {
      return $http.get(`${spotifyApiUrl}/users/${userId}/playlists/${playlistId}`);
    }

    function getPlaylists(userId, data) {
      return $http.get(`${spotifyApiUrl}/users/${userId}/playlists`, { params: data });
    }

    function getTracks(userId, playlistId, data) {
      return $http.get(`${spotifyApiUrl}/users/${userId}/playlists/${playlistId}/tracks`, { params: data });
    }

    function addTracks(userId, playlistId, data) {
      return $http.post(`${spotifyApiUrl}/users/${userId}/playlists/${playlistId}/tracks`, data);
    }

    function removeTracks(userId, playlistId) {
      return $http.delete(`${spotifyApiUrl}/users/${userId}/playlists/${playlistId}/tracks`);
    }

    return { get, getPlaylists, getTracks, addTracks, removeTracks };
  });
