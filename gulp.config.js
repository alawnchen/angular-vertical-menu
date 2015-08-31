module.exports = function() {

    var src = './src/';
    var demo = './demo/';
    var temp = './tmp/';
    var report = './report/';

    var module = 'angular-vertical-menu';

    var wiredep = require('wiredep');
    var nodeModules = 'node_modules';

    var bower = {
	json : require(demo + 'bower.json'),
	directory : demo + 'bower_components/',
	ignorePath : '../..'
    };

    var config = {
	module : module,
	src : src,
	build : './build/',
	temp : temp,
	report : report,
	demo : {
	    basedir : demo,
	    lib : demo + 'lib',
	    js : [ demo + 'app/**/*.module.js', demo + 'app/**/*.js' ],
	    css : [ demo + 'styles/**/*.css' ]
	},
	alljs : [ './src/**/*.js', './*.js' ],
	js : [ src + '*.module.js', src + '**/*.js', '!' + src + '**/*.spec.js' ],
	css : [ src + '**/*.css' ],
	less : [ src + '**/*.less' ],
	index : demo + 'index.html',
	htmltemplates : src + '**/*.directive.html',
	bower : bower,
	templateCache : {
	    file : 'templates.js',
	    options : {
		module : 'angularVerticalMenu',
		standAlone : false,
		transformUrl: function(url) {
		    return 'templates/angular-vertical-menu.directive.html';
		}
	    }
	},
	testlibraries : [ nodeModules + '/mocha/mocha.js', nodeModules + '/chai/chai.js',
		nodeModules + '/sinon-chai/lib/sinon-chai.js' ],
	// specHelpers : [ client + 'test-helpers/*.js' ],
	specs : [ src + '**/*.spec.js' ],
    };

    /**
     * wiredep and bower settings
     */
    config.getWiredepDefaultOptions = function() {
	var options = {
	    bowerJson : config.bower.json,
	    directory : config.bower.directory,
	    ignorePath : config.bower.ignorePath
	};
	return options;
    };

    config.karma = getKarmaOptions();

    return config;

    function getKarmaOptions() {

	var bowerFiles = wiredep({
	    devDependencies : true
	})['js'];

	var options = {
	    // config.specHelpers,
	    files : [].concat(bowerFiles, src + '**/*.module.js', src + '**/*.js', temp + config.templateCache.file),
	    exclude : [],
	    coverage : {
		dir : report + 'coverage',
		reporters : [
		// reporters not supporting the `file` property
		{
		    type : 'html',
		    subdir : 'report-html'
		}, {
		    type : 'lcov',
		    subdir : 'report-lcov'
		}, {
		    type : 'text-summary'
		} ]
	    },
	    preprocessors : {
		'src/directive/*.html': ['ng-html2js']
	    }
	};

	options.preprocessors[src + '**/!(*.spec)+(.js)'] = [ 'coverage' ];
	return options;
    }
};