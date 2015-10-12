'use strict';

angular
  .module('playlister.settings', [])
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
  .factory('tracksComparerSettings', (userSettingsStorage) => {
    return userSettingsStorage.get('tracksComparer');
  })
  .factory('artistsComparerSettings', (userSettingsStorage) => {
    return userSettingsStorage.get('artistsComparer');
  })
  .factory('tracksCacheSettings', (userSettingsStorage) => {
    return userSettingsStorage.get('tracksCache');
  })
  .factory('userSettingsStorage', ($window, settingsDefaults) => {
    let localStorage = $window.localStorage;

    function getSettings(settingsGroup) {
      let key = `settings-${settingsGroup}`;
      let item = localStorage.getItem(key);
      if (item) {
        let settings = angular.parseJson(item);
        if (settings) {
          return settings;
        }
      }

      return settingsDefaults[settingsGroup];
    }

    function saveSettings(settingsGroup, settings) {
      let key = `settings-${settingsGroup}`;
      localStorage.setItem(key, angular.toJson(settings));
    }

    return {
      get: getSettings,
      save: saveSettings
    };
  });
