var gulp = require('gulp'),
	less = require('gulp-less'),
	browsersync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	del = require('del'),
	autoprefixer = require('gulp-autoprefixer'),
	babel = require('gulp-babel'),
	sourcemaps = require('gulp-sourcemaps');
imagemin = require('gulp-imagemin');


function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: "./app"
		},
		port: 3000
	});
	done();
}

// BrowserSync Reload
function browserSyncReload(done) {
	browsersync.reload();
	done();
}

function css() {
	return gulp
		.src('app/less/*.less')
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(cssnano())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('app/css'))
		.pipe(browsersync.stream());
}


// Lint scripts
function scriptsLint() {
	return gulp
		.src(["./assets/js/**/*", "./gulpfile.js"])
		.pipe(plumber())
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
}

function scripts() {
	return gulp
		.src('app/js/scripts.js')
		.pipe(concat('scripts.min.js'))
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(gulp.dest('app/js/'))
		.pipe(browsersync.stream());
}

// js
function libsjs() {
	return gulp
		.src([
			'app/libs/jquery/jquery-1.11.1.min.js',
			'app/libs/slick/slick.min.js',
		])
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
		.pipe(browsersync.stream());
}

// less
function libscss() {
	return gulp
		.src([
			'app/libs/slick/slick.css',
		])
		.pipe(concat('libs.min.css'))
		.pipe(cssnano())
		.pipe(gulp.dest('app/css/'))
}

function imgMin() {
	return gulp
		.src('app/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'))
}

// watch
function watchFiles() {
	gulp.watch('app/libs/**/*.css', libscss);
	gulp.watch('app/libs/**/*.js', libsjs);
	gulp.watch('app/less/**/*.less', css);
	gulp.watch('app/js/**/*.js', scripts);
	gulp.watch('../templates/*.html', browserSyncReload);
}

// Clean assets
function clean() {
	return del(["./dist"]);
}

// define complex tasks
const js = gulp.series(scripts);
const build = gulp.series(clean, gulp.parallel(css, js, imgMin));
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;
