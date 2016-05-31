'use strict';

angular
  .module('playlister.spotify.comparer', [])
  .factory('sanitize', function sanitizeFactory() {
    return function sanitize(name) {
      return name.replace(/[\W]+/g, '').toLowerCase();
    };
  })
  .factory('tracksComparer', function tracksComparer(sanitize) {
    function generateTrackUniqueIds(item) {
      let track = item.track;
      let id = track.id;
      let title = sanitize(track.name);
      let local = item.is_local;
      let artistsMap = track.artists.map(artist => artist.id).sort();
      let artists = artistsMap.join(';');
      return { id, title, artists, local };
    }

    function comapareTwoTrackLists(itemsToCompareA, itemsToCompareB) {
      let result = {
        ids: [],
        titles: []
      };

      let itemsA = itemsToCompareA;
      let itemsB = itemsToCompareB;

      if (itemsToCompareA.length > itemsToCompareB.length) {
        itemsA = itemsToCompareB;
        itemsB = itemsToCompareA;
      }

      let hashSet = {};

      itemsA.forEach(item => {
        let ids = generateTrackUniqueIds(item);
        let value = { ids, item };
        const hashKey = `${ids.title}-${ids.artists}`;
        if (!ids.local) {
          hashSet[ids.id] = value;
        }
        hashSet[hashKey] = value;
      });

      itemsB.forEach(item => {
        let ids = generateTrackUniqueIds(item);
        const hashKey = `${ids.title}-${ids.artists}`;
        if (!ids.local && hashSet.hasOwnProperty(ids.id)) {
          result.ids.push({
            a: hashSet[ids.id],
            b: { ids, item }
          });
        } else if (hashSet.hasOwnProperty(hashKey)) {
          result.titles.push({
            a: hashSet[hashKey],
            b: { ids, item }
          });
        }
      });

      return result;
    }

    function compareSingleTrackList(items) {
      let result = {
        ids: [],
        titles: []
      };

      let hashSet = {};

      items.forEach(item => {
        let ids = generateTrackUniqueIds(item);
        let value = { ids, item };
        const hashKey = `${ids.title}-${ids.artists}`;
        if (!ids.local && hashSet.hasOwnProperty(ids.id)) {
          result.ids.push({
            a: hashSet[ids.id],
            b: value
          });
        } else if (hashSet.hasOwnProperty(hashKey)) {
          result.titles.push({
            a: hashSet[hashKey],
            b: value
          });
        } else {
          if (!ids.local) {
            hashSet[ids.id] = value;
          }
          hashSet[hashKey] = value;
        }
      });

      return result;
    }

    function compare(itemsA, itemsB) {
      if (!itemsA && !itemsB) {
        return {
          ids: [],
          titles: []
        };
      }
      if (itemsA && !itemsB) {
        return compareSingleTrackList(itemsA);
      }
      return comapareTwoTrackLists(itemsA, itemsB);
    }

    return { compare };
  });
