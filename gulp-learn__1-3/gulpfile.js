//Знакомство
const gulp = require("gulp");

gulp.task("default", function() {
  return gulp
    .src(["source/**/*.css", "source/**/*.js"])
    .on("data", function(file) {
      console.log(file);
    })
    .pipe(
      gulp.dest(function(file) {
        return file.extname == ".js"
          ? "js"
          : file.extname == ".css"
          ? "css"
          : "dest";
      })
    );
});
