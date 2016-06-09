import gulp from 'gulp';
import eslint from 'gulp-eslint';
import htmlhint from 'gulp-htmlhint';
import sasslint from 'gulp-sass-lint';

import paths from './paths';

/**
 * linters
 */
gulp.task('linter-html', function linterHtml() {
  return gulp.src([paths.views, paths.index])
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter('htmlhint-stylish'));
});

gulp.task('linter-js-src', function linterJsSrc() {
  return gulp.src([paths.js, '!src/scripts/config.js'])
    .pipe(eslint('src/.eslintrc.js'))
    .pipe(eslint.format());
});

gulp.task('linter-js-tasks', function linterJsTasks() {
  return gulp.src('tasks/**/*.js')
    .pipe(eslint('tasks/.eslintrc.js'))
    .pipe(eslint.format());
});

gulp.task('linter-sass', function linterSass() {
  return gulp.src(paths.scss)
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError());
});

/**
 * all linter tasks
 */
gulp.task('linters', ['linter-html', 'linter-js-src', 'linter-js-tasks', 'linter-sass']);

