'use strict';
var fs = require('fs');
var async = require('async');
/* indent: 2, node:true, nomen: true, maxlen: 80, vars: true*/

var scan = function(dir, suffix, callback) {
    fs.readdir(dir, function(err, files) {
        var returnFiles = [];
        async.each(files, function(file, next) {
            var filePath = dir + '/' + file;
            fs.stat(filePath, function(err, stat) {
                if (err) {
                    return next(err);
                }
                if (stat.isDirectory()) {
                    scan(filePath, suffix, function(err, results) {
                        if (err) {
                            return next(err);
                        }
                        returnFiles = returnFiles.concat(results);
                        next();
                    })
                }
                else if (stat.isFile()) {
                    if (file.indexOf(suffix, file.length - suffix.length) !== -1) {
                        returnFiles.push(filePath);
                    }
                    next();
                }
            });
        }, function(err) {
            callback(err, returnFiles);
        });
    });
};

module.exports = scan;

'use strict';
/* indent: 2, node:true, nomen: true, maxlen: 80, vars: true*/
(function () {

    var scanner = {};
    var fs = require('fs'),
        async = require('async');

    // global on the server, window in the browser
    var root, previous_scanner;

    root = this;
    if (root != null) {
        previous_scanner = root.scan;
    }

    scanner.noConflict = function () {
        root.scan = previous_scanner;
        return scanner;
    };

    scanner.scan = function(dir, suffix, callback) {
        fs.readdir(dir, function(err, files) {
            var returnFiles = [];
            async.each(files, function(file, next) {
                var filePath = dir + '/' + file;
                fs.stat(filePath, function(err, stat) {
                    if (err) {
                        return next(err);
                    }
                    if (stat.isDirectory()) {
                        scan(filePath, suffix, function(err, results) {
                            if (err) {
                                return next(err);
                            }
                            returnFiles = returnFiles.concat(results);
                            next();
                        })
                    }
                    else if (stat.isFile()) {
                        if (file.indexOf(suffix, file.length - suffix.length) !== -1) {
                            returnFiles.push(filePath);
                        }
                        next();
                    }
                });
            }, function(err) {
                callback(err, returnFiles);
            });
        });
    };


    // AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return scanner;
        });
    }
    // Node.js
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = scanner;
    }
    // included directly via <script> tag
    else {
        root.scan = scanner;
    }
}());
