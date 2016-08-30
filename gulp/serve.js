'use strict';

var gulp = require('gulp');
var serve = require('gulp-serve');

var config = require('./config');

gulp.task('serve', serve(config.serve.entryPoint));
