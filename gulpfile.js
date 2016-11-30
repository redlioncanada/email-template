require('events').EventEmitter.prototype._maxListeners = 100;
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	inliner = require('gulp-inline-css'),
	include = require('gulp-include'),
	minifyCss = require('gulp-cssnano'),
	minifyHtml = require('gulp-htmlmin'),
	merge = require('merge-stream'),
	flatten = require('gulp-flatten'),
	replace = require('gulp-replace'),
	config = require('./app/config.json'),
	del = require('del')

/* main tasks start */
gulp.task('once', ['html'], function() {})

gulp.task('default', ['once'], function() {
	gulp.watch('./app/css/**/*.scss', ['html'])
	gulp.watch('./app/index.html', ['html'])
	gulp.watch('./app/assets/**/*', ['html'])
})
/* main tasks end */

/* sub tasks start */
gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('assets', ['clean'], function() {
	var tasks = []

	for (var language in config.text) {
		tasks.push(
			gulp.src(['./app/assets/*.*', `./app/assets/${language}/**/*`])
				.pipe(flatten())
				.pipe(gulp.dest(`./build/${language}`)).on('error', handleError)
		)
	}

	return merge(tasks)
})

gulp.task('css', ['assets'], function() {
	return gulp.src('./app/css/index.scss')
		.pipe(sass()).on('error', handleError)
		.pipe(minifyCss())
		.pipe(gulp.dest('./build/temp'))
})

gulp.task('html', ['css'], function() {
	delete require.cache[require.resolve('./app/config.json')] //refresh config.json
	var tasks = []

	for (var language in config.text) {
		var html = gulp.src('./app/index.html')
			.pipe(include())
			.pipe(inliner({
				preserveMediaQueries: true
			}))

		for (var key in config.text[language]) {
			var value = config.text[language][key]
			html.pipe(replace(`{${key}}`, value))
		}

		html.pipe(minifyHtml({
				removeComments: true,
				collapseWhitespace: true
			})).on('error', handleError)
			.pipe(gulp.dest(`./build/${language}`))

		tasks.push(html)
	}

	return merge(tasks)
})
/* sub tasks end */

function handleError(err) {
	console.error(err.message || err.msg || err)
}