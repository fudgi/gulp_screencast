//понимание потоков
//буфер на 16 элементов
let gulp = require("gulp");
let through2 = require("through2").obj;

gulp.task("default", callback => {
  gulp
    .src("node_modules/**/*.*")
    .pipe(
      through2((file, enc, cb) => {
        //16 файлов в буфере
        console.log(file.relative);
        cb(null, file);
      })
    )
    .resume() //!!
    .on("end", callback);
});
