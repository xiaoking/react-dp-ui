/**
 * Created by minxiao on 15/8/15.
 */
var gulp = require('gulp');
var $ =require('gulp-load-plugins')();
var webpackConfig = require('./webpack.config');
var mergeStream = require('merge-stream');

var globs = {
    js:'src/**/*.js',
    less:'src/**/*.less',
    assets:[
        'src/fonts/**/*',
        'src/images/**/*'
    ]
};

gulp.task('js',['webpack'],function(){
    return gulp.src('dist/**/*.js')
        .pipe(gulp.dest('dist/') );
});

gulp.task('webpack',function(){
    webpackConfig.refreshEntry();

    return gulp.src(globs.js)
        .pipe($.webpack(webpackConfig))
        .pipe(gulp.dest('dist/'));
});

gulp.task('css',function(){
    return gulp.src(globs.less)
        .pipe($.less())
        .pipe($.minifyCss() )
        .pipe($.rename(function(path){
            path.dirname = '';
            path.basename = path.basename;
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('assets',function(){
   return mergeStream.apply(null,globs.assets.map(function(glob){
       return gulp.src(glob)
           .pipe(gulp.dest(glob.replace(/\/\*.*$/, '').replace(/^src/,'dist') ));
   }))
});

gulp.task('build',['js','css','assets'] );

gulp.task('watch',['build'],function(){
    $.livereload.listen();

    gulp.watch(globs.js,['js',pop]).on('change',push);
    gulp.watch(globs.less,['css',pop]).on('change',push);
    gulp.watch(globs.assets,['assets',pop]).on('change',push);

    var changed = [];

    function push(s) {
        changed.push(s);
    }
    function pop(){
        while(changed.length>0){
            var s=changed.pop();
            $.livereload.changed(s);
        }
    }
});

gulp.task('default',function(){
    gulp.start('watch');
});