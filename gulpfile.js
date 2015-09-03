var config = require('./gulp.config')();
var pkg = require('./package.json');
var del = require('del');
var gulp = require('gulp');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var $ = require('gulp-load-plugins')({
    lazy : true
});

gulp.task('help', $.taskListing);
gulp.task('default', [ 'help' ]);

/**
 * Run tests
 */
gulp.task('test', [ 'templatecache' ], function(done) {
    var karma = require('karma').server;
    karma.start({
	configFile : __dirname + '/karma.conf.js'
    }, function(karmaResult) {
	done();
    });
});

/**
 * Build and minify js files
 */
gulp.task('build-js', [ 'templatecache' ], function(cb) {
    log('Optimizing files ');
    var templateCache = config.temp + config.templateCache.file;
    var jsFiles = [].concat(config.js, templateCache);
    return gulp.src(jsFiles).pipe($.concat(config.module + '.js')).pipe(gulp.dest(config.build)).pipe($.uglify()).pipe(
	    $.rename({
		extname : '.min.js'
	    })).pipe(gulp.dest(config.build));
});
/**
 * Build and minify css files
 */
gulp.task('build-css', [ 'styles' ], function() {
    return gulp.src(config.temp + '*.css').pipe($.concat(config.module + '.css')).pipe(gulp.dest(config.build)).pipe(
	    $.csso()).pipe($.rename({
	extname : '.min.css'
    })).pipe(gulp.dest(config.build));
});
/**
 * Add copyright info to built files
 */
gulp.task('copyright', [ 'build-js', 'build-css' ], function() {
    var copyright = fs.readFileSync('Copyright');
    gulp.src(config.build + '/**.*').pipe($.header(copyright, {
	pkg : pkg
    })).pipe(gulp.dest(config.build));
});

/**
 * Compile less to css
 * 
 * @return {Stream}
 */
gulp.task('styles', [ 'clean-code' ], function() {
    log('Compiling Less --> CSS');
    return gulp.src(config.less).pipe($.less()).pipe($.autoprefixer({
	browsers : [ 'last 2 version', '> 5%' ]
    })).pipe(gulp.dest(config.temp));
});

/**
 * Wire-up the bower dependencies
 * 
 * @return {Stream}
 */
gulp.task('wiredep', function() {
    log('Wiring the bower dependencies into the html');
    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();
    var js = gulp.src([ config.demo.lib + '**/*' ].concat(config.demo.js, config.demo.css), {
	read : false
    });
    return gulp.src(config.index).pipe($.inject(js, {
	relative : true
    })).pipe(wiredep(options)).pipe(gulp.dest(config.demo.basedir));
});

/**
 * 
 */
gulp.task('serve-demo', function() {
    $.connect.server({
	root : 'demo'
    });

});

/**
 * 
 */
gulp.task('copy-demo', function() {
    log('Copy optimized files to demo');
    var stream = gulp.src([ config.build + config.module + '.js', config.build + config.module + '.css' ]).pipe(
	    $.debug()).pipe(gulp.dest(config.demo.lib));
    return stream;
});

/**
 * 
 */
gulp.task('build-demo', function(cb) {
    var runSequence = require('run-sequence');
    runSequence([ 'build-js', 'build-css' ], 'copy-demo', 'wiredep', cb);
});

/**
 * 
 */
gulp.task('demo-watch', function() {
    $.watch(config.src + '**/*', $.batch(function(events, done) {
	gulp.start('build-demo', done);
    }));
});

/**
 * Deploy demo folder to gh-pages branch
 */
gulp.task('deploy-demo', function() {
    return gulp.src('./demo/**/*').pipe($.ghPages());
});

/**
 * vet the code and create coverage report
 * 
 * @return {Stream}
 */
gulp.task('vet', function() {
    log('Analyzing source with JSHint and JSCS');
    return gulp.src(config.alljs).pipe($.jshint()).pipe($.jshint.reporter('jshint-stylish', {
	verbose : true
    })).pipe($.jshint.reporter('fail')).pipe($.jscs());
});

/**
 * Create $templateCache from the html templates
 * 
 * @return {Stream}
 */
gulp.task('templatecache', [ 'clean-code' ], function() {
    log('Creating an AngularJS $templateCache');
    return gulp.src(config.htmltemplates).pipe($.minifyHtml({
	empty : true
    })).pipe($.angularTemplatecache(config.templateCache.file, config.templateCache.options)).pipe(
	    gulp.dest(config.temp));
});

gulp.task('changelog', function() {
    return gulp.src('CHANGELOG.md', {
	buffer : false
    }).pipe($.conventionalChangelog({
	preset : 'angular',
	releaseCount: 0
    })).pipe(gulp.dest('./'));
});

/**
 * gulp patch # makes v0.1.0 → v0.1.1
 */
gulp.task('patch', function() {
    return inc('patch');
})
/**
 * gulp feature # makes v0.1.1 → v0.2.0
 */
gulp.task('feature', function() {
    return inc('minor');
})
/**
 * gulp release # makes v0.2.1 → v1.0.0
 */
gulp.task('release', function() {
    return inc('major');
})

/**
 * Bumping version number and tagging the repository with it.
 */
function inc(importance) {
    // get all the files to bump version in
    return gulp.src([ './package.json', './bower.json' ])
    // bump the version number in those files
    .pipe($.bump({
	type : importance
    }))
    // save it back to filesystem
    .pipe(gulp.dest('./'))
    // commit the changed version number
    .pipe(git.commit('bumps package version'))
    // read only one file to get the version number
    .pipe(filter('package.json'))
    // **tag it in the repository**
    .pipe(tag_version());
}

/**
 * Remove all js and html from the build and temp folders
 * 
 * @param {Function}
 *                done - callback when complete
 */
gulp.task('clean-code', function(done) {
    var files = [ config.temp + '**' ].concat(config.build + '**');
    clean(files, done);
});

/**
 * Delete all files in a given path
 * 
 * @param {Array}
 *                path - array of paths to delete
 * @param {Function}
 *                done - callback when complete
 */
function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}

/**
 * Log a message or series of messages using chalk's blue color. Can pass in a
 * string, object or array.
 */
function log(msg) {
    if (typeof (msg) === 'object') {
	for ( var item in msg) {
	    if (msg.hasOwnProperty(item)) {
		$.util.log($.util.colors.blue(msg[item]));
	    }
	}
    } else {
	$.util.log($.util.colors.blue(msg));
    }
}
