const gulp = require('gulp')
const concat = require('gulp-concat')
const debug = require('gulp-debug')
const del = require('del')
const autoprefixer = require('gulp-autoprefixer')
const remember = require('gulp-remember')
const path = require('path')
const cached = require('gulp-cached')


gulp.task('styles', () => {
  return gulp.src('frontend/styles/**/*.css')
  .pipe(cached('styles'))
  .pipe(autoprefixer())
  .pipe(remember('styles'))
  .pipe(concat('all.css'))
  .pipe(gulp.dest('public'))
})


gulp.task('watch', () => {
  gulp.watch('frontend/styles/**/*.css', gulp.series('styles')).on('unlink', function(filepath) {
    remember.forget('styles', path.resolve(filepath) )
    delete cached.caches.styles[path.resolve(filepath)]
  })
})

gulp.task('dev', gulp.series('styles', 'watch'))