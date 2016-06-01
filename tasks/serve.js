'use strict';

import gulp from 'gulp';
import sequence from 'gulp-run-sequence';

/**
 * serve dev main task
 */
gulp.task('serve:dev', (cb) => {
  return sequence('build:dev', ['connect:dev', 'watch'], cb);
});

/**
 * serve dist main task
 */
gulp.task('serve:dist', (cb) => {
  return sequence('build:dist', 'connect:dist', cb);
});

/**
 * all linter tasks
 */
gulp.task('linters', ['linter-html', 'linter-js', 'linter-sass']);
