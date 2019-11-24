'use strict'

const gulp = require('gulp')
const stylus = require('gulp-stylus')
const concat = require('gulp-concat')
const debug = require('gulp-debug')
const sourcemaps = require('gulp-sourcemaps')
const gulpIf = require('gulp-if')
const del = require('del')
const browserSync = require('browser-sync').create()
const notify  = require('gulp-notify')
const plumber = require('gulp-plumber')
const multipipe = require('multipipe')

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('styles', () => {
  return gulp.src('frontend/styles/**/main.styl')
  .pipe(plumber({
    errorHangler: notify.onError(function(err) {
        return{
          title: 'Styles',
          message: err.message
        }
  })}))
  .pipe(gulpIf(isDevelopment, sourcemaps.init()))
  .pipe(debug({title: 'src'}))
  .pipe(stylus())
  //---------------------------------------------
  // .on('error', function(err) {
  //   console.log(err.message)
  //   this.end()
  // })
  //---------------------------------------------
  // .on('error', notify.onError(function(err) {
  //   return{
  //     title: 'Styles',
  //     message: err.message
  //   }
  // }))
  .pipe(concat('main.css'))
  .pipe(gulpIf(isDevelopment, sourcemaps.write()))
  .pipe(gulp.dest('public'))
})

gulp.task('styles:multipipe', () => 
  multipipe(
    gulpIf(isDevelopment, sourcemaps.init()),
    stylus(),
    concat('main.css'),
    gulpIf(isDevelopment, sourcemaps.write()),
    gulp.dest('public'),
  ).on('error', notify.onError)
)


gulp.task('clean', function(){
  return del('public')
})

gulp.task('assets', function(){
  return gulp.src('frontend/assets/**', {since: gulp.lastRun('assets')})
    .pipe(debug({title: 'assets'}))
    .pipe(gulp.dest('public'))
})

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'assets')))

gulp.task('watch', () => {
  gulp.watch('frontend/styles/**/*.*', gulp.series('styles'))
  gulp.watch('frontend/assets/**/*.*', gulp.series('assets'))
})


gulp.task('serve', function(){
  browserSync.init({
    server:'public'
  });
  browserSync.watch('public/**/*.*').on('change', browserSync.reload)
})

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')))