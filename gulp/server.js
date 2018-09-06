'use strict';

var gulp = require('gulp');

var browserSync = require('browser-sync');
var httpProxy = require('http-proxy');

/* This configuration allow you to configure browser sync to proxy your backend */
var proxyTarget = 'http://server/context/'; // The location of your backend

var proxy = httpProxy.createProxyServer({
  target: proxyTarget
});

/* proxyMiddleware forwards static file requests to BrowserSync server
 and forwards dynamic requests to your real backend */
function proxyMiddleware(req, res, next) {
  if (/\.(html|css|js|png|jpg|jpeg|gif|ico|xml|rss|txt|eot|svg|ttf|woff)(\?((r|v|rel|rev)=[\-\.\w]*)?)?$/.test(req.url)) {
    next();
  } else {
    proxy.web(req, res);
  }
}

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  browserSync.instance = browserSync.init(files, {
    startPath: '/index.html',
    server: {
      baseDir: baseDir,
      //middleware: proxyMiddleware
    },
    browser: browser
  });

}

gulp.task('serve', ['watch'], function () {
  browserSyncInit([
    'www',
    '.tmp'
  ], [
    'www/*.html',
    'www/css/**/*.css',
    '.tmp/css/**/*.css',
    'www/js/**/*.js',
    'www/templates/**/*.html',
    'www/images/**/*'
  ]);
});

gulp.task('serve:dist', ['build-without-compression'], function () {
  browserSyncInit('dist');
});

gulp.task('serve:e2e', function () {
  browserSyncInit(['app', '.tmp'], null, []);
});

gulp.task('serve:e2e-dist', ['watch'], function () {
  browserSyncInit('dist', null, []);
});
