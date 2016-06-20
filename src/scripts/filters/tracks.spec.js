describe('tracks filter', function () {
  let trackFilter;
  let artistsFilterMock;

  beforeEach(function () {
    module('playlister.filters');

    artistsFilterMock = jasmine.createSpy('artistsFilterMock').and.callFake(function (artists) {
      return artists ? 'Artists' : '';
    });

    module(function ($provide) {
      $provide.value('artistsFilter', artistsFilterMock);
    });

    inject(function ($filter) {
      trackFilter = $filter('track');
    });
  });

  it('should return empty string when no track is given', function () {
    expect(trackFilter()).toBe('');
    expect(trackFilter(undefined)).toBe('');
    expect(trackFilter(null)).toBe('');
  });

  describe('track with artists', function () {
    it('should use artist filter when artists are given', function () {
      const track = {
        artists: [{ name: 'Artist1' }, { name: 'Artist2' }]
      };

      trackFilter(track);
      expect(artistsFilterMock).toHaveBeenCalledWith(track.artists);
    });

    it('should format track name and album', function () {
      const track = {
        name: 'Track1',
        artists: [{ name: 'Artist1' }, { name: 'Artist2' }],
        album: {
          name: 'Album1'
        }
      };

      expect(trackFilter(track)).toBe('Artists - Track1 (Album1)');
    });

    it('should format track without name but album', function () {
      const track = {
        artists: [{ name: 'Artist1' }, { name: 'Artist2' }],
        album: {
          name: 'Album1'
        }
      };

      expect(trackFilter(track)).toBe('Artists (Album1)');
    });

    it('should format track with the name and no album', function () {
      const track = {
        name: 'Track1',
        artists: [{ name: 'Artist1' }, { name: 'Artist2' }]
      };

      expect(trackFilter(track)).toBe('Artists - Track1');
    });
  });

  describe('track with name', function () {
    it('should format track name and album', function () {
      const track = {
        name: 'Track1',
        album: {
          name: 'Album1'
        }
      };

      expect(trackFilter(track)).toBe('Track1 (Album1)');
    });

    it('should format track without album', function () {
      const track = {
        name: 'Track1'
      };

      expect(trackFilter(track)).toBe('Track1');
    });
  });

  describe('track with album', function () {
    it('should ignore empty album', function () {
      const track = {
        name: 'Track1',
        album: {}
      };
      expect(trackFilter(track)).toBe('Track1');
    });

    it('should format track without name', function () {
      const track = {
        album: {
          name: 'Album1'
        }
      };
      expect(trackFilter(track)).toBe('(Album1)');
    });
  });
});