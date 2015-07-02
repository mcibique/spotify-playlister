(function (ng, $) {
  'use strict';

  ng.module('playlister.spotify.comparer', [])
    .factory('sanitize', function () {
      return function sanitize (name) {
        return name.replace(/[\W]+/g, '').toLowerCase();
      };
    })
    .factory('tracksComparer', function (sanitize) {

      var generateTrackUniqueIds = function (item) {
        var track = item.track;
        var id = track.id;
        var title = sanitize(track.name);
        var local = item.is_local;

        var artistsMap = track.artists.map(function (artist) {
          return artist.id;
        }).sort();
        var artists = artistsMap.join(';');
        return {
          id: id,
          title: title,
          artists: artists,
          local: local
        };
      };

      var comapareTwoTrackLists = function (itemsA, itemsB) {
        var result = {
          ids: [],
          titles: []
        };

        if (itemsA.length > itemsB.length) {
          var tempC = itemsA;
          itemsA = itemsB;
          itemsB = tempC;
        }

        var hashSet = {};

        itemsA.forEach(function (item) {
          var ids = generateTrackUniqueIds(item);
          var value = {
            ids: ids,
            item: item
          };
          if (!ids.local) {
            hashSet[ids.id] = value;
          }
          hashSet[ids.title + '-' + ids.artists] = value;
        });

        itemsB.forEach(function (item) {
          var ids = generateTrackUniqueIds(item);
          if (!ids.local && hashSet.hasOwnProperty(ids.id)) {
            result.ids.push({
              a: hashSet[ids.id],
              b: {
                ids: ids,
                item: item
              }
            });
          } else if (hashSet.hasOwnProperty(ids.title + '-' + ids.artists)) {
            result.titles.push({
              a: hashSet[ids.title + '-' + ids.artists],
              b: {
                ids: ids,
                item: item
              }
            });
          }
        });

        return result;
      };

      var compareSingleTrackList = function (items) {
        var result = {
          ids: [],
          titles: []
        };

        var hashSet = {};

        items.forEach(function (item) {
          var ids = generateTrackUniqueIds(item);
          var value = {
            ids: ids,
            item: item
          };
          if (!ids.local && hashSet.hasOwnProperty(ids.id)) {
            result.ids.push({
              a: hashSet[ids.id],
              b: value
            });
          } else if (hashSet.hasOwnProperty(ids.title + '-' + ids.artists)) {
            result.titles.push({
              a: hashSet[ids.title + '-' + ids.artists],
              b: value
            });
          } else {
            if (!ids.local) {
              hashSet[ids.id] = value;
            }
            hashSet[ids.title + '-' + ids.artists] = value;
          }
        });

        return result;
      };

      var compare = function (itemsA, itemsB) {
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
      };

      return {
        compare: compare
      };
    });

})(angular, jQuery);
