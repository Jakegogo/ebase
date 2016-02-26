var gulp = require('gulp'),
    livereload = require('gulp-livereload'), //自动刷新页面
    del = require('del'), //清除文件
    rename = require('gulp-rename'),
    cssWrap = require('gulp-css-wrap');

gulp.task('bower', function() {
    gulp.src('bower_components/**/*.js')
        .pipe(gulp.dest('dist/vendor'));
    gulp.src('bower_components/**/*.css')
        .pipe(gulp.dest('dist/vendor'));
    gulp.src('bower_components/**/*.map')
        .pipe(gulp.dest('dist/vendor'));
    gulp.src('bower_components/font-awesome/fonts/*')
        .pipe(gulp.dest('dist/vendor/font-awesome/fonts'));
    gulp.src('bower_components/bootstrap/fonts/*')
        .pipe(gulp.dest('dist/vendor/bootstrap/dist/fonts'));
    gulp.src('bower_components/simple-line-icons/fonts/*')
        .pipe(gulp.dest('dist/vendor/simple-line-icons/fonts/'));
    gulp.src('bower_components/ionic/release/css/ionic.css')
        .pipe(cssWrap({
            selector: '.app-wrap'
        }))
        .pipe(rename("vendor/ionic/release/css/ionic-wrap.css"))
        .pipe(gulp.dest('dist/'));
    gulp.src('bower_components/ztree_v3/css/zTreeStyle/img/**/*')
        .pipe(gulp.dest('dist/vendor/ztree_v3/css/zTreeStyle/img/'));
});

gulp.task('styles', function() {
    return gulp.src('src/styles/**/*')
        .pipe(gulp.dest('dist/css'));
});

gulp.task('scripts', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(gulp.dest('dist/js'));
});

gulp.task('conf', function() {
    return gulp.src('src/conf/*')
        .pipe(gulp.dest('dist/conf'));
});

gulp.task('i18n', function() {
    return gulp.src('src/i18n/*')
        .pipe(gulp.dest('dist/i18n'));
});

gulp.task('vendor', function() {
    return gulp.src('src/vendor/**/*')
        .pipe(gulp.dest('dist/vendor'));
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(gulp.dest('dist/img'));
});

gulp.task('views', function() {
    gulp.src('src/main.html')
        .pipe(gulp.dest('dist'));
    gulp.src('src/login.html')
        .pipe(gulp.dest('dist'));
    return gulp.src('src/views/**/*')
        .pipe(gulp.dest('dist/view'));
});

gulp.task('demo', function() {
    return gulp.src('src/demo/**/*')
        .pipe(gulp.dest('dist/demo'));
});

gulp.task('clean', function(cb) {
    del(['dist/*'], cb)
});

gulp.task('default', ['styles', 'scripts', 'images', 'bower', 'views', 'vendor', 'demo', 'conf', 'i18n']);

// Watch
gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch('src/styles/**/*.css', ['styles']);
    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);
    // Watch configure files
    gulp.watch('src/conf/*.js', ['conf']);
    // Watch image files
    gulp.watch('src/images/**/*', ['images']);
    // Watch vendor files
    gulp.watch('src/vendor/**/*', ['vendor']);
    gulp.watch('src/views/**/*', ['views']);
    gulp.watch('src/demo/**/*', ['demo']);
    // Create LiveReload server
    //livereload.listen();
    // Watch any files in dist/, reload on change
    //gulp.watch(['dist/**']).on('change', livereload.changed);
});
