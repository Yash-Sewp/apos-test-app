var gulp = require('gulp')
	jshint = require('gulp-jshint'),
	sass = require('gulp-sass'),
	sassMain = require('gulp-sass-main'),
	rename = require('gulp-rename'),
	nodemon = require('gulp-nodemon'),
	babel = require('gulp-babel');
	

gulp.task('babel', function () {
	var requiredFiles = ['lib/modules/**/*.js', '!src/**/*.js'];
	return gulp.src(requiredFiles)
		   .pipe(babel({presets: ['@babel/preset-env'] })) 
		   .pipe(gulp.dest('lib/modules'));
});

gulp.task('scss', function () {
	return gulp.src(['src/site.scss', 'lib/modules/**/*.scss'], { read: false })
			.pipe(sassMain())
			.pipe(rename('scss-build.scss'))
			.pipe(sass().on('error', sass.logError))
			.pipe(rename('scss-build.less'))
			.pipe(gulp.dest('lib/modules/apostrophe-assets/public/css'));
});

gulp.task('build', gulp.series('scss', 'babel'));

gulp.task('watch', function () {
	nodemon({
		"verbose": true,
		"watch": [
			"app.js",
			'lib/modules/**/*.js',
			'lib/modules/**/*.scss',
			'src/bootstrap-theme/*.scss',
			'src/custom/*.scss',
			'src/site.scss'
		],
		"ext": "js json less"
	});
	gulp.watch(['lib/modules/**/*.scss', 'src/bootstrap-theme/*.scss', 'lib/modules/**/*.js','src/custom/*.scss', 'src/site.scss'], gulp.series('build'));
});