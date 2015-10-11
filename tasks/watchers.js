'use strict';

import gulp from 'gulp';

import paths from './paths';

/**
 * watchers
 */
gulp.task('watch', () => {
  gulp.watch([paths.views, paths.index], ['html']);
  gulp.watch(paths.js, ['js']);
  gulp.watch([paths.config, 'config.dev.json'], ['config:dev']);
  gulp.watch(paths.scss, ['styles']);
});
