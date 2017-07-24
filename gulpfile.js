'use strict';

const gulp = require('gulp-npm-run')(require('gulp'));
const gclean = require('gulp-clean');
const run = require('gulp-run');
const browserSync = require('browser-sync');
const reload = browserSync.reload;


gulp.task('clean', () => {
  return gulp.src('web/bundle.js', {read: false})
     .pipe(gclean());
});


gulp.task('serve', () => {
  
  browserSync({
    server: {
      baseDir: './',
      port: 3005
    }
  });

  gulp.watch(['text-correction-parser.js', 'index.html'], refreshing);
  
});

function refreshing () {
  new run.Command('npm run build').exec('test');
}