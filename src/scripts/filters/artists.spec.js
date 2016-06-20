describe('artists filter', function () {

  let artistsFilter;

  beforeEach(function () {
    module('playlister.filters');

    inject(function ($filter) {
      artistsFilter = $filter('artists');
    });
  });

  it('should return empty string when no authors are given', function () {
    expect(artistsFilter()).toBe('');
    expect(artistsFilter(undefined)).toBe('');
    expect(artistsFilter(null)).toBe('');
  });

  it('should return empty string when empty array is given', function () {
    expect(artistsFilter([])).toBe('');
  });

  it('should format 1 author', function () {
    const authors = [{ name: 'Author1' }];

    expect(artistsFilter(authors)).toBe('Author1');
  });

  it('should format 2 authors', function () {
    const authors = [{ name: 'Author1' }, { name: 'Author2' }];
    expect(artistsFilter(authors)).toBe('Author1, Author2');
  });

  it('should format 3 or more authors', function () {
    const authors = [{ name: 'Author1' }, { name: 'Author2' }, { name: 'Author3' }, { name: 'Author4' }];
    expect(artistsFilter(authors)).toBe('Author1, Author2, Author3, Author4');
  });

  it('should filter authors with empty name', function () {
    const authors = [{ name: 'Author1' }, { name: 'Author2' }, { name: null }, { name: 'Author4' }];
    expect(artistsFilter(authors)).toBe('Author1, Author2, Author4');
  });
});