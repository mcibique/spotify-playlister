'use strict';

import gulp from 'gulp';
import clean from 'gulp-clean';

import paths from './paths';

/**
 * cleaning
 */
gulp.task('clean:dev', () => {
  return gulp
    .src(paths.tmp, {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});

gulp.task('clean:dist', ['clean:dev'], () => {
  return gulp
    .src(paths.dist, {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});
