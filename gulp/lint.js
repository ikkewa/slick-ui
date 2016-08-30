var gulp = require('gulp');
var eslint = require('gulp-eslint');

var config = require('./config');

gulp.task('lint', function() {
  return gulp.src(config.lint.paths)
             .pipe(eslint())
             .pipe(eslint.format())
             .pipe(eslint.failAfterError());
});

