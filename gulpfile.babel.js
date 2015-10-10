'use strict';

/**
 * node
 */
import gulp from 'gulp';
import path from 'path';
import fs from 'fs';
import extend from 'node.extend';

/**
 * gulp
 */
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import beautify from 'gulp-jsbeautifier';
import clean from 'gulp-clean';
import concat from 'gulp-concat';
import connect from 'gulp-connect';
import html2js from 'gulp-ng-html2js';
import htmlhint from 'gulp-htmlhint';
import htmlreplace from 'gulp-html-replace';
import imagemin from 'gulp-imagemin';
import inject from 'gulp-inject';
import jscs from 'gulp-jscs';
import jscsStylish from 'gulp-jscs-stylish';
import jshint from 'gulp-jshint';
import minifyCSS from 'gulp-minify-css';
import minifyHTML from 'gulp-minify-html';
import ngAnnotate from 'gulp-ng-annotate';
import ngConstanst from 'gulp-ng-constant';
import rename from 'gulp-rename';
import rev from 'gulp-rev-all';
import sass from 'gulp-sass';
import scsslint from 'gulp-scss-lint';
import scsslintStylish from 'gulp-scss-lint-stylish';
import sequence from 'gulp-run-sequence';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import wrap from 'gulp-wrap';

/**
 * paths
 */
const paths = {
  root: '.',
  dist: 'dist',
  tmp: '.tmp',
  tmpDist: '.tmp/dist',
  manifests: '.tmp/manifests',
  src: 'src',
  config: 'src/config.json',
  fonts: 'src/fonts/**/*',
  views: 'src/views/**/*.html',
  index: 'src/index.html',
  js: 'src/scripts/**/*.js',
  scss: 'src/styles/**/*.scss',
  images: 'src/images/**/*',
  templates: 'src/views/modals/**/*.html',
  jsVendor: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/jquery-ui/ui/core.js',
    'bower_components/jquery-ui/ui/widget.js',
    'bower_components/jquery-ui/ui/mouse.js',
    'bower_components/jquery-ui/ui/slider.js',
    'bower_components/perfect-scrollbar/js/perfect-scrollbar.jquery.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angular-ui-slider/src/slider.js',
    'bower_components/angular-resource/angular-resource.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js'
  ]
};

/**
 * cleaning
 */
gulp.task('clean:dev', () => {
  return gulp.src(paths.tmp, {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});

gulp.task('clean:dist', ['clean:dev'], () => {
  return gulp.src(paths.dist, {
    read: false
  }).pipe(clean({
    force: true
  }));
});

/**
 * config.js
 */
var generateConfig = (environment) => {
  const defaultConfigPath = paths.config;
  const envConfigPath = defaultConfigPath.replace(/\.json$/i, '.' + environment + '.json');
  let defaultConfig = require('./' + defaultConfigPath);

  if (fs.existsSync(envConfigPath)) {
    let envConfig = require('./' + envConfigPath);
    extend(true, defaultConfig, envConfig);
  }

  return ngConstanst({
      stream: true,
      name: 'playlister.config',
      space: ' ',
      templatePath: './templates/config.ejs',
      constants: {
        config: defaultConfig
      }
    })
    .pipe(rename('config.js'))
    .pipe(beautify({
      indentSize: 2,
      maxPreserveNewlines: 2,
      jslintHappy: true
    }))
    .pipe(gulp.dest(path.join(paths.src, 'scripts')));
};

gulp.task('config:dev', () => {
  return generateConfig('dev');
});

gulp.task('config:dist', () => {
  return generateConfig('dist');
});

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
    .pipe(jshint())
    .pipe(jscs({
      configPath: '.jscsrc'
    }))
    .pipe(jscsStylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('all.js'))
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

/**
 * scripts synchronization
 */
gulp.task('index:dev', () => {
  return gulp.src(paths.index)
    .pipe(inject(gulp.src(paths.jsVendor, {
      read: false
    }), {
      name: 'vendor'
    }))
    .pipe(gulp.dest(paths.src));
});

/**
 * watchers
 */
gulp.task('watch', () => {
  gulp.watch([paths.views, paths.index], ['html']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.scss, ['styles']);
});

/**
 * linters
 */
gulp.task('linter-html', () => {
  return gulp.src([paths.views, paths.index])
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter('htmlhint-stylish'));
});

gulp.task('linter-js', () => {
  return gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jscs({
      configPath: '.jscsrc'
    }))
    .pipe(jscsStylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('linter-scss', () => {
  return gulp.src(paths.scss)
    .pipe(scsslint({
      config: '.scss-lint.yml',
      customReport: scsslintStylish
    }));
});

/**
 * dist build: main application
 */
gulp.task('build-js', () => {
  return gulp.src([paths.js, '!**/spotify-credentials.js', '!**/spotify-credentials-debug.js', '!**/templates.js'])
    .pipe(babel())
    .pipe(concat('app.js'))
    .pipe(ngAnnotate({
      regexp: '^ng\\.module\\([^\\)]+\\)$'
    }))
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
  return gulp.src(paths.templates, {
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
    .pipe(wrap({
      src: './templates/html2js.txt'
    }))
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
  let builder = new rev({
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

/**
 * serve dev main task
 */
gulp.task('serve:dev', (cb) => {
  return sequence('build:dev', ['connect:dev', 'watch'], cb);
});

/**
 * serve dist main task
 */
gulp.task('serve:dist', (cb) => {
  return sequence('build:dist', 'connect:dist', cb);
});

/**
 * all linter tasks
 */
gulp.task('linters', ['linter-html', 'linter-js', 'linter-scss']);
