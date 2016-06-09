import gulp from 'gulp';

import paths from './paths';

/**
 * watchers
 */
gulp.task('watch', () => {
  gulp.watch([paths.views, paths.index], { interval: 250 }, ['html']);
  gulp.watch(paths.js, ['js'], { interval: 250 });
  gulp.watch([paths.config, 'config.dev.json'], { interval: 1000 }, ['config:dev']);
  gulp.watch(paths.scss, { interval: 250 }, ['styles']);
});
