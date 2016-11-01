'use strict';

var build = require('./build');
var gulp = require('gulp');
var conf = require('./conf');

var userHome = require('user-home');
var clean = require('gulp-clean');

var replace = require('gulp-replace-task');

var servicesPath = 'src/app/common/services/';

var stripDebug = require('gulp-strip-debug');

gulp.task('change-url', function(cb) {
  gulp.src([servicesPath + 'apilaData.service.js', servicesPath + 'authentication.service.js', servicesPath + 'socket.service.js'])
  .pipe(replace({
    patterns: [
      {
        match: /http:\/\/localhost:3300/g,
        replacement: function () {
          return '';
        }
      }
    ]
  }))
  .pipe(gulp.dest(servicesPath));

  cb();
});


gulp.task('run-build', ['change-url','build'], function(cb) {
  cb();
});


gulp.task('copy-client', function() {
  gulp.src(["src/**/*.js"])
      .pipe(stripDebug())
      .pipe(gulp.dest('deploy'));
});

gulp.task('copy-api', function() {
  gulp.src(['!apila.js', '../api/**/*'])
      .pipe(gulp.dest(userHome + '/deploy/app_api'));
});

gulp.task('deploy', ['run-build'], function(cb) {
  gulp.src([conf.paths.dist + '/**/*'])
      .pipe(gulp.dest(userHome + '/deploy/app_client'));

  gulp.src(['!apila.js', '../api/**/*'])
      .pipe(gulp.dest(userHome + '/deploy/app_api'));

  // copy api package.json to deploy package.json
  gulp.src(['../api/package.json'])
      .pipe(gulp.dest(userHome + '/deploy/'));


      gulp.src([servicesPath + 'apilaData.service.js', servicesPath + 'authentication.service.js', servicesPath + 'socket.service.js'])
          .pipe(replace({
            patterns: [
              {
                match: /apiUrl=\"/g,
                replacement: function () {
                  return 'apiUrl="http://localhost:3300';
                }
              },
              {
                match: /io.connect\(''\)/g,
                replacement: function () {
                  return "io.connect('http://localhost:3300')";
                }
              }
            ]
          }))
          .pipe(gulp.dest(servicesPath));

});

gulp.task('replace-url', function() {
  gulp.src([servicesPath + 'apilaData.service.js', servicesPath + 'authentication.service.js', servicesPath + 'socket.service.js'])
      .pipe(replace({
        patterns: [
          {
            match: /apiUrl=\"/g,
            replacement: function () {
              return 'apiUrl="http://localhost:3300';
            }
          },
          {
            match: /io.connect\(''\)/g,
            replacement: function () {
              return "io.connect('http://localhost:3300')";
            }
          }
        ]
      }))
      .pipe(gulp.dest(servicesPath));
});
