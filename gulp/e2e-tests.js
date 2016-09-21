'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

// Downloads the selenium webdriver
gulp.task('webdriver-update', $.protractor.webdriver_update);

gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

function runProtractor(done)
{
    var params = process.argv;
    var args = params.length > 3 ? [params[3], params[4]] : [];

    // order of tests is important
    var specTests = [
        'e2e/register.spec.js',
  //      'e2e/homepage.spec.js',
        'e2e/login.spec.js',
//        'e2e/create_community.spec.js',
//        'e2e/community_request.spec.js',
  //      'e2e/add_issue.spec.js',
        'e2e/add_resident.spec.js',
  //      'e2e/add_appointment.spec.js'
    ];

    gulp.src(specTests)
        .pipe($.protractor.protractor({
            configFile: 'protractor.conf.js',
            args      : args
        }))
        .on('error', function (err)
        {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        })
        .on('end', function ()
        {
            // Close browser sync server
            browserSync.exit();
            done();
        });
}

gulp.task('protractor', ['protractor:src']);
gulp.task('protractor:src', ['serve:e2e', 'webdriver-update'], runProtractor);
gulp.task('protractor:dist', ['serve:e2e-dist', 'webdriver-update'], runProtractor);
