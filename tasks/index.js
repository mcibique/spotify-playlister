'use strict';

import gulp from 'gulp';
import inject from 'gulp-inject';

import paths from './paths';

/**
 * scripts synchronization
 */
gulp.task('index:dev', () => {
  return gulp.src(paths.index)
    .pipe(inject(gulp.src(paths.jsVendor, {
      read: false
    }), {
      name: 'vendor'
    }))
    .pipe(gulp.dest(paths.src));
});
