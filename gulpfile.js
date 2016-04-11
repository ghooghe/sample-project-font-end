var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');

var del = require('del');
var path = require('path');
var runSequence = require('run-sequence').use(gulp);
var browserSync = require('browser-sync');

var tsProject = typescript.createProject('tsconfig.json');

var config = {
  dest: 'dist',

  srcTs: 'app/**/*.ts',
  srcCss: 'app/**/*.css',
  srcHtml: 'app/**/*.html',

  libsCss: [
    'node_modules/bootstrap/dist/css/bootstrap.min.css'
  ],
  libsJs: [
    'node_modules/**/systemjs/dist/system-polyfills.js', // still needed?
    'node_modules/**/angular2/bundles/angular2-polyfills.js',
    'node_modules/**/systemjs/dist/system.src.js',
    'node_modules/**/traceur/bin/traceur.js', // still needed?
    'node_modules/**/rxjs/bundles/Rx.js',
    'node_modules/**/angular2/bundles/angular2.dev.js',
    'node_modules/**/angular2/bundles/http.dev.js',
    'node_modules/**/angular2/bundles/router.dev.js'
  ],

  uglify: {
    output: { max_line_len: 80 }
  }
};

gulp.task('clean', function(done) {
     return del([config.dest]);
});

gulp.task('html', function() {
  return gulp.src([config.srcHtml])
     .pipe(gulp.dest(config.dest));
});

gulp.task('cssLibs', function() {
  return gulp.src(config.libsCss)
    .pipe(concat('libs.css'))
    .pipe(gulp.dest(config.dest + '/css'));
});

gulp.task('css', function() {
     return gulp.src(config.srcCss)
          .pipe(sourcemaps.init())
          .pipe(cleanCss())
          .pipe(concat('app.css'))
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(config.dest + '/css'));
});

gulp.task('jsLibs', function() {
  return gulp.src(config.libsJs)
    .pipe(sourcemaps.init())
    .pipe(concat('libs.js'))
    .pipe(uglify(config.uglify))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.dest + '/js'));
});

gulp.task('ts', function() {
     return gulp.src(config.srcTs)
          .pipe(sourcemaps.init())
          .pipe(typescript(tsProject))
          .js
          .pipe(uglify(config.uglify))
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(config.dest + '/app'));
});

gulp.task('server', function(done) {
     browserSync({
          server: {
               baseDir: [config.dest]
          }
     })
     done();
});

gulp.task('default', function(callback) {
    return runSequence('clean', ['jsLibs', 'ts', 'cssLibs', 'css', 'html'], callback);
});

gulp.task('watch', runSequence('default', 'server'), function watcher() {
      gulp.watch([config.srcTs], ['ts']);
      gulp.watch([config.srcCss], ['css']);
      gulp.watch([config.srcHtml], ['html']);
      gulp.watch(config.dest + '/**/*', browserSync.reload);
});
