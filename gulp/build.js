'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var merge = require('utils-merge');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var chalk = require('chalk');

var config = require('../config_gulp');

function map_error(err) {
  var msg = '';
  if(err.fileName) {
    // regular error
    msg += chalk.red(err.name);
    msg += ': ' + chalk.yellow(err.fileName.replace(__dirname + '/lib/'));
    msg += '; Line ' + chalk.magenta(err.lineNumber);
    msg += ' & Column ' + chalk.magenta(err.columnNumber || err.column);
    msg += '; ' + chalk.blue(err.description);
  } else {
    // browserify error
    msg += chalk.red(err.name);
    msg += ': ' + chalk.yellow(err.message);
  }

  gutil.log(msg);

  this.emit('end');
}

function getBundle(bundler) {

  var bundle = function() {
    return bundler
      .bundle()
      .on('error', map_error)
      .pipe(source(config.build.buildFile))
      .pipe(buffer())
      .pipe(gulp.dest(config.build.buildFolder))
      .pipe(rename(config.build.buildMinFile))
      //.pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      //.pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.build.buildFolder))
  };

  return bundle;
}

gulp.task('browserify', function() {

  var bundler = browserify({
    cache: {},
    packageCache: {},
    fullPaths: false,
    entries: config.build.entryPoint
  }).transform("babelify", {presets: ["es2015"]});

  var bundle = getBundle(bundler);

  return bundle();
});


gulp.task('watchify', function() {
  var bundler = browserify({
    cache: {},
    packageCache: {},
    fullPaths: false,
    entries: config.build.entryPoint
  }).transform("babelify", {presets: ["es2015"]});

  var bundle = getBundle(bundler);

  bundler = watchify(bundler);
  bundler.on('update', bundle);

  return bundle();
});
