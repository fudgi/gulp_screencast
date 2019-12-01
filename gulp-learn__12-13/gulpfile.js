//Пример сборки проекта
//Сборка спрайтов из svg

const del = require("del");
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const stylus = require("gulp-stylus");
const browserSync = require("browser-sync").create();
const resolver = require("stylus").resolver;
const svgSprite = require("gulp-svg-sprite");
const gulpIf = require("gulp-if");
const cssnano = require("gulp-cssnano");
const rev = require("gulp-rev");
const revReplace = require("gulp-rev-replace");
const combine = require("stream-combiner2").obj;

const isDevelopment =
  !process.env.NODE_ENV || process.env.NODE_ENV == "development";

gulp.task("styles", function() {
  return gulp
    .src("frontend/styles/index.styl")
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(
      stylus({
        import: process.cwd() + "/tmp/styles/sprite",
        define: {
          url: resolver()
        }
      })
    )
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulpIf(!isDevelopment, combine(cssnano(), rev())))
    .pipe(gulp.dest("public/styles"))
    .pipe(
      gulpIf(
        !isDevelopment,
        combine(rev.manifest("css.json"), gulp.dest("manifest"))
      )
    );
});

gulp.task("clean", function() {
  return del("public");
});

gulp.task("assets", function() {
  return gulp
    .src("frontend/assets/**/*.*", { since: gulp.lastRun("assets") })
    .pipe(
      gulpIf(
        !isDevelopment,
        revReplace({
          manifest: gulp.src("manifest/css.json", { allowEmpty: true })
        })
      )
    )
    .pipe(gulp.dest("public"));
});

gulp.task("styles:assets", function() {
  return gulp
    .src("frontend/styles/**/*.{jpg,png}", {
      since: gulp.lastRun("styles:assets")
    })
    .pipe(gulp.dest("public/styles"));
});

gulp.task("styles:svg", function() {
  return gulp
    .src("frontend/styles/**/*.svg")
    .pipe(
      svgSprite({
        mode: {
          css: {
            dest: ".",
            bust: !isDevelopment,
            sprite: "sprite.svg",
            layout: "vertical",
            prefix: "$",
            dimensions: true,
            render: {
              styl: {
                dest: "sprite.styl"
              }
            }
          }
        }
      })
    )
    .pipe(gulp.dest("public/styles"))
    .pipe(
      gulpIf("*.styl", gulp.dest("tmp/styles"), gulp.dest("public/styles"))
    );
});

gulp.task(
  "build",
  gulp.series("clean", "styles:assets", "styles:svg", "styles", "assets")
);

gulp.task("watch", function() {
  gulp.watch(
    ["frontend/styles/**/*.styl", "tmp/styles/sprite.styl"],
    gulp.series("styles")
  );
  gulp.watch("frontend/assets/**/*.*", gulp.series("assets"));
  gulp.watch("frontend/styles/**/*.{jpg,png}", gulp.series("styles:assets"));
  gulp.watch("frontend/styles/**/*.svg", gulp.series("styles:svg"));
});

gulp.task("serve", function() {
  browserSync.init({
    server: "public"
  });

  browserSync.watch("public/**/*.*").on("change", browserSync.reload);
});

gulp.task("dev", gulp.series("build", gulp.parallel("watch", "serve")));
