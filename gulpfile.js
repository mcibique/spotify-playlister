var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var autoprefixer = require('gulp-autoprefixer');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var rev = require('gulp-rev');
var revReplace = require("gulp-rev-replace");
var sequence = require('gulp-run-sequence');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var htmlreplace = require('gulp-html-replace');

var sources = {
  dist: ['./dist'],
  tmp: ['./.tmp'],
  fonts: ['./src/fonts/**/*'],
  views: ['./src/views/**/*'],
  index: ['./src/index.html'],
  js: ['./src/scripts/**/*'],
  scss: ['./src/styles/**/*'],
  jsVendor: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/jquery-ui/ui/jquery.ui.core.js',
    'bower_components/jquery-ui/ui/jquery.ui.widget.js',
    'bower_components/jquery-ui/ui/jquery.ui.mouse.js',
    'bower_components/jquery-ui/ui/jquery.ui.slider.js',
    'bower_components/perfect-scrollbar/js/perfect-scrollbar.jquery.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angular-ui-slider/src/slider.js',
    'bower_components/angular-resource/angular-resource.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js'
  ]
};

gulp.task('clean:dev', function () {
  return gulp.src(sources.tmp, {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});

gulp.task('clean:dist', ['clean:dev'], function () {
  return gulp.src(sources.dist, {
    read: false
  }).pipe(clean({
    force: true
  }));
});

gulp.task('connect:dev', function () {
  connect.server({
    root: ['src', '.', '.tmp'],
    port: 8082,
    livereload: true
  });
});

gulp.task('connect:dist', function () {
  connect.server({
    root: sources.dist,
    port: 8083
  });
});

gulp.task('html', function () {
  return gulp.src(sources.views.concat(sources.index))
    .pipe(connect.reload());
});

gulp.task('js', function () {
  return gulp.src(sources.js)
    .pipe(connect.reload());
});

gulp.task('styles', function () {
  return gulp.src(sources.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false,
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('./.tmp/styles/'))
    .pipe(connect.reload());
});

gulp.task('index:dev', function () {
  return gulp.src('./src/index.html')
    .pipe(inject(gulp.src(sources.js.concat(['!**/spotify-credentials.js', '!**/spotify-credentials-dist.js']), {
      read: false
    })))
    .pipe(inject(gulp.src(sources.jsVendor, { read: false }), { name: 'vendor' }))
    .pipe(gulp.dest('./src/'));
});

gulp.task('index:dist', function () {
  return gulp.src('./src/index.html')
    .pipe(inject(gulp.src(sources.js.concat(['!**/spotify-credentials.js', '!**/spotify-credentials-debug.js']), {
      read: false
    })))
    .pipe(inject(gulp.src(sources.jsVendor, { read: false }), { name: 'vendor' }))
    .pipe(gulp.dest('./src/'));
});

gulp.task('watch', function () {
  gulp.watch(sources.views.concat(sources.index), ['html']);
  gulp.watch(sources.js, ['js']);
  gulp.watch(sources.scss, ['styles']);
});

gulp.task('build-js', function () {
  return gulp.src(sources.js.concat(['!**/spotify-credentials.js']))
    .pipe(concat('bundle.js'))
    .pipe(ngAnnotate({ regexp: '^ng\\.module\\([^\\)]+\\)$' }))
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
    .pipe(rev())
    .pipe(gulp.dest('./dist/scripts/'))
    .pipe(rev.manifest('bundle.manifest'))
    .pipe(gulp.dest('./.tmp'));
});

gulp.task('build-js-vendor', function () {
  return gulp.src(sources.jsVendor)
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
    .pipe(rev())
    .pipe(gulp.dest('./dist/scripts/'))
    .pipe(rev.manifest('vendor.manifest'))
    .pipe(gulp.dest('./.tmp'));
});

gulp.task('build-js-manifest', function () {
  return gulp.src('./dist/index.html')
    .pipe(revReplace({
      manifest: gulp.src('./.tmp/bundle.manifest')
    }))
    .pipe(revReplace({
      manifest: gulp.src('./.tmp/vendor.manifest')
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build-styles', function () {
  return gulp.src(sources.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false,
      browsers: ['last 2 versions']
    }))
    .pipe(minifyCSS({
      keepSpecialComments: false
    }))
    .pipe(rev())
    .pipe(gulp.dest('./dist/styles/'))
    .pipe(rev.manifest('styles.manifest'))
    .pipe(gulp.dest('./.tmp'));
});

gulp.task('build-styles-manifest', function () {
  var manifest = gulp.src('./.tmp/styles.manifest');

  return gulp.src('./dist/index.html')
    .pipe(revReplace({
      manifest: manifest
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build-views', function () {
  return gulp.src(sources.views)
    .pipe(minifyHTML({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(gulp.dest('./dist/views/'));
});

gulp.task('build-index', function () {
  return gulp.src(sources.index)
    .pipe(htmlreplace({
      'js-app': {
        src: 'bundle.js',
        tpl: '<script src="/scripts/%s"></script>'
      },
      'js-vendor': {
        src: 'vendor.js',
        tpl: '<script src="/scripts/%s"></script>'
      }
    }))
    .pipe(minifyHTML({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build-fonts', function () {
  return gulp.src(sources.fonts)
    .pipe(rev())
    .pipe(gulp.dest('./dist/fonts/'))
    .pipe(rev.manifest('fonts.manifest'))
    .pipe(gulp.dest('./.tmp'));
});

gulp.task('build-fonts-manifest', function () {
  var manifest = gulp.src('./.tmp/fonts.manifest');

  return gulp.src('./dist/styles/**/*.css')
    .pipe(revReplace({
      manifest: manifest
    }))
    .pipe(gulp.dest('./dist/styles/'));
});

gulp.task('build:dev', function (cb) {
  return sequence('clean:dev', ['styles', 'index:dev'], cb);
});

gulp.task('build:dist', function (cb) {
  return sequence(['clean:dist', 'index:dist'], ['build-js', 'build-js-vendor', 'build-styles', 'build-fonts', 'build-views', 'build-index'], ['build-fonts-manifest', 'build-styles-manifest'], 'build-js-manifest', cb);
});

gulp.task('serve:dev', function (cb) {
  return sequence('build:dev', ['connect:dev', 'watch'], cb);
});

gulp.task('serve:dist', function (cb) {
  return sequence('build:dist', 'connect:dist', cb);
});
