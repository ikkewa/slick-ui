'use strict';

var gulp = require('gulp');

var config = require('../config_gulp');

gulp.task('dev', ['serve', 'markup', 'lint', 'watchify'], function() {
  gulp.watch('lib/**/*.js', ['lint', 'browserify']);
  gulp.watch(config.markup.srcPaths, ['markup']);
});
