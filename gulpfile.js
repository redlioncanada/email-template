var gulp = require('gulp'),
	sass = require('gulp-sass'),
	inliner = require('gulp-inline-css'),
	include = require('gulp-include'),
	minifyCss   = require('gulp-cssnano'),
	minifyHtml  = require('gulp-htmlmin')

gulp.task('css', function() {
	gulp.src('./app/css/index.scss')
		.pipe(sass())
		.pipe(minifyCss())
		.pipe(gulp.dest('./app/css'))
})

gulp.task('html', function() {
	gulp.src('./app/index.html')
		.pipe(include())
		.pipe(inliner())
		.pipe(minifyHtml())
		.pipe(gulp.dest('./build'))

})

gulp.task('once', ['html', 'css'], function() {})

gulp.task('default', ['once'], function() {
	gulp.watch('./app/**/*', ['html', 'css'])
})