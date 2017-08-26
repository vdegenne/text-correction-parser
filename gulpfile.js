/* const browserSync = require('browser-sync');
const reload = browserSync.reload; */
const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const { init, reload } = require('browser-sync');

gulp.task('clean', () => {
  return gulp.src('web/bundle.js', {read: false})
     .pipe(gclean());
});

gulp.task('uglify', _ => {
  return gulp.src('text-correction-parser.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(rename('text-correction-parser.min.js'))
    .pipe(gulp.dest('.'));
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