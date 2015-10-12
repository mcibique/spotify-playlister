'use strict';

import path from 'path';
import fs from 'fs';

import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import html2js from 'gulp-ng-html2js';
import htmlreplace from 'gulp-html-replace';
import imagemin from 'gulp-imagemin';
import inject from 'gulp-inject';
import minifyCSS from 'gulp-minify-css';
import minifyHTML from 'gulp-minify-html';
import ngAnnotate from 'gulp-ng-annotate';
import Rev from 'gulp-rev-all';
import sass from 'gulp-sass';
import sequence from 'gulp-run-sequence';
import uglify from 'gulp-uglify';
import wrap from 'gulp-wrap-js';

import paths from './paths';

/**
 * dist build: main application
 */
gulp.task('build-js', () => {
  return gulp.src([paths.js, '!**/spotify-credentials.js', '!**/spotify-credentials-debug.js', '!**/templates.js'])
    .pipe(babel())
    .pipe(concat('app.js'))
    .pipe(wrap(fs.readFileSync('./templates/all.scripts.template', 'utf8')))
    .pipe(ngAnnotate())
    .pipe(uglify({
      output: {
        max_line_len: 1024
      },
      compress: {
        dead_code: true,
        drop_debugger: true,
        join_vars: true,
        drop_console: true
      }
    }))
    .pipe(gulp.dest(path.join(paths.tmpDist, 'scripts')));
});

/**
 * dist build: vendor scripts
 */
gulp.task('build-js-vendor', () => {
  return gulp.src(paths.jsVendor)
    .pipe(concat('vendor.js'))
    .pipe(uglify({
      output: {
        max_line_len: 1024
      },
      compress: {
        dead_code: true,
        drop_debugger: true,
        join_vars: true,
        drop_console: true
      }
    }))
    .pipe(gulp.dest(path.join(paths.tmpDist, 'scripts')));
});

/**
 * dist build: html -> js templates
 */
gulp.task('build-js-templates', () => {
  return gulp
    .src(paths.templates, {
      base: paths.src
    })
    .pipe(minifyHTML({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(html2js({
      declareModule: false,
      prefix: '',
      template: '      $templateCache.put(\'<%= template.url %>\', \'<%= template.escapedContent %>\');'
    }))
    .pipe(concat('templates.js'))
    .pipe(wrap(fs.readFileSync('./templates/html2js.template', 'utf8')))
    .pipe(uglify({
      output: {
        max_line_len: 1024
      },
      compress: {
        dead_code: true,
        drop_debugger: true,
        join_vars: true,
        drop_console: true
      }
    }))
    .pipe(gulp.dest(path.join(paths.tmpDist, 'scripts')));
});

/**
 * dist build: styles
 */
gulp.task('build-styles', () => {
  return gulp.src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false,
      browsers: ['last 2 versions']
    }))
    .pipe(minifyCSS({
      keepSpecialComments: false
    }))
    .pipe(gulp.dest(path.join(paths.tmpDist, 'styles')));
});

/**
 * dist build: html
 */
gulp.task('build-views', () => {
  return gulp.src(paths.views)
    .pipe(minifyHTML({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(gulp.dest(path.join(paths.tmpDist, 'views')));
});

/**
 * dist build: index.html
 */
gulp.task('build-index', () => {
  return gulp.src(paths.index)
    .pipe(inject(gulp.src([paths.js, '!**/spotify-credentials.js', '!**/spotify-credentials-debug.js'], {
      read: false
    })))
    .pipe(inject(gulp.src(paths.jsVendor, {
      read: false
    }), {
      name: 'vendor'
    }))
    .pipe(htmlreplace({
      'js-app': {
        src: 'app.js',
        tpl: '<script src="/scripts/%s"></script>'
      },
      'js-vendor': {
        src: 'vendor.js',
        tpl: '<script src="/scripts/%s"></script>'
      },
      'js-templates': {
        src: 'templates.js',
        tpl: '<script src="/scripts/%s"></script>'
      }
    }))
    .pipe(minifyHTML({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(gulp.dest(paths.tmpDist));
});

/**
 * dist build: fonts
 */
gulp.task('build-fonts', () => {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(path.join(paths.tmpDist, 'fonts')));
});

/**
 * dist build: images
 */
gulp.task('build-images', () => {
  return gulp.src(paths.images)
    .pipe(imagemin({
      progressive: true,
      optimizationLevel: 7,
      svgoPlugins: [{
        removeViewBox: false
      }]
    }))
    .pipe(gulp.dest(path.join(paths.tmpDist, 'images')));
});

/**
 * dist build: revisions
 */
gulp.task('build-rev', () => {
  let builder = new Rev({
    dontRenameFile: ['.*.html'],
    dontUpdateReference: ['.*.html'],
    dontSearchFile: ['.*vendor.js']
  });

  gulp.src(path.join(paths.tmpDist, '**'))
    .pipe(builder.revision())
    .pipe(gulp.dest(paths.dist))
    .pipe(builder.manifestFile())
    .pipe(gulp.dest(paths.manifests));

  return gulp.src(path.join(paths.tmpDist, '**/*.html'))
    .pipe(gulp.dest(paths.dist));
});

/**
 * dev build main task
 */
gulp.task('build:dev', (cb) => {
  return sequence('clean:dev', 'config:dev', ['html', 'styles', 'js', 'index:dev'], cb);
});

/**
 * dist main build task
 */
gulp.task('build:dist', (cb) => {
  return sequence(
    'clean:dist',
    'config:dist', ['build-js', 'build-js-vendor', 'build-js-templates', 'build-images', 'build-styles', 'build-fonts',
      'build-views', 'build-index'
    ],
    'build-rev',
    cb);
});
