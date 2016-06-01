'use strict';

import gulp from 'gulp';
import eslint from 'gulp-eslint';
import htmlhint from 'gulp-htmlhint';
import sasslint from 'gulp-sass-lint';

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
  return gulp.src([paths.js].concat(['!src/scripts/config.js']))
    .pipe(eslint('.eslintrc.js'))
    .pipe(eslint.format());
});

gulp.task('linter-sass', () => {
  return gulp.src(paths.scss)
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError());
});
