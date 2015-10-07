/**
 * node
 */
var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var extend = require('node.extend');

/**
 * gulp
 */
var autoprefixer = require('gulp-autoprefixer');
var beautify = require('gulp-jsbeautifier');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var html2js = require('gulp-ng-html2js');
var htmlhint = require('gulp-htmlhint');
var htmlreplace = require('gulp-html-replace');
var imagemin = require('gulp-imagemin');
var inject = require('gulp-inject');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var ngAnnotate = require('gulp-ng-annotate');
var ngConstanst = require('gulp-ng-constant');
var rename = require('gulp-rename');
var rev = require('gulp-rev-all');
var sass = require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var sequence = require('gulp-run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var wrap = require('gulp-wrap');

/**
 * paths
 */
var paths = {
  root: '.',
  dist: './dist',
  tmp: './.tmp',
  tmpDist: './.tmp/dist',
  manifests: './.tmp/manifests',
  src: './src',
  config: './src/config.json',
  fonts: './src/fonts/**/*',
  views: './src/views/**/*.html',
  index: './src/index.html',
  js: './src/scripts/**/*.js',
  scss: './src/styles/**/*.scss',
  images: './src/images/**/*',
  templates: './src/views/modals/**/*.html',
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
gulp.task('clean:dev', function () {
  return gulp.src(paths.tmp, {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});

gulp.task('clean:dist', ['clean:dev'], function () {
  return gulp.src(paths.dist, {
    read: false
  }).pipe(clean({
    force: true
  }));
});

/**
 * config.js
 */
var generateConfig = function (environment) {
  var defaultConfigPath = paths.config;
  var envConfigPath = defaultConfigPath.replace(/\.json$/i, '.' + environment + '.json');
  var defaultConfig = require(defaultConfigPath);

  if (fs.existsSync(envConfigPath)) {
    var envConfig = require(envConfigPath);
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

gulp.task('config:dev', function () {
  return generateConfig('dev');
});

gulp.task('config:dist', function () {
  return generateConfig('dist');
});

/**
 * server
 */
gulp.task('connect:dev', function () {
  connect.server({
    root: [paths.src, paths.tmp, paths.root],
    port: 8082,
    livereload: true
  });
});

gulp.task('connect:dist', function () {
  connect.server({
    root: paths.dist,
    port: 8083
  });
});

/**
 * livereload
 */
gulp.task('html', function () {
  return gulp.src([paths.views, paths.index])
    .pipe(connect.reload());
});

gulp.task('js', function () {
  return gulp.src(paths.js)
    .pipe(connect.reload());
});

gulp.task('styles', function () {
  return gulp.src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false,
      browsers: ['last 2 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.join(paths.tmp, 'styles')))
    .pipe(connect.reload());
});

/**
 * scripts synchronization
 */
gulp.task('index:dev', function () {
  return gulp.src(paths.index)
    .pipe(inject(gulp.src([paths.js, '!**/spotify-credentials.js', '!**/spotify-credentials-dist.js'], {
      read: false
    }), {
      relative: true,
      addRootSlash: true
    }))
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
gulp.task('watch', function () {
  gulp.watch([paths.views, paths.index], ['html']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.scss, ['styles']);
});

/**
 * linters
 */
gulp.task('linter-html', function () {
  return gulp.src([paths.views, paths.index])
    .pipe(htmlhint('./../.htmlhintrc'))
    .pipe(htmlhint.reporter());
});

gulp.task('linter-jscs', function () {
  return gulp.src(paths.js)
    .pipe(jscs({
      configPath: './../.jscsrc'
    }));
});

gulp.task('linter-jshint', function () {
  return gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('linter-scss', function () {
  return gulp.src(paths.scss)
    .pipe(scsslint({
      config: './../.scss-lint.yml'
    }));
});

/**
 * dist build: main application
 */
gulp.task('build-js', function () {
  return gulp.src([paths.js, '!**/spotify-credentials.js', '!**/templates.js'])
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
gulp.task('build-js-vendor', function () {
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
gulp.task('build-js-templates', function () {
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
gulp.task('build-styles', function () {
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
gulp.task('build-views', function () {
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
gulp.task('build-index', function () {
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
gulp.task('build-fonts', function () {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(path.join(paths.tmpDist, 'fonts')));
});

/**
 * dist build: images
 */
gulp.task('build-images', function () {
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
gulp.task('build-rev', function () {
  var builder = new rev({
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
gulp.task('build:dev', function (cb) {
  return sequence('clean:dev', 'config:dev', ['styles', 'index:dev'], cb);
});

/**
 * dist main build task
 */
gulp.task('build:dist', function (cb) {
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
gulp.task('serve:dev', function (cb) {
  return sequence('build:dev', ['connect:dev', 'watch'], cb);
});

/**
 * serve dist main task
 */
gulp.task('serve:dist', function (cb) {
  return sequence('build:dist', 'connect:dist', cb);
});

/**
 * all linters task
 */
gulp.task('linters', ['linter-html', 'linter-jscs', 'linter-jshint', 'linter-scss']);
