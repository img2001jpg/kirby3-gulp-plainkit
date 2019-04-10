const gulp         = require('gulp'),
      php          = require('gulp-connect-php'),
      browserSync  = require('browser-sync'),
      plumber      = require('gulp-plumber'),
      watch        = require('gulp-watch'),
      autoprefixer = require('gulp-autoprefixer'),
      uglifycss    = require('gulp-uglifycss'),
      terser       = require('gulp-terser'),
      concat       = require('gulp-concat'),
      rename       = require('gulp-rename'),
      sass         = require('gulp-sass');

gulp.task('serve', function() {
  php.server({
    base: './dist/',
    port: 8080,
    keepalive: true,
    router: './dist/kirby/router.php'
  }, function() {
    browserSync({
     proxy: '127.0.0.1:8080'
    });
  });
  // watch .scss file
  gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
  // watch js
  gulp.watch('src/scripts/**/*.js', gulp.series('scripts'));
  // watch php files
  gulp.watch('./dist/site/**/*.php').on('change', function () {
    browserSync.reload();
  });
  gulp.watch('./dist/content/**/*.txt').on('change', function () {
    browserSync.reload();
  });
  gulp.watch('./dist/site/**/*.yml').on('change', function () {
    browserSync.reload();
  });
});

function showError(error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(terser().on('error', showError))
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe(browserSync.reload({
       stream: true
     }));
});

gulp.task('sass', function() {
  return gulp.src('src/scss/**/*.scss')
     .pipe(sass().on('error', showError))
     .pipe(autoprefixer({
       browsers: ['last 2 versions']
     }))
     .pipe(concat('main.css'))
     .pipe(gulp.dest('./dist/assets/css'))
     .pipe(rename({ suffix: '.min' }))
     .pipe(uglifycss().on('error', showError))
     .pipe(gulp.dest('dist/assets/css'))
     .pipe(browserSync.reload({
        stream: true
      }));
});

gulp.task('default', gulp.series('serve'));
