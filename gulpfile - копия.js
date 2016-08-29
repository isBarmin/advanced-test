'use strict';

var gulp         = require('gulp');
var pug          = require('gulp-pug');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename       = require('gulp-rename');
var sourcemaps   = require('gulp-sourcemaps');
var plumber      = require('gulp-plumber');
var clean        = require('gulp-clean');
var notify       = require('gulp-notify');
var wiredep      = require('gulp-wiredep');
var useref       = require('gulp-useref');
var browserSync  = require('browser-sync').create();
var reload       = require('browser-sync').reload;





gulp.task('pug', function() {
	return gulp.src('app/pug/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('dist'));
});


gulp.task('css', function() {
	return gulp.src('app/scss/main.scss')
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'Styles',
					message: err.message
				}
			})
		}))
		.pipe(sourcemaps.init())
			.pipe( sass({outputStyle: 'expanded'}) )
			.pipe(autoprefixer({
				browsers: ['last 2 versions', '> 1%', 'IE 9']
			}))
		.pipe( sourcemaps.write('.') )
		.pipe( gulp.dest('dist/css') )
		.pipe(reload({stream: true}));
});


gulp.task('js', function() {
	return gulp.src('app/js/**/*.js')
		.pipe(gulp.dest('dist/js'))
		.pipe(reload({stream: true}));
});


gulp.task('html', ['pug'], function() {
	return gulp.src('app/*.html')
		.pipe(wiredep({
			directory: 'app/bower'
		}))
		.pipe(useref())
		.pipe(gulp.dest('dist'))
		.pipe(reload({stream: true}));
});


gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});



gulp.task('clean', function() {
  return gulp.src('dist')
    .pipe( clean() )
});



gulp.task('serve', function() {
	return browserSync.init({
		notify: false,
		server: {
			baseDir: 'dist',
		},
		port: 9000,
		tunnel: 'mysite',
	});
});




gulp.task('dev', ['css', 'js', 'html', 'fonts']);

gulp.task('watch', function() {
	gulp.watch('app/scss/**/*.scss', ['css']);
	gulp.watch('app/js/**/*.js', ['js']);
	gulp.watch(['bower.json', 'app/pug/*.pug'], ['html']);
	// gulp.watch('app/**/*.*').on('change', browserSync.reload);
});






gulp.task('default', ['dev', 'serve', 'watch']);
