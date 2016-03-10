module.exports = function( config ) {
    config.set({
        basePath: '../../src/main',
        frameworks: ['mocha', 'chai', 'chai-sinon', 'sinon'],

        preprocessors: {
            './**/*.html': 'ng-html2js',
            './**/*.js': 'coverage'
        },

        reporters: ['progress', 'coverage'],

        coverageReporter: {
            type: 'lcov',
            dir: '../../coverage',
            subdir: function(browser) {
                // normalization process to keep a consistent browser name accross different OS
                return browser.toLowerCase().split(/[ /-]/)[0];
            }
        },

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,

        autoWatch: true,
        autoWatchBatchDelay: 100,
        usePolling: true,

        browsers: ['PhantomJS'],
        singleRun: true
    });
};
