'use strict';

var gulp         = require('gulp');
var del          = require('del');
var watch        = require('gulp-watch');
var pug          = require('gulp-pug');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
// var rename       = require('gulp-rename');
var sourcemaps   = require('gulp-sourcemaps');
var plumber      = require('gulp-plumber');
var notify       = require('gulp-notify');
var wiredep      = require('gulp-wiredep');
var useref       = require('gulp-useref');
var imagemin     = require('gulp-imagemin');
var pngquant     = require('imagemin-pngquant');
// var cache        = require('gulp-cache');
var browserSync  = require('browser-sync');
var reload       = browserSync.reload;






gulp.task('html', function() {
  gulp.src('app/pug/**/*.pug')
    .pipe(wiredep({
      directory: 'app/bower'
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(useref())
    .pipe(gulp.dest('dist'))
    .pipe(reload({stream: true}));
});


gulp.task('js', function() {
  gulp.src('app/js/**/*.js')
    .pipe(gulp.dest('dist/js'))
    .pipe(reload({stream: true}));
});


gulp.task('css', function() {
 return gulp.src('app/scss/main.scss')
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: 'css',
          message: err.message
        };
      })
    }))
    .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'expanded'
      }))
      .pipe(autoprefixer({
        browsers: ['last 2 versions', '> 1%', 'IE 9']
      }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(reload({stream: true}));
});


gulp.task('img', function() {
  gulp.src('app/img/**/*')
   .pipe(imagemin({
     progressive: true,
     svgoPlugins: [{removeViewBox: false}],
     use: [pngquant()],
     interlaced: true
   }))
   .pipe(gulp.dest('dist/img'))
   .pipe(reload({stream: true}));
});


gulp.task('fonts', function() {
  gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});


// Очистка папки
gulp.task('clean', function() {
  return del('dist');
});


gulp.task('webserver', function() {
  browserSync({
    notify: false,
    server: {
      baseDir: "dist"
    },
    tunnel: true,
    port: 9000
  });
});


gulp.task('build', ['clean'], function() {
  gulp.start(['html', 'js', 'css', 'img', 'fonts']);
});


gulp.task('watch', function() {
  gulp.watch(['bower.json', 'app/pug/**/*.pug'], ['html']);
  gulp.watch('app/scss/**/*.scss', ['css']);
  gulp.watch('app/js/**/*.js', ['js']);
  gulp.watch('app/img/**/*', ['img']);
  gulp.watch('app/fonts/**/*', ['fonts']);
});


gulp.task('default', ['build', 'watch', 'webserver']);