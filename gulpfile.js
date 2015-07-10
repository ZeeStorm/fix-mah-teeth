var gulp = require( 'gulp' );
var babelify = require( 'babelify' );
var browserify = require( 'browserify' );
var source = require( 'vinyl-source-stream' );
var buffer = require( 'vinyl-buffer' );

var plugins = require( 'gulp-load-plugins' )();

/** credit to: http://cameronjroe.com/code/angular-movie-search/ **/
// Server
// ----------------------------------------
gulp.task('server', function() {
	return gulp.src('./dist')
		.pipe(plugins.webserver({
			livereload: true
		}));
});

// Styles
// ----------------------------------------
gulp.task('styles', function() {
	return gulp.src('app/styles/**/*.scss')
		.pipe(plugins.sourcemaps.init())
			.pipe(plugins.sass())
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest('app/styles'));
});

// Clean
// ----------------------------------------
gulp.task('clean', function () {
	return gulp.src('dist')
		.pipe(plugins.clean());
});

// Vendor Libs
// ----------------------------------------
gulp.task('vendorjs', ['clean', 'styles'], function () {
	return gulp.src('./app/*.html')
		.pipe(plugins.usemin({
			//html: [plugins.minifyHtml()],
			//vendorjs: [plugins.uglify()]
		}))
		.pipe(gulp.dest('dist'));
});

// Pipeline - copying files, browserify
// ----------------------------------------
gulp.task('pipeline', ['vendorjs'], function () {

	gulp.src(['./app/views/**'], {
			base: './app'
		})
		.pipe(gulp.dest('dist'));

	return browserify('./app/scripts/init.js')
		.bundle()
		.pipe(source('init.js'))
		.pipe(buffer())
		//.pipe(plugins.uglify())
		.pipe(gulp.dest('dist/scripts'));
});

// Test
// ----------------------------------------
gulp.task('test', function() {
	return gulp.src('./tests')
		.pipe(plugins.karma({
			configFile: 'test/karma.conf.js',
			action: 'watch'
		})).on('error', function(err) {
			this.emit('end'); //instead of erroring the stream, end it
		});
});

// Watchers
// -------------------------------------------------
gulp.task('watch', ['server', 'pipeline'], function() {
	gulp.watch([
		'app/index.html',
		'app/views/**/*.html',
		'app/scripts/**/*.js',
		'app/styles/**/*.scss'
	], ['pipeline']);
});