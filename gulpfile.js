/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */
var fs = require('fs-extra');
var gulp = require('gulp');
var elixir = require('laravel-elixir');
var browserify = require('laravel-elixir-browserify');

var topLevelApps = fs.readdirSync('resources/assets/js').filter(function(f) { return f.slice(-3) === ".js" });

// move all directive templates to /public to emulate "same directory"
gulp.task("copyTemplates", function() {
    var templates = fs.readdirSync('resources/assets/js/sharedDirectives').filter(function (f) {
        return f.slice(-5) === ".html"
    });
    templates.forEach(function (f) {
        fs.copy('resources/assets/js/sharedDirectives/' + f, 'public/' + f, function (err) {
            if (err) return console.log(err);
            else console.log('Copied ' + f + ' to /public successfully.');
        });
    });
});

elixir.config.sourcemaps = true;
elixir(function(mix) {
    browserify.init();

    mix.less('main.less');

    topLevelApps.forEach(function(f) {
        mix.browserify(f, {
            debug: true,
            output: 'public/js',
            rename: f.slice(0, f.indexOf('-')) + '-bundle.js'
        })
    });

    // use elixir watcher
    mix.task("copyTemplates", "resources/assets/js/sharedDirectives/*.html");
});
