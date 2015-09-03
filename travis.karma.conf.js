module.exports = function(config) {
    var gulpConfig = require('./gulp.config')();

    config.set({
	// base path that will be used to resolve all patterns (eg. files,
	// exclude)
	basePath : './',
	frameworks : [ 'mocha', 'chai', 'sinon', 'chai-sinon' ],
	files : gulpConfig.karma.files,
	exclude : gulpConfig.karma.exclude,
	preprocessors :  gulpConfig.karma.preprocessors,
	ngHtml2JsPreprocessor : {
	    stripPrefix : 'src/directive',
	    prependPrefix : 'templates',
	    moduleName : gulpConfig.templateCache.options.module
	},
	reporters : [ 'progress', 'coverage' ],
	coverageReporter : {
	    dir : gulpConfig.karma.coverage.dir,
	    reporters : gulpConfig.karma.coverage.reporters
	},
	port : 9876,
	colors : true,
	logLevel : config.LOG_INFO,
	browsers : [ 'PhantomJS' ],
	autoWatch : false,
	singleRun : true
    });
};
