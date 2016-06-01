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
  .factory('tracksComparerSettings', userSettingsStorage => userSettingsStorage.get('tracksComparer'))
  .factory('artistsComparerSettings', userSettingsStorage => userSettingsStorage.get('artistsComparer'))
  .factory('tracksCacheSettings', userSettingsStorage => userSettingsStorage.get('tracksCache'))
  .factory('userSettingsStorage', ($window, settingsDefaults) => {
    const localStorage = $window.localStorage;

    function getSettings(settingsGroup) {
      const key = `settings-${settingsGroup}`;
      const item = localStorage.getItem(key);
      if (item) {
        const settings = angular.parseJson(item);
        if (settings) {
          return settings;
        }
      }

      return settingsDefaults[settingsGroup];
    }

    function saveSettings(settingsGroup, settings) {
      const key = `settings-${settingsGroup}`;
      localStorage.setItem(key, angular.toJson(settings));
    }

    return {
      get: getSettings,
      save: saveSettings
    };
  });
