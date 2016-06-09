import gulp from 'gulp';
import connect from 'gulp-connect';

import paths from './paths';

/**
 * server
 */
gulp.task('connect:dev', () => {
  connect.server({
    root: [paths.src, paths.tmp, paths.root],
    port: 8082,
    livereload: true
  });
});

gulp.task('connect:dist', () => {
  connect.server({
    root: paths.dist,
    port: 8083
  });
});
