(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by mzimmerman on 7/8/15.
 */

(function(angular) {

    angular.module('BioinformaticsControllers', ['BioinformaticsServices'])
        .controller('BioinformaticsMainController', ['$scope', 'DataSet', 'BioComputation', function($scope, DataSet, BioComputation) {

            $scope.pageHeader = "Congratulations, Angular is bootstrapped!";

            $scope.datasets, $scope.computations;
            $scope.updateDatasets = function() {
                DataSet.query({}, function(res) {
                    if (!res.error) {
                        $scope.datasets = res.data;
                    }
                });
            }
            $scope.updateDatasets();

            $scope.updateComputations = function() {
                BioComputation.query({}, function(res) {
                    if (!res.error) {
                        $scope.computations = res.data;
                    }
                })
            };
            $scope.updateComputations();

        }])

})(angular || {});
},{}],2:[function(require,module,exports){
/**
 * Created by mzimmerman on 7/8/15.
 */

(function(angular) {

    function updateGlobal(status,msg) {
        if (!_.contains(['default','error','loaded','uploaded','uploading'], status)) throw new Error(status);
        this.uploadManager.status = status;
        this.uploadManager.err = msg ? msg : "";
        this.$apply();
    }

    angular.module('BioinformaticsDirectives', ['BioinformaticsServices'])
        .directive('uploadManager', function($compile) {
            return {
                restrict: 'A',
                link: function(scope, ele, attr, ctrl) {
                    var update = updateGlobal.bind(scope);
                    // save data from attribute


                    // dynamic directive add
                    ele.removeAttr('upload-manager');
                    ele.attr('ng-class','{' +
                    '"panel panel-default": uploadManager.status === "default",' +
                    '"panel panel-warning": uploadManager.status === "loaded",' +
                    '"panel panel-success": uploadManager.status === "uploaded" || uploadManager.status === "uploading",' +
                    '"panel panel-danger": uploadManager.status === "error" }');
                    $compile(ele)(scope);

                    // create a uploader state
                    scope.uploadManager = {
                        dataName: "",
                        data: "",
                        size: 0,
                        type: "",
                        previewData: "",
                        status: "default",
                        err: "No file loaded",
                        reset: function() {
                            this.dataName = "";
                            this.data = "";
                            this.size = 0;
                            this.type = "";
                            this.previewData = "";
                            this.status = "default";
                            this.err = "No file loaded"
                        }
                    };

                    var inputs = angular.element(_.filter(ele.find('input'), function(i) { return i.type === "file"; }));
                    inputs.on('change', function(event) {
                        var file = event.target.files[0];
                        if (!file.type.match("text*")) return update("error","Incorrect file type");
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            if (!scope.uploadManager.dataName) scope.uploadManager.dataName = file.name;
                            scope.uploadManager.type = file.type;
                            scope.uploadManager.size = file.size;
                            scope.uploadManager.file = file;
                            scope.uploadManager.data = this.result;
                            scope.uploadManager.previewData = this.result.length > 299 ? this.result.slice(0,300) + '...' : this.result;
                            update('loaded', "File loaded");
                        };
                        reader.onerror = function() {update('error', 'Unknown error')};
                        reader.readAsText(file);
                    })
                }
            }
        })
    /**
     * uploadFile - dependent on uploadManager, must use in the same scope
     */
        .directive('uploadFile', function(DataSet) {
            return {
                restrict: 'A',
                link: function(scope, ele, attr, ctrl) {
                    var update = updateGlobal.bind(scope);
                    ele.on('click', function(event) {
                        event.stopImmediatePropagation();
                        if (!scope.uploadManager.file) return alert('upload a file, sillykins');
                        update('uploading', 'Uploading dataset');
                        // make a resource POST request
                        var dataset = new DataSet({
                            name: scope.uploadManager.dataName,
                            size: scope.uploadManager.size,
                            data: scope.uploadManager.data,
                            type: scope.uploadManager.type,
                            datafile: scope.uploadManager.file
                        });
                        dataset.$save(function(a,b) {
                            if (a.error) {
                                update('error', a.status + ' ' + a.error);
                            }
                            else {
                                update('uploaded', 'File uploaded successfully');
                                scope.updateDatasets(); // dependent on controller
                            }
                        });
                    })
                }
            }
        })

})(angular || {});
},{}],3:[function(require,module,exports){
/**
 * Created by mzimmerman on 7/8/15.
 */

require('./services');
require('./controllers');
require('./directives');

(function(angular) {

    angular.module('Bioinformatics', ['BioinformaticsControllers', 'BioinformaticsDirectives']);

})(angular || {});
},{"./controllers":1,"./directives":2,"./services":4}],4:[function(require,module,exports){
/**
 * Created by mzimmerman on 7/8/15.
 */

(function(angular) {

    angular.module('BioinformaticsServices', ['ngResource'])
        .factory('DataSet', function($resource) {
            return $resource('api/upload', null, {
                query: {method: "GET", isArray: false}
            })
        })
        .factory('BioComputation', function($resource) {
            return $resource('/api/computation', null, {
                query: {method: "GET", isArray:false}
            })
        })

})(angular || {});
},{}],5:[function(require,module,exports){
/**
 * Created by mzimmerman on 7/8/15.
 */

require('./config/globalConfigs');
require('./BioinformaticsComp/module');
require('./sharedDirectives/table');

(function(angular) {

    angular.module('app', ['LabappConfig','Bioinformatics','Table'])

})(angular || {});
},{"./BioinformaticsComp/module":3,"./config/globalConfigs":6,"./sharedDirectives/table":7}],6:[function(require,module,exports){
/**
 * Created by mzimmerman on 7/20/15.
 */

(function(angular) {

    angular.module('LabappConfig', [])
        .config(function($interpolateProvider, $httpProvider) {
            // fix interpolation for blade templates
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');

            // set up X-CSRF-TOKEN headers on any client requests
            $httpProvider.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf"]').content
        })

})(angular || {});
},{}],7:[function(require,module,exports){
/**
 * Created by mzimmerman on 7/20/15.
 */


/**
 * Table directive
 *
 * Dependencies: underscore.js
 *
 * Take scope data array in attribute "labappdata"
 *      Must be array of objects
 *
 * Click to select, and selected object is stored on the
 *      scope with name "[dataobject]-selected"
 *
 * Ex. <labapp-table labappdata="books" exclude="$$hashKey path"></div>
 */
(function(angular) {

    angular.module('Table', [])
        .directive('labappTable', function() {
            return {
                restrict: 'E',
                scope: {
                    dataArray: "=labappdata"
                },
                templateUrl: 'table.html',
                link: function(scope, ele, attr, ctrl) {
                    scope.props = [];
                    scope.excludes = attr.excludefields && attr.excludefields.split(' ');
                    scope.$watch('dataArray', function(newval,oldval,$scope) {
                        scope.props = newval && _.keys(scope.dataArray[0]);
                        scope.props = scope.props && _.difference(scope.props, scope.excludes);
                    })

                    scope.selected;
                    scope.select = function(obj) {
                        scope.selected = obj;
                    };
                }
            }
        })

})(angular || {});
},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJyZXNvdXJjZXMvYXNzZXRzL2pzL0Jpb2luZm9ybWF0aWNzQ29tcC9jb250cm9sbGVycy5qcyIsInJlc291cmNlcy9hc3NldHMvanMvQmlvaW5mb3JtYXRpY3NDb21wL2RpcmVjdGl2ZXMuanMiLCJyZXNvdXJjZXMvYXNzZXRzL2pzL0Jpb2luZm9ybWF0aWNzQ29tcC9tb2R1bGUuanMiLCJyZXNvdXJjZXMvYXNzZXRzL2pzL0Jpb2luZm9ybWF0aWNzQ29tcC9zZXJ2aWNlcy5qcyIsInJlc291cmNlcy9hc3NldHMvanMvYmlvY29tcC1hcHAuanMiLCJyZXNvdXJjZXMvYXNzZXRzL2pzL2NvbmZpZy9nbG9iYWxDb25maWdzLmpzIiwicmVzb3VyY2VzL2Fzc2V0cy9qcy9zaGFyZWREaXJlY3RpdmVzL3RhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgbXppbW1lcm1hbiBvbiA3LzgvMTUuXG4gKi9cblxuKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdCaW9pbmZvcm1hdGljc0NvbnRyb2xsZXJzJywgWydCaW9pbmZvcm1hdGljc1NlcnZpY2VzJ10pXG4gICAgICAgIC5jb250cm9sbGVyKCdCaW9pbmZvcm1hdGljc01haW5Db250cm9sbGVyJywgWyckc2NvcGUnLCAnRGF0YVNldCcsICdCaW9Db21wdXRhdGlvbicsIGZ1bmN0aW9uKCRzY29wZSwgRGF0YVNldCwgQmlvQ29tcHV0YXRpb24pIHtcblxuICAgICAgICAgICAgJHNjb3BlLnBhZ2VIZWFkZXIgPSBcIkNvbmdyYXR1bGF0aW9ucywgQW5ndWxhciBpcyBib290c3RyYXBwZWQhXCI7XG5cbiAgICAgICAgICAgICRzY29wZS5kYXRhc2V0cywgJHNjb3BlLmNvbXB1dGF0aW9ucztcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVEYXRhc2V0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIERhdGFTZXQucXVlcnkoe30sIGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlcy5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGFzZXRzID0gcmVzLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICRzY29wZS51cGRhdGVEYXRhc2V0cygpO1xuXG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlQ29tcHV0YXRpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgQmlvQ29tcHV0YXRpb24ucXVlcnkoe30sIGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlcy5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbXB1dGF0aW9ucyA9IHJlcy5kYXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlQ29tcHV0YXRpb25zKCk7XG5cbiAgICAgICAgfV0pXG5cbn0pKGFuZ3VsYXIgfHwge30pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBtemltbWVybWFuIG9uIDcvOC8xNS5cbiAqL1xuXG4oZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlR2xvYmFsKHN0YXR1cyxtc2cpIHtcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKFsnZGVmYXVsdCcsJ2Vycm9yJywnbG9hZGVkJywndXBsb2FkZWQnLCd1cGxvYWRpbmcnXSwgc3RhdHVzKSkgdGhyb3cgbmV3IEVycm9yKHN0YXR1cyk7XG4gICAgICAgIHRoaXMudXBsb2FkTWFuYWdlci5zdGF0dXMgPSBzdGF0dXM7XG4gICAgICAgIHRoaXMudXBsb2FkTWFuYWdlci5lcnIgPSBtc2cgPyBtc2cgOiBcIlwiO1xuICAgICAgICB0aGlzLiRhcHBseSgpO1xuICAgIH1cblxuICAgIGFuZ3VsYXIubW9kdWxlKCdCaW9pbmZvcm1hdGljc0RpcmVjdGl2ZXMnLCBbJ0Jpb2luZm9ybWF0aWNzU2VydmljZXMnXSlcbiAgICAgICAgLmRpcmVjdGl2ZSgndXBsb2FkTWFuYWdlcicsIGZ1bmN0aW9uKCRjb21waWxlKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZSwgYXR0ciwgY3RybCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdXBkYXRlID0gdXBkYXRlR2xvYmFsLmJpbmQoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIGRhdGEgZnJvbSBhdHRyaWJ1dGVcblxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGR5bmFtaWMgZGlyZWN0aXZlIGFkZFxuICAgICAgICAgICAgICAgICAgICBlbGUucmVtb3ZlQXR0cigndXBsb2FkLW1hbmFnZXInKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlLmF0dHIoJ25nLWNsYXNzJywneycgK1xuICAgICAgICAgICAgICAgICAgICAnXCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI6IHVwbG9hZE1hbmFnZXIuc3RhdHVzID09PSBcImRlZmF1bHRcIiwnICtcbiAgICAgICAgICAgICAgICAgICAgJ1wicGFuZWwgcGFuZWwtd2FybmluZ1wiOiB1cGxvYWRNYW5hZ2VyLnN0YXR1cyA9PT0gXCJsb2FkZWRcIiwnICtcbiAgICAgICAgICAgICAgICAgICAgJ1wicGFuZWwgcGFuZWwtc3VjY2Vzc1wiOiB1cGxvYWRNYW5hZ2VyLnN0YXR1cyA9PT0gXCJ1cGxvYWRlZFwiIHx8IHVwbG9hZE1hbmFnZXIuc3RhdHVzID09PSBcInVwbG9hZGluZ1wiLCcgK1xuICAgICAgICAgICAgICAgICAgICAnXCJwYW5lbCBwYW5lbC1kYW5nZXJcIjogdXBsb2FkTWFuYWdlci5zdGF0dXMgPT09IFwiZXJyb3JcIiB9Jyk7XG4gICAgICAgICAgICAgICAgICAgICRjb21waWxlKGVsZSkoc2NvcGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBhIHVwbG9hZGVyIHN0YXRlXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnVwbG9hZE1hbmFnZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhTmFtZTogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZpZXdEYXRhOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBcImRlZmF1bHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycjogXCJObyBmaWxlIGxvYWRlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YU5hbWUgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaXplID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJldmlld0RhdGEgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gXCJkZWZhdWx0XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnIgPSBcIk5vIGZpbGUgbG9hZGVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5wdXRzID0gYW5ndWxhci5lbGVtZW50KF8uZmlsdGVyKGVsZS5maW5kKCdpbnB1dCcpLCBmdW5jdGlvbihpKSB7IHJldHVybiBpLnR5cGUgPT09IFwiZmlsZVwiOyB9KSk7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0cy5vbignY2hhbmdlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmaWxlLnR5cGUubWF0Y2goXCJ0ZXh0KlwiKSkgcmV0dXJuIHVwZGF0ZShcImVycm9yXCIsXCJJbmNvcnJlY3QgZmlsZSB0eXBlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2NvcGUudXBsb2FkTWFuYWdlci5kYXRhTmFtZSkgc2NvcGUudXBsb2FkTWFuYWdlci5kYXRhTmFtZSA9IGZpbGUubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS51cGxvYWRNYW5hZ2VyLnR5cGUgPSBmaWxlLnR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUudXBsb2FkTWFuYWdlci5zaXplID0gZmlsZS5zaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnVwbG9hZE1hbmFnZXIuZmlsZSA9IGZpbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUudXBsb2FkTWFuYWdlci5kYXRhID0gdGhpcy5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUudXBsb2FkTWFuYWdlci5wcmV2aWV3RGF0YSA9IHRoaXMucmVzdWx0Lmxlbmd0aCA+IDI5OSA/IHRoaXMucmVzdWx0LnNsaWNlKDAsMzAwKSArICcuLi4nIDogdGhpcy5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlKCdsb2FkZWQnLCBcIkZpbGUgbG9hZGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7dXBkYXRlKCdlcnJvcicsICdVbmtub3duIGVycm9yJyl9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIC8qKlxuICAgICAqIHVwbG9hZEZpbGUgLSBkZXBlbmRlbnQgb24gdXBsb2FkTWFuYWdlciwgbXVzdCB1c2UgaW4gdGhlIHNhbWUgc2NvcGVcbiAgICAgKi9cbiAgICAgICAgLmRpcmVjdGl2ZSgndXBsb2FkRmlsZScsIGZ1bmN0aW9uKERhdGFTZXQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlLCBhdHRyLCBjdHJsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB1cGRhdGUgPSB1cGRhdGVHbG9iYWwuYmluZChzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNjb3BlLnVwbG9hZE1hbmFnZXIuZmlsZSkgcmV0dXJuIGFsZXJ0KCd1cGxvYWQgYSBmaWxlLCBzaWxseWtpbnMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZSgndXBsb2FkaW5nJywgJ1VwbG9hZGluZyBkYXRhc2V0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIGEgcmVzb3VyY2UgUE9TVCByZXF1ZXN0XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YXNldCA9IG5ldyBEYXRhU2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzY29wZS51cGxvYWRNYW5hZ2VyLmRhdGFOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IHNjb3BlLnVwbG9hZE1hbmFnZXIuc2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBzY29wZS51cGxvYWRNYW5hZ2VyLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogc2NvcGUudXBsb2FkTWFuYWdlci50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFmaWxlOiBzY29wZS51cGxvYWRNYW5hZ2VyLmZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXNldC4kc2F2ZShmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYS5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoJ2Vycm9yJywgYS5zdGF0dXMgKyAnICcgKyBhLmVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZSgndXBsb2FkZWQnLCAnRmlsZSB1cGxvYWRlZCBzdWNjZXNzZnVsbHknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUudXBkYXRlRGF0YXNldHMoKTsgLy8gZGVwZW5kZW50IG9uIGNvbnRyb2xsZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbn0pKGFuZ3VsYXIgfHwge30pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBtemltbWVybWFuIG9uIDcvOC8xNS5cbiAqL1xuXG5yZXF1aXJlKCcuL3NlcnZpY2VzJyk7XG5yZXF1aXJlKCcuL2NvbnRyb2xsZXJzJyk7XG5yZXF1aXJlKCcuL2RpcmVjdGl2ZXMnKTtcblxuKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdCaW9pbmZvcm1hdGljcycsIFsnQmlvaW5mb3JtYXRpY3NDb250cm9sbGVycycsICdCaW9pbmZvcm1hdGljc0RpcmVjdGl2ZXMnXSk7XG5cbn0pKGFuZ3VsYXIgfHwge30pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBtemltbWVybWFuIG9uIDcvOC8xNS5cbiAqL1xuXG4oZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ0Jpb2luZm9ybWF0aWNzU2VydmljZXMnLCBbJ25nUmVzb3VyY2UnXSlcbiAgICAgICAgLmZhY3RvcnkoJ0RhdGFTZXQnLCBmdW5jdGlvbigkcmVzb3VyY2UpIHtcbiAgICAgICAgICAgIHJldHVybiAkcmVzb3VyY2UoJ2FwaS91cGxvYWQnLCBudWxsLCB7XG4gICAgICAgICAgICAgICAgcXVlcnk6IHttZXRob2Q6IFwiR0VUXCIsIGlzQXJyYXk6IGZhbHNlfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgLmZhY3RvcnkoJ0Jpb0NvbXB1dGF0aW9uJywgZnVuY3Rpb24oJHJlc291cmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gJHJlc291cmNlKCcvYXBpL2NvbXB1dGF0aW9uJywgbnVsbCwge1xuICAgICAgICAgICAgICAgIHF1ZXJ5OiB7bWV0aG9kOiBcIkdFVFwiLCBpc0FycmF5OmZhbHNlfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxufSkoYW5ndWxhciB8fCB7fSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IG16aW1tZXJtYW4gb24gNy84LzE1LlxuICovXG5cbnJlcXVpcmUoJy4vY29uZmlnL2dsb2JhbENvbmZpZ3MnKTtcbnJlcXVpcmUoJy4vQmlvaW5mb3JtYXRpY3NDb21wL21vZHVsZScpO1xucmVxdWlyZSgnLi9zaGFyZWREaXJlY3RpdmVzL3RhYmxlJyk7XG5cbihmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWydMYWJhcHBDb25maWcnLCdCaW9pbmZvcm1hdGljcycsJ1RhYmxlJ10pXG5cbn0pKGFuZ3VsYXIgfHwge30pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBtemltbWVybWFuIG9uIDcvMjAvMTUuXG4gKi9cblxuKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdMYWJhcHBDb25maWcnLCBbXSlcbiAgICAgICAgLmNvbmZpZyhmdW5jdGlvbigkaW50ZXJwb2xhdGVQcm92aWRlciwgJGh0dHBQcm92aWRlcikge1xuICAgICAgICAgICAgLy8gZml4IGludGVycG9sYXRpb24gZm9yIGJsYWRlIHRlbXBsYXRlc1xuICAgICAgICAgICAgJGludGVycG9sYXRlUHJvdmlkZXIuc3RhcnRTeW1ib2woJ1tbJyk7XG4gICAgICAgICAgICAkaW50ZXJwb2xhdGVQcm92aWRlci5lbmRTeW1ib2woJ11dJyk7XG5cbiAgICAgICAgICAgIC8vIHNldCB1cCBYLUNTUkYtVE9LRU4gaGVhZGVycyBvbiBhbnkgY2xpZW50IHJlcXVlc3RzXG4gICAgICAgICAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYLUNTUkYtVE9LRU4nXSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT1cImNzcmZcIl0nKS5jb250ZW50XG4gICAgICAgIH0pXG5cbn0pKGFuZ3VsYXIgfHwge30pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBtemltbWVybWFuIG9uIDcvMjAvMTUuXG4gKi9cblxuXG4vKipcbiAqIFRhYmxlIGRpcmVjdGl2ZVxuICpcbiAqIERlcGVuZGVuY2llczogdW5kZXJzY29yZS5qc1xuICpcbiAqIFRha2Ugc2NvcGUgZGF0YSBhcnJheSBpbiBhdHRyaWJ1dGUgXCJsYWJhcHBkYXRhXCJcbiAqICAgICAgTXVzdCBiZSBhcnJheSBvZiBvYmplY3RzXG4gKlxuICogQ2xpY2sgdG8gc2VsZWN0LCBhbmQgc2VsZWN0ZWQgb2JqZWN0IGlzIHN0b3JlZCBvbiB0aGVcbiAqICAgICAgc2NvcGUgd2l0aCBuYW1lIFwiW2RhdGFvYmplY3RdLXNlbGVjdGVkXCJcbiAqXG4gKiBFeC4gPGxhYmFwcC10YWJsZSBsYWJhcHBkYXRhPVwiYm9va3NcIiBleGNsdWRlPVwiJCRoYXNoS2V5IHBhdGhcIj48L2Rpdj5cbiAqL1xuKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdUYWJsZScsIFtdKVxuICAgICAgICAuZGlyZWN0aXZlKCdsYWJhcHBUYWJsZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFBcnJheTogXCI9bGFiYXBwZGF0YVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RhYmxlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGUsIGF0dHIsIGN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvcHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZXhjbHVkZXMgPSBhdHRyLmV4Y2x1ZGVmaWVsZHMgJiYgYXR0ci5leGNsdWRlZmllbGRzLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgnZGF0YUFycmF5JywgZnVuY3Rpb24obmV3dmFsLG9sZHZhbCwkc2NvcGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb3BzID0gbmV3dmFsICYmIF8ua2V5cyhzY29wZS5kYXRhQXJyYXlbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvcHMgPSBzY29wZS5wcm9wcyAmJiBfLmRpZmZlcmVuY2Uoc2NvcGUucHJvcHMsIHNjb3BlLmV4Y2x1ZGVzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5zZWxlY3RlZDtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2VsZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5zZWxlY3RlZCA9IG9iajtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbn0pKGFuZ3VsYXIgfHwge30pOyJdfQ==
