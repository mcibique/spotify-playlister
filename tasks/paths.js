'use strict';

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
  templates: ['src/scripts/states/**/*.html', 'src/views/**/*.html'],
  jsVendor: [
    'bower_components/es6-shim/es6-shim.js',
    'bower_components/es6-shim/es6-sham.js',
    'bower_components/jquery/dist/jquery.js',
    'bower_components/jquery-ui/ui/core.js',
    'bower_components/jquery-ui/ui/widget.js',
    'bower_components/jquery-ui/ui/mouse.js',
    'bower_components/jquery-ui/ui/slider.js',
    'bower_components/perfect-scrollbar/js/perfect-scrollbar.jquery.js',
    'bower_components/sweetalert/dist/sweetalert-dev.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angular-ui-slider/src/slider.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js'
  ]
};

module.exports = paths;
