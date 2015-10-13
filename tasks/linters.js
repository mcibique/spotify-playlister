'use strict';

import gulp from 'gulp';
import eslint from 'gulp-eslint';
import htmlhint from 'gulp-htmlhint';
import scsslint from 'gulp-scss-lint';
import scsslintStylish from 'gulp-scss-lint-stylish';

import paths from './paths';

/**
 * linters
 */
gulp.task('linter-html', () => {
  return gulp.src([paths.views, paths.index])
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter('htmlhint-stylish'));
});

gulp.task('linter-js', () => {
  return gulp.src([paths.js].concat(['gulpfile.babel.js', 'tasks/**/*.js', '!src/scripts/config.js']))
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('linter-scss', () => {
  return gulp.src(paths.scss)
    .pipe(scsslint({
      config: '.scss-lint.yml',
      customReport: scsslintStylish
    }));
});
