var gulp = require('gulp');
var connect = require('gulp-connect');

var sources = {
  html: ['./src/**/*.html'],
  js: ['./src/scripts/**/*.js']
};

gulp.task('connect', function () {
  connect.server({
    root: ['src', '.'],
    port: 8082,
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src(sources.html)
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src(sources.js)
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(sources.html, ['html']);
  gulp.watch(sources.js, ['js']);
});

gulp.task('serve', ['connect', 'watch']);