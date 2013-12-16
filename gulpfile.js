var gulp = require('gulp')
  , jshint = require('gulp-jshint');

gulp.task('lint', function() {

  gulp.src([
    'index.js'
  , 'gulpfile.js'
  , 'server/**/*.js'
  , 'public/js/*.js'
  ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));

});

gulp.task('default', function() {
  gulp.run('lint');
});
