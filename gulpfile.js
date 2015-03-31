var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var autoprefixer = require('gulp-autoprefixer');

var sources = {
  tmp: ['./.tmp'],
  html: ['./src/**/*.html'],
  js: ['./src/scripts/**/*.js'],
  scss: ['./src/styles/main.scss']
};

gulp.task('clean', function () {
  return gulp.src(sources.tmp, {
      read: false
    })
    .pipe(clean());
});

gulp.task('connect', function () {
  connect.server({
    root: ['src', '.', '.tmp'],
    port: 8082,
    livereload: true
  });
});

gulp.task('html', function () {
  return gulp.src(sources.html)
    .pipe(connect.reload());
});

gulp.task('js', function () {
  return gulp.src(sources.js)
    .pipe(connect.reload());
});

gulp.task('styles', function () {
  return gulp.src(sources.scss)
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(autoprefixer({
      cascade: false,
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('./.tmp/styles/'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(sources.html, ['html']);
  gulp.watch(sources.js, ['js']);
  gulp.watch(sources.scss, ['styles']);
});

gulp.task('serve', ['connect', 'styles', 'watch']);