//Написание более сложного модуля с through2
//Линтер js

const gulp = require("gulp");
const eslint = require("gulp-eslint");
const debug = require("gulp-debug");
const through2 = require("through2").obj;
const fs = require("fs");
const gulpIf = require("gulp-if");
const combiner = require("stream-combiner2").obj;

gulp.task("lint", function() {
  let eslinResults = {};

  let cacheFilePath = process.cwd() + "/tmp/lintCache.json";

  try {
    eslinResults = JSON.parse(fs.readFileSync(cacheFilePath));
  } catch (e) {}

  return gulp
    .src("frontend/**/*.js", { read: false })
    .pipe(debug({ title: "src" }))
    .pipe(
      gulpIf(
        function(file) {
          eslinResults[file.path] &&
            eslinResults[file.path].mtime == file.stat.mtime.toJSON();
        },
        through2(function(file, enc, callback) {
          file.eslint = eslinResults[file.path].eslint;
          callback(null, file);
        }),
        combiner(
          through2(function(file, enc, callback) {
            file.contents = fs.readFileSync(file.path);
            callback(null, file);
          }),
          eslint(),
          through2(function(file, enc, callback) {
            eslinResults[file.path] = {
              eslint: file.eslint,
              mtime: file.stat.mtime
            };
            callback(null, file);
          })
        )
      )
    )
    .pipe(eslint.format())
    .on("end", function() {
      fs.writeFileSync(cacheFilePath, JSON.stringify(eslinResults));
    });
});
