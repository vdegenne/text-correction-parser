'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
const reload = browserSync.reload;


gulp.task('serve', () => {

  browserSync.init({
    server: './'
  });

  //gulp.watch('./**/*', reload);
});