const gulp = require('gulp')
const stylus = require('gulp-stylus')
const concat = require('gulp-concat')
const debug = require('gulp-debug')
const sourcemaps = require('gulp-sourcemaps')
const gulpIf = require('gulp-if')
const del = require('del')
const newer = require('gulp-newer')

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('styles', () => {
  return gulp.src('frontend/styles/**/main.styl')
  .pipe(gulpIf(isDevelopment, sourcemaps.init()))
  .pipe(debug({title: 'src'}))
  .pipe(stylus())
  .pipe(debug())
  .pipe(concat('all.css'))
  .pipe(gulpIf(isDevelopment, sourcemaps.write()))
  .pipe(gulp.dest('public'))
})

gulp.task('styles:env', () => {
  let pipeline = gulp.src('frontend/styles/main.styl');
  if(isDevelopment) pipeline = pipeline.pipe(sourcemaps.init())
  pipeline = pipeline.pipe(stylus())
  if(isDevelopment) pipeline = pipeline.pipe(sourcemaps.write())
  return pipeline.pipe(gulp.dest('public'))
})

gulp.task('clean', function(){
  return del('public')
})

gulp.task('assets', function(){
  return gulp.src('frontend/assets/**', {since: gulp.lastRun('assets')})
    .pipe(newer('public'))
    .pipe(debug({title: 'assets'}))
    .pipe(gulp.dest('public'))
})

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'assets')))

gulp.task('watch', () => {
  gulp.watch('frontend/styles/**/*.*', gulp.series('styles'))
  gulp.watch('frontend/assets/**/*.*', gulp.series('assets'))
})

gulp.task('dev', gulp.series('build', 'watch'))