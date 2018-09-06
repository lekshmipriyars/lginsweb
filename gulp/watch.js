'use strict';

var gulp = require('gulp');

gulp.task('watch', ['wiredep', 'styles'] ,function () {
  gulp.watch('www/css/**/*.scss', ['styles']);
  gulp.watch(['www/js/**/*.js'], ['scripts']);
  gulp.watch('www/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
