import gulp from 'gulp';
import clean from 'gulp-clean';

import paths from './paths';

/**
 * cleaning
 */
gulp.task('clean:dev', function cleanDev() {
  return gulp
    .src(paths.tmp, {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});

gulp.task('clean:dist', ['clean:dev'], function cleanDist() {
  return gulp
    .src(paths.dist, {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});
