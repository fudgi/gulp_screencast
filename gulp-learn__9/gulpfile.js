'use strict'

const gulp = require('gulp')
const through2 = require('through2').obj
const File = require('vinyl')

gulp.task('manifest:1', function() {
  const mtimes = {}
  return gulp.src('frontend/assets/**/*.*')
  .pipe(through2(
    function (file, enc , callback) {
      mtimes[file.relative] = file.stat.mtime
      callback(null, file)
    },
    function(callback) {
      let manifest = new File({
        contents: new Buffer(JSON.stringify(mtimes)),
        base: process.cwd(),
        path: process.cwd() + '/manifest.json'
      });
      this.push(manifest)
      callback()
    }))
  .pipe(gulp.dest('public'))
})

gulp.task('manifest:2', () => {
  const mtimes = {}
  return gulp.src('frontend/assets/**/*.*')
    .pipe(through2(
      function(file, enc, callback ) {
        mtimes[file.relative] = file.stat.mtime;
        callback(null, file)
      }
    ))
    .pipe(gulp.dest('public'))
    .pipe(through2( 
      function(file, enc, callback){
        callback()
      },
      function(callback){
        let manifest = new File({
          contents: new Buffer(JSON.stringify(mtimes)),
          base: process.cwd(),
          path: process.cwd() + '/manifest.json'
        });
        this.push(manifest)
        callback()
      }
    ))
    .pipe(gulp.dest('.'))
})

gulp.task('clone', function() {
  return gulp.src('frontend/assets/**/*.*')
  .pipe(through2(function (file, enc , callback) {
    let file2 = file.clone()
    file2.path += '.back'
    this.push(file2)
    callback(null, file)
  }))
  .pipe(gulp.dest('public'))
})