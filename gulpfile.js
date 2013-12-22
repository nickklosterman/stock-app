var gulp = require('gulp')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , jshint = require('gulp-jshint');

gulp.task('lint', function() {

  gulp.src([
    'index.js'
  , 'gulpfile.js'
  , 'server/**/*.js'
  , 'public/js/*.js'
  , '!public/js/jquery.sparkline.min.js'
  , '!public/js/backbone-min.js'
  , '!public/js/underscore-min.js'
  ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));

});

gulp.task('build', function() {

  gulp.src([
    'public/js/underscore-min.js'
  , 'public/js/backbone-min.js'
  , 'public/js/jquery.sparkline.min.js'
  , 'public/js/app.js'
  ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));

});

gulp.task('default', function() {
  gulp.run('lint');
});
