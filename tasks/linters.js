'use strict';

import gulp from 'gulp';
import htmlhint from 'gulp-htmlhint';
import jscs from 'gulp-jscs';
import jscsStylish from 'gulp-jscs-stylish';
import jshint from 'gulp-jshint';
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
  return gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jscs({
      configPath: '.jscsrc'
    }))
    .pipe(jscsStylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('linter-scss', () => {
  return gulp.src(paths.scss)
    .pipe(scsslint({
      config: '.scss-lint.yml',
      customReport: scsslintStylish
    }));
});
