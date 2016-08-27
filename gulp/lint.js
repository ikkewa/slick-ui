var gulp = require('gulp');
var eslint = require('gulp-eslint');

var config = require('../config_gulp');

gulp.task('lint', function() {
  return gulp.src(config.lint.paths)
             .pipe(eslint())
             .pipe(eslint.format())
             .pipe(eslint.failAfterError());
});

