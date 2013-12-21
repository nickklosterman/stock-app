var gulp = require('gulp')
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

gulp.task('default', function() {
  gulp.run('lint');
});
