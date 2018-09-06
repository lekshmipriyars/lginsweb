'use strict';

var gulp = require('gulp');

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('www/styles/*.scss')
    .pipe(wiredep({
        directory: 'www/bower_components'
    }))
    .pipe(gulp.dest('www/styles'));

  gulp.src('www/*.html')
    .pipe(wiredep({
      directory: 'www/bower_components',
      exclude: ['bootstrap-sass-official']
    }))
    .pipe(gulp.dest('www'));
});
