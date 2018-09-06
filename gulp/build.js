'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var gzip = require('gulp-gzip');
var args = require('yargs').argv;

var environment = args.env || 'development';
var override = args.use || 'base';

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license']
});

function handleError(err) {
    console.error(err.toString());
    this.emit('end');
}

gulp.task('styles', function () {
    return gulp.src(['www/css/*.scss', 'www/css/*.css'])
        .pipe($.sass({style: 'expanded'}))
        .on('error', handleError)
        .pipe($.autoprefixer('last 1 version'))
        .pipe($.csso())
        .pipe(gulp.dest('.tmp/css'))
        .pipe($.size());
});

gulp.task('scripts', function () {
    var src = ['www/js/**/*.js'];
    if (override !== 'base') {
        src.push('overrides/' + override + '/www/js/**/*.js');
    }
    return gulp.src(src)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.size());
});

gulp.task('partials', function () {
    var src = ['www/templates/**/*.html', 'www/js/**/*.html'];
    if (override !== 'base') {
        src.push('overrides/' + override + '/www/templates/**/*.html');
        src.push('overrides/' + override + '/www/js/**/*.html');
    }

    return gulp.src(src)
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.ngHtml2js({
            moduleName: 'learnerGuru',
            prefix: 'templates/'
        }))
        .pipe(gulp.dest('.tmp/templates'))
        .pipe($.size());
});

gulp.task('html', ['styles', 'scripts', 'partials'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;

    var src = ['www/*.html'];
    if (override !== 'base') {
        src = ['overrides/' + override + '/www/*.html'];
    }

    return gulp.src(src)
        .pipe($.inject(gulp.src('.tmp/templates/**/*.js'), {
            read: false,
            starttag: '<!-- inject:partials -->',
            addRootSlash: false,
            addPrefix: '../'
        }))
        .pipe(assets = $.useref.assets())
        .pipe($.rev())
        .pipe(jsFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
        .pipe($.replace('js/directives', 'templates/directives'))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.replace('bower_components/bootstrap-sass-official/assets/fonts/bootstrap', 'fonts'))
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

// Image Compression Step
gulp.task('images', function () {
    return gulp.src(['www/images/**/*'])
        /*.pipe($.cache($.imagemin({
         optimizationLevel: 3,
         progressive: true,
         interlaced: true
         })))*/
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});

gulp.task('audio', function () {
    return gulp.src(['www/audio/**/*'])
        .pipe(gulp.dest('dist/audio'));
});

gulp.task('fonts', function () {
    return gulp.src(['www/fonts/**/*'])
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('css', function () {
    return gulp.src(['www/css/**/*.css'])
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('seo', function () {
    return gulp.src(['www/robots.txt', 'www/sitemap.xml'])
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist'], {read: false}).pipe($.rimraf());
});

gulp.task('build-without-compression', ['seo', 'html', 'css', 'partials', 'images', 'fonts', 'audio'], function () {
});

gulp.task('build', ['seo', 'html', 'css', 'partials', 'images', 'fonts', 'audio'], function () {
    return gulp.src(['dist/**/*.js', 'dist/**/*.css'])
        .pipe(gzip({append: false}))
        .pipe(gulp.dest('dist'))
});
