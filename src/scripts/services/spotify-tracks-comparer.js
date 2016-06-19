angular
  .module('playlister.spotify.comparer', [])
  .factory('sanitize', function sanitizeFactory() {
    return function sanitize(name) {
      return name.replace(/[\W]+/g, '').toLowerCase();
    };
  })
  .factory('tracksComparer', function tracksComparer(sanitize) {
    function generateTrackUniqueIds(item) {
      const track = item.track;
      const id = track.id;
      const title = sanitize(track.name);
      const local = item.is_local;
      const artistsMap = track.artists.map(artist => artist.id).sort();
      const artists = artistsMap.join(';');
      return { id, title, artists, local };
    }

    function comapareTwoTrackLists(itemsToCompareA, itemsToCompareB) {
      const result = emptyResult();

      let itemsA = itemsToCompareA;
      let itemsB = itemsToCompareB;

      if (itemsToCompareA.length > itemsToCompareB.length) {
        itemsA = itemsToCompareB;
        itemsB = itemsToCompareA;
      }

      const hashSet = Object.create(null);

      itemsA.forEach((item, index) => {
        const ids = generateTrackUniqueIds(item);
        const value = { ids, item, index };
        const hashKey = `${ids.title}-${ids.artists}`;
        if (!ids.local) {
          hashSet[ids.id] = value;
        }
        hashSet[hashKey] = value;
      });

      itemsB.forEach((item, index) => {
        const ids = generateTrackUniqueIds(item);
        const value = { ids, item, index };
        const hashKey = `${ids.title}-${ids.artists}`;
        if (!ids.local && ids.id in hashSet) {
          result.ids.push({ a: hashSet[ids.id], b: value });
        } else if (hashKey in hashSet) {
          result.titles.push({ a: hashSet[hashKey], b: value });
        }
      });

      return result;
    }

    function compareSingleTrackList(items) {
      const result = emptyResult();
      const hashSet = Object.create(null);

      items.forEach((item, index) => {
        const ids = generateTrackUniqueIds(item);
        const value = { ids, item, index };
        const hashKey = `${ids.title}-${ids.artists}`;
        if (!ids.local && ids.id in hashSet) {
          result.ids.push({ a: hashSet[ids.id], b: value });
        } else if (hashKey in hashSet) {
          result.titles.push({ a: hashSet[hashKey], b: value });
        } else {
          if (!ids.local) {
            hashSet[ids.id] = value;
          }
          hashSet[hashKey] = value;
        }
      });

      return result;
    }

    function emptyResult() {
      return { ids: [], titles: [] };
    }

    function compare(itemsA, itemsB) {
      if (!itemsA && !itemsB) {
        return emptyResult();
      }
      if (itemsA && !itemsB) {
        return compareSingleTrackList(itemsA);
      }
      return comapareTwoTrackLists(itemsA, itemsB);
    }

    return { compare };
  });
