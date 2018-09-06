'use strict';

var gulp = require('gulp');
var s3 = require("gulp-s3");
var fs = require('fs');
var gzip = require('gulp-gzip');
var args   = require('yargs').argv;
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');

var domain = args.use || args.env || 'development';

require('require-dir')('./gulp');

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});


gulp.task('publish',['build'], function() {
  var opts = {
    conditionals: true,
    spare:true
  };
  var optionsCache = { headers: {'Cache-Control': 'max-age=3600000, no-transform, public'} };
  var optionsNoCache = { headers: {'Cache-Control': 'max-age=0, no-transform, public'} };
  var optionsHTML = { headers: {'Cache-Control': 'max-age=36000, no-transform, public', 'Content-Type' : 'text/html', 'Content-Encoding': 'gzip'} };
  var optionsCSS = { headers: {'Cache-Control': 'max-age=3600000, no-transform, public', 'Content-Type' : 'text/css', 'Content-Encoding': 'gzip'} };
  var optionsJS = { headers: {'Cache-Control': 'max-age=3600000, no-transform, public', 'Content-Type' : 'text/javascript', 'Content-Encoding': 'gzip'} };
  var awsKeys = JSON.parse(fs.readFileSync('./aws-'+domain+'.json'));

  for(var key in awsKeys) {
    var aws = awsKeys[key];

    gulp.src(['./dist/**/*', '!./dist/*.html', '!./dist/**/*.css', '!./dist/**/*.js', '!./dist/robots.txt', '!./dist/sitemap.xml'])
        .pipe(s3(aws, optionsCache));

    gulp.src(['./dist/robots.txt', './dist/sitemap.xml'])
        .pipe(s3(aws, optionsNoCache));

    gulp.src(['./dist/*.html'])
        .pipe(gzip({append: false, level: 9}))
        //.pipe(minifyHTML(opts))
        .pipe(s3(aws, optionsHTML));

    gulp.src(['./dist/**/*.css'])
        .pipe(s3(aws, optionsCSS));

    gulp.src(['./dist/**/*.js'])
        //.pipe(uglify())
        .pipe(s3(aws, optionsJS));
  }
});
