/* const browserSync = require('browser-sync');
const reload = browserSync.reload; */
const gulp = require('gulp');
const { init, reload } = require('browser-sync');

gulp.task('clean', () => {
  return gulp.src('web/bundle.js', {read: false})
     .pipe(gclean());
});


gulp.task('serve', _ => {
  
  init({
    server: {
      baseDir: './',
      port: 8087
    }
  });

  gulp.watch(['text-correction-parser.js', 'index.html'], reload);
  
});