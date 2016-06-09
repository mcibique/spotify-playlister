import gulp from 'gulp';
import sequence from 'gulp-run-sequence';

/**
 * serve dev main task
 */
gulp.task('serve:dev', cb => sequence('build:dev', ['connect:dev', 'watch'], cb));

/**
 * serve dist main task
 */
gulp.task('serve:dist', cb => sequence('build:dist', 'connect:dist', cb));
