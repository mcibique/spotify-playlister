angular
  .module('playlister.filters.tracks', ['playlister.filters.artists'])
  .filter('track', function trackFilterFactory($filter) {
    const artistsFilter = $filter('artists');
    return function trackFilter(track) {
      if (!track) {
        return '';
      }
      let result = artistsFilter(track.artists);

      if (track.name) {
        if (result) {
          result += ' - ';
        }
        result += track.name;
      }

      if (track.album && track.album.name) {
        if (result) {
          result += ' ';
        }
        result += `(${track.album.name})`;
      }

      return result;
    };
  });
