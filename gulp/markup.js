'use strict';

var gulp = require('gulp');
var pug = require('gulp-pug');

var config = require('./config');

gulp.task('markup', function() {
  return gulp.src(config.markup.srcPaths)
    .pipe(pug())
    .pipe(gulp.dest(config.markup.output));
});
