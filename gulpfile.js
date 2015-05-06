var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('default', ['nodemon']);

gulp.task('nodemon', function () {
  nodemon({
    script: 'app.js',
    ext: 'js',
    execMap: {
      "js": "babel-node"
    }
  })
});

