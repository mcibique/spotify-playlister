/**
 * paths
 */
export default {
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
  templates: [
    'src/scripts/states/**/*.html',
    'src/views/**/*.html'
  ],
  jsVendor: [
    'node_modules/es6-shim/es6-shim.js',
    'node_modules/es6-shim/es6-sham.js',
    'node_modules/jquery/dist/jquery.js',
    'node_modules/perfect-scrollbar/dist/js/perfect-scrollbar.jquery.js',
    'node_modules/sweetalert/dist/sweetalert-dev.js',
    'node_modules/angular/angular.js',
    'node_modules/angular-ui-router/release/angular-ui-router.js',
    'node_modules/angularjs-slider/dist/rzslider.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js'
  ]
};
