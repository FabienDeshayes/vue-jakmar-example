var gulp = require('gulp')
  , connect = require('gulp-connect')
  , open = require('gulp-open')


gulp.task('connect', function() {
  connect.server({
  })
})

gulp.task('open', function() {
  var options = {
    url: 'http://localhost:8080/src',
  }
	gulp
		.src('./src/index.html')
  	.pipe(open('', options))
})
  

gulp.task('default', ['connect', 'open'])