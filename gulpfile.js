var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var cleanCss = require('gulp-clean-css');

var styleSheets = ['public/css/main.css', 'public/css/home.css',
                   'public/css/ladder.css', 'public/css/grid.css',
                   'public/css/sidebar.css'];

gulp.task('pack-css', function () {    
    return gulp.src(styleSheets)
        .pipe(concat('stylesheet.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest('public/build/css'));
});