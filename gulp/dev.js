'use strict';

var gulp = require('gulp');

var config = require('../config_gulp');

gulp.task('dev', ['serve', 'markup', 'watchify'], function() {
  gulp.watch('lib/**/*.js', ['browserify']);
  gulp.watch(config.markup.srcPaths, ['markup']);
});
