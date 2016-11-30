var gulp = require('gulp'),
	sass = require('gulp-sass'),
	inliner = require('gulp-inline-css'),
	include = require('gulp-include'),
	minifyCss   = require('gulp-cssnano'),
	minifyHtml  = require('gulp-htmlmin')

gulp.task('css', function() {
	gulp.src('./app/css/index.scss')
		.pipe(sass()).on('error', handleError)
		.pipe(minifyCss())
		.pipe(gulp.dest('./app/css'))
})

gulp.task('html', function() {
	gulp.src('./app/index.html')
		.pipe(include())
		.pipe(inliner())
		.pipe(minifyHtml()).on('error', handleError)
		.pipe(gulp.dest('./build'))

})

gulp.task('assets', function() {
	gulp.src('./app/assets/**/*')
		.pipe(gulp.dest('./build')).on('error', handleError)
})

gulp.task('once', ['html', 'css', 'assets'], function() {})

gulp.task('default', ['once'], function() {
	gulp.watch('./app/css/**/*.scss', ['html', 'css'])
	gulp.watch('./app/index.html', ['html', 'css'])
	gulp.watch('./app/assets/**/*', ['assets'])
})

function handleError(err) {
	console.error(err.message || err.msg || err)
}