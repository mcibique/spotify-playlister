(function (ng) {
  'use strict';

  ng.module('playlister.settings', [])
    .constant('settingsDefaults', {
      artistsComparer: {
        compareIds: true,
        compareNames: true,
        diffLength: 1
      },
      tracksCache: {
        expires: 10
      },
      tracksComparer: {
        compareIds: true,
        compareNames: true
      }
    })
    .factory('tracksComparerSettings', function (userSettingsStorage) {
      return userSettingsStorage.get('tracksComparer');
    })
    .factory('artistsComparerSettings', function (userSettingsStorage) {
      return userSettingsStorage.get('artistsComparer');
    })
    .factory('tracksCacheSettings', function (userSettingsStorage) {
      return userSettingsStorage.get('tracksCache');
    })
    .factory('userSettingsStorage', function ($window, settingsDefaults) {
      var localStorage = $window.localStorage;

      var getSettings = function (settingsGroup) {
        var key = 'settings-' + settingsGroup;
        var item = localStorage.getItem(key);
        if (item) {
          var settings = angular.parseJson(item);
          if (settings) {
            return settings;
          }
        }

        return settingsDefaults[settingsGroup];
      };

      var saveSettings = function (settingsGroup, settings) {
        var key = 'settings-' + settingsGroup;
        localStorage.setItem(key, angular.toJson(settings));
      };

      return {
        get: getSettings,
        save: saveSettings
      };
    });

})(angular, jQuery);
