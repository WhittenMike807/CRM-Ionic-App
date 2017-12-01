var gulp = require('gulp')
var install = require("gulp-install");
var watch = require('gulp-watch');

 
gulp.task('build', function () {
     process.stdout.write('-----------------------------\n')
     process.stdout.write('----BEGINNING GULP WATCH-----\n')
     process.stdout.write('-----------------------------\n')
     
     gulp.src(['./bower.json', './package.json'])
    .pipe(install());

    return watch('package.json', function () {
        process.stdout.write('-----------------------------\n')
        process.stdout.write('----NPM INSTALL INITIATED----\n')
        process.stdout.write('-----------------------------\n')
        install();
     });
});
