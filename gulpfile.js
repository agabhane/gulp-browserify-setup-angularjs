var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  del = require('del'),
  $ = gulpLoadPlugins(),
  sequence = require('run-sequence');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('build-vendor', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/vendor.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('build-js', function () {
  return gulp.src('./src/app/**/*.js')
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('build-html', function () {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('clean:dist', function () {
  return del.sync('dist');
});

gulp.task('inject', function () {
  var target = gulp.src('dist/index.html');
  var vsources = gulp.src(['dist/js/vendor.js'], { read: false });
  var msources = gulp.src(['dist/**/*.js', '!dist/js/vendor.js']);
  return target.pipe($.inject(msources.pipe($.angularFilesort()), { relative: true }))
    .pipe($.inject(vsources, { relative: true, name: 'vendor' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', function (done) {
  sequence('clean:dist', ['build-vendor', 'build-js', 'build-html'], 'inject', done);
});