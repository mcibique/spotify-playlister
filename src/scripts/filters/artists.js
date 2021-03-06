angular
  .module('playlister.filters.artists', [])
  .filter('artists', function artistsFilterFactory() {
    return function artistsFilter(artists) {
      if (!artists || artists.length === 0) {
        return '';
      }
      return artists
        .filter(artist => !!artist.name)
        .map(artist => artist.name || '')
        .join(', ');
    };
  });
