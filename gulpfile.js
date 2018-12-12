/* File: gulpfile.js */

var gulp  = require('gulp'),
    gutil = require('gulp-util');

var run = require('gulp-run-command').default;

var gulpLoadPlugins = require('gulp-load-plugins');
var env = require('gulp-env');
// var buildscript = require('./client/build/build');


var environments = require('gulp-environments');
var runSequence = require('run-sequence').use(gulp);
var config;

var plugins = gulpLoadPlugins();

var development = environments.development;
var production = environments.production;

const clientPath = 'client';
const serverPath = 'server';
const paths = {
    client: {
        assets: `${clientPath}/src/assets/**/*`,
        images: `${clientPath}/static/img/**/*`,
        styles: [`${clientPath}/src/styles/{scss}/*.scss`],
        // mainStyle: `${clientPath}/app/app.scss`,
        views: `${clientPath}/src/{view,components}/**/*.vue`
    },
    dist: 'client/dist',
    heroku_app: 'heroku-app',
    server: 'server'
};

gulp.task('default', function() {
  return gutil.log('Gulp is running!')
});


gulp.task('env:prod', function(done) {
  env.set({
    NODE_ENV: 'production'
  });
  done();
});

gulp.task('copy:dist', function(done){
  gulp.src(`${paths.dist}/*`)
        .pipe(gulp.dest(`${paths.heroku_app}/client/dist/`));
  done()
});

gulp.task('copy:server', function(done){
  gulp.src(`${paths.server}/*`)
        .pipe(gulp.dest(`${paths.heroku_app}/server`));
  done()
});

gulp.task('copy:config', function(done) {
    gulp.src('./config.js')
        .pipe(gulp.dest(`${paths.heroku_app}`));
    done();
});

gulp.task('copy:package', function(done) {
    gulp.src('./package.json')
        .pipe(gulp.dest(`${paths.heroku_app}`));
    done();
});

gulp.task('webpack:dist', run('node ./client/build/build.js'))

gulp.task('chgt:rep',function(done){process.cwd('heroku-app');done();})
gulp.task('git:add',run('git add .'))
gulp.task('git:commit',run("git commit -m 'new commit'"))
gulp.task('heroku:push',run("git push heroku master"))

gulp.task('deploy:prod',gulp.series('chgt:rep','git:add','git:commit','heroku:push', function(done){
  done();
}))

// Similarly Tasks 3 and 4 Code here

gulp.task('build:prod', gulp.series('env:prod','webpack:dist','copy:dist','copy:server', 'copy:config','copy:package', function (done) {
    done();
}));
