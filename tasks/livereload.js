'use strict';

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
import scsslint from 'gulp-scss-lint';
import scsslintStylish from 'gulp-scss-lint-stylish';
import sourcemaps from 'gulp-sourcemaps';
import wrap from 'gulp-wrap-js';

import paths from './paths';

/**
 * livereload
 */
gulp.task('html', () => {
  return gulp.src([paths.views, paths.index])
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter('htmlhint-stylish'))
    .pipe(connect.reload());
});

gulp.task('js', () => {
  return gulp.src([paths.js, '!**/spotify-credentials.js', '!**/spotify-credentials-dist.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(sourcemaps.init())
    .pipe(babel())
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

gulp.task('styles', () => {
  return gulp.src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(scsslint({
      config: '.scss-lint.yml',
      customReport: scsslintStylish
    }))
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
