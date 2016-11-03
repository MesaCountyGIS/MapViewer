var gulp = require('gulp');
var plumber = require('gulp-plumber');
var order = require('gulp-order');
var addsrc = require('gulp-add-src');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');
var concatCss = require('gulp-concat-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var watch = require('gulp-watch');

gulp.task('less', function(){
    /* less converts style.less (the application's main style sheet) to plain
    css, minifies it, concatenates it with ESRIs nihilo stylesheet, renames
    it and copies it to the dist style directory*/
    return gulp.src('./src/style/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(cssnano())
    .pipe(addsrc.append([
        './src/style/libs/nihilo.min.css'
    ]))
    .pipe(concatCss('concat.css'))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest('./dist/style/'));
});

gulp.task('mobileLess', function(){
    /* mobileLess takes care of two tasks: It converts mstyle.less to css; It
    copies the css for handling older versions of ie over to the src
    directory. */
    return gulp.src('./src/style/mstyle.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(addsrc.append([
        './src/style/ie.css',
        './src/style/ie7.css',
        './src/style/ie8.css',
        './src/style/ltie10.css'
    ]))
    .pipe(cssnano())
    .pipe(concatCss('mconcat.css'))
    .pipe(rename("mstyle.min.css"))
    .pipe(gulp.dest('./dist/style/'));
});

gulp.task('js', function(){
    /* js minifies, renames and copies app.js into the dist directory */
    return gulp.src(['./src/scripts/app.js'])
        .pipe(plumber())
        .pipe(uglify({
            mangle: false,
        }))
        .pipe(concat("all.js"))
        .pipe(rename("app.min.js"))
        .pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('minmods', function(){
    /* minmods takes custom DOJO (AMD style) modules and minifies them. Then
    they are copied to dist/esri/ to become part of the ESRI JS API custom
    build. There are two modules (as of 11/2/2016) that are not minified. These
    are handled by the copyScripts task below. */
 return gulp.src(['./src/scripts/mesa/autocomplete.js'])
         .pipe(addsrc.append([
                './src/scripts/mesa/basemapWidget.js',
                './src/scripts/mesa/bookmarkWidget.js',
                './src/scripts/mesa/changeTheme.js',
                './src/scripts/mesa/contextMenuWidget.js',
                './src/scripts/mesa/coordinateCleaner.js',
                './src/scripts/mesa/exportcsv.js',
                './src/scripts/mesa/graphicsTools.js',
                './src/scripts/mesa/helpWidget.js',
                './src/scripts/mesa/homeButton.js',
                './src/scripts/mesa/locatorWidget.js',
                './src/scripts/mesa/measureWidget.js',
                './src/scripts/mesa/printWidget.js',
                './src/scripts/mesa/problemFormWidget.js',
                './src/scripts/mesa/queryWidget.js',
                './src/scripts/mesa/searchCompleteWidget.js',
                './src/scripts/mesa/shareFormWidget.js',
                './src/scripts/mesa/toolsWidget.js'
            ]))
        .pipe(plumber())
        .pipe(uglify({
            mangle: false,
        }))
 .pipe(gulp.dest('./dist/scripts/esri/mesa/'));
});

gulp.task('minify', function() {
    /* The minify task takes the html templates associated with the
    custom DOJO (AMD style) modules that are processed above in the minmods
    task and minifies them. The templates are then copied into the
    dist/scripts/esri/mesa/templates directory.  */
  return gulp.src('./src/scripts/mesa/templates/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/scripts/esri/mesa/templates/'));
});

gulp.task('copyRoot', function() {
    /* Copy root copies individual files at the apps root level to the
    dist directory root level. */
  return gulp.src('./src/viewer.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('copyScripts', function() {
    /* copyScripts copies over files that can't be minified by minmods or
    otherwise just need moved without modification or renaming. There is
    a problem with IdentifyTemplates.js causing it to break when minified. */
    return gulp.src('./src/viewer.html')
    .pipe(addsrc.append([
          './src/scripts/mesa/IdentifyTemplates.js',
          './src/scripts/mesa/rangy.js'
       ]))
    .pipe(gulp.dest('./dist/scripts/esri/mesa'));
});

gulp.task('default', ['less', 'mobileLess', 'js', 'minmods', 'minify', 'copyRoot', 'copyScripts'] , function() {
    gulp.watch(['./src/style/style.less'], ['less']);
    gulp.watch(['./src/style/mstyle.less', './src/style/*ie*css'], ['mobileLess']);
    gulp.watch(['./src/scripts/app.js'], ['js']);
    gulp.watch(['./src/scripts/mesa/*.js'], ['minmods', 'copyScripts']);
    gulp.watch(['./src/scripts/mesa/templates/*.html'], ['minify']);
    gulp.watch(['./src/viewer.html'], ['copyTopEnd']);
});
