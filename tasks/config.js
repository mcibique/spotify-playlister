/* eslint-disable angular/json-functions */

'use strict';

import extend from 'node.extend';
import fs from 'fs';
import path from 'path';

import gulp from 'gulp';
import beautify from 'gulp-jsbeautifier';
import ngConstanst from 'gulp-ng-constant';
import rename from 'gulp-rename';

import paths from './paths';

function generateConfig(environment) {
  const defaultConfigPath = paths.config;
  const envConfigPath = defaultConfigPath.replace(/\.json$/i, `.${environment}.json`);
  let defaultConfig = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8'));

  if (fs.existsSync(envConfigPath)) {
    let envConfig = JSON.parse(fs.readFileSync(envConfigPath, 'utf8'));
    extend(true, defaultConfig, envConfig);
  }

  return ngConstanst({
    stream: true,
    name: 'playlister.config',
    space: ' ',
    templatePath: './templates/config.template',
    constants: {
      config: defaultConfig
    }
  })
  .pipe(rename('config.js'))
  .pipe(beautify({
    indent_size: 2,
    indent_char: ' ',
    eol: '\r\n',
    end_with_newline: true
  }))
  .pipe(gulp.dest(path.join(paths.src, 'scripts')));
}

/**
 * config.js
 */
gulp.task('config:dev', () => {
  return generateConfig('dev');
});

gulp.task('config:dist', () => {
  return generateConfig('dist');
});
