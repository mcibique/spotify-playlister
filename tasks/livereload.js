import fs from 'fs';
import path from 'path';

import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import connect from 'gulp-connect';
import htmlhint from 'gulp-htmlhint';
import eslint from 'gulp-eslint';
import sass from 'gulp-sass';
import sasslint from 'gulp-sass-lint';
import sourcemaps from 'gulp-sourcemaps';
import wrap from 'gulp-wrap-js';

import paths from './paths';

/**
 * livereload
 */
gulp.task('html', function html() {
  return gulp.src([paths.views, paths.index])
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter('htmlhint-stylish'))
    .pipe(connect.reload());
});

gulp.task('js', function js() {
  return gulp.src([...paths.js, '!**/spotify-credentials.js', '!**/spotify-credentials-dist.js'])
    .pipe(eslint('src/.eslintrc.js'))
    .pipe(eslint.format())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .on('error', console.error.bind(console))
    .pipe(concat('all.js'))
    .pipe(wrap(fs.readFileSync('./templates/all.scripts.template', 'utf8'), {
      indent: {
        style: '  ',
        base: 2,
        adjustMultilineComment: false
      },
      newline: '\n',
      space: ' '
    }))
    .pipe(sourcemaps.write('.', {
      sourceRoot: paths.src
    }))
    .pipe(gulp.dest(path.join(paths.tmp, 'scripts')))
    .pipe(connect.reload());
});

gulp.task('styles', function styles() {
  return gulp.src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false,
      browsers: ['last 2 versions']
    }))
    .pipe(sourcemaps.write('.', {
      sourceRoot: paths.root
    }))
    .pipe(gulp.dest(path.join(paths.tmp, 'styles')))
    .pipe(connect.reload());
});
