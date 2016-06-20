import gulp from 'gulp';
import { Server } from 'karma';

import paths from './paths';

gulp.task('test', ['build:dev'], function (done) {
  new Server({
    configFile: __dirname + '/../karma.conf.js',
    files: [
      ...paths.jsVendor,
      'node_modules/angular-mocks/angular-mocks.js',
      // './.tmp/scripts/all.js',
      './src/scripts/**/!(\.spec).js',
      './src/scripts/**/*.spec.js'
    ],
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      // './.tmp/scripts/all.js': ['coverage']
      './src/scripts/**/!(\.spec).js': ['coverage'],
      './src/**/*.js': ['babel']
    },
    coverageReporter: {
      type : 'html',
      dir : './.tmp/coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text', subdir: 'text', file: 'output.txt' },
        { type: 'text-summary' }
      ]
    }
  }, done).start();
});