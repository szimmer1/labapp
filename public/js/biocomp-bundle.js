(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by mzimmerman on 7/8/15.
 */

(function(angular) {

    angular.module('BioinformaticsControllers', ['BioinformaticsServices'])
        .controller('BioinformaticsMainController', ['$scope', 'DataSet', 'BioComputation', function($scope, DataSet, BioComputation) {

            $scope.pageHeader = "Congratulations, Angular is bootstrapped!";

            $scope.datasets, $scope.computations
            $scope.selectedDataset, $scope.selectedComputation;

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

            // watcher to test directive
            $scope.$watch('selectedDataset', function(newval,oldval,scope) {
                if (newval) alert("New selected object on controller scope! \n\n"+JSON.stringify(newval));
            })
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
                    dataArray: "=labappdata",
                    _selected: "=labappselected"
                },
                templateUrl: 'table.html',
                link: function(scope, ele, attr, ctrl) {
                    scope.props = [];
                    scope.excludes = attr.excludefields && attr.excludefields.split(' ');
                    scope.$watch('dataArray', function(newval,oldval,$scope) {
                        scope.props = newval && _.keys(scope.dataArray[0]);
                        scope.props = scope.props && _.difference(scope.props, scope.excludes);
                    })

                    scope.selected = scope._selected = null;
                    scope.select = function(obj) {
                        scope.selected = scope._selected = obj;
                    };
                }
            }
        })

})(angular || {});
},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJyZXNvdXJjZXMvYXNzZXRzL2pzL0Jpb2luZm9ybWF0aWNzQ29tcC9jb250cm9sbGVycy5qcyIsInJlc291cmNlcy9hc3NldHMvanMvQmlvaW5mb3JtYXRpY3NDb21wL2RpcmVjdGl2ZXMuanMiLCJyZXNvdXJjZXMvYXNzZXRzL2pzL0Jpb2luZm9ybWF0aWNzQ29tcC9tb2R1bGUuanMiLCJyZXNvdXJjZXMvYXNzZXRzL2pzL0Jpb2luZm9ybWF0aWNzQ29tcC9zZXJ2aWNlcy5qcyIsInJlc291cmNlcy9hc3NldHMvanMvYmlvY29tcC1hcHAuanMiLCJyZXNvdXJjZXMvYXNzZXRzL2pzL2NvbmZpZy9nbG9iYWxDb25maWdzLmpzIiwicmVzb3VyY2VzL2Fzc2V0cy9qcy9zaGFyZWREaXJlY3RpdmVzL3RhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBtemltbWVybWFuIG9uIDcvOC8xNS5cbiAqL1xuXG4oZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ0Jpb2luZm9ybWF0aWNzQ29udHJvbGxlcnMnLCBbJ0Jpb2luZm9ybWF0aWNzU2VydmljZXMnXSlcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0Jpb2luZm9ybWF0aWNzTWFpbkNvbnRyb2xsZXInLCBbJyRzY29wZScsICdEYXRhU2V0JywgJ0Jpb0NvbXB1dGF0aW9uJywgZnVuY3Rpb24oJHNjb3BlLCBEYXRhU2V0LCBCaW9Db21wdXRhdGlvbikge1xuXG4gICAgICAgICAgICAkc2NvcGUucGFnZUhlYWRlciA9IFwiQ29uZ3JhdHVsYXRpb25zLCBBbmd1bGFyIGlzIGJvb3RzdHJhcHBlZCFcIjtcblxuICAgICAgICAgICAgJHNjb3BlLmRhdGFzZXRzLCAkc2NvcGUuY29tcHV0YXRpb25zXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWREYXRhc2V0LCAkc2NvcGUuc2VsZWN0ZWRDb21wdXRhdGlvbjtcblxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZURhdGFzZXRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgRGF0YVNldC5xdWVyeSh7fSwgZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YXNldHMgPSByZXMuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZURhdGFzZXRzKCk7XG5cbiAgICAgICAgICAgICRzY29wZS51cGRhdGVDb21wdXRhdGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBCaW9Db21wdXRhdGlvbi5xdWVyeSh7fSwgZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29tcHV0YXRpb25zID0gcmVzLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICRzY29wZS51cGRhdGVDb21wdXRhdGlvbnMoKTtcblxuICAgICAgICAgICAgLy8gd2F0Y2hlciB0byB0ZXN0IGRpcmVjdGl2ZVxuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnc2VsZWN0ZWREYXRhc2V0JywgZnVuY3Rpb24obmV3dmFsLG9sZHZhbCxzY29wZSkge1xuICAgICAgICAgICAgICAgIGlmIChuZXd2YWwpIGFsZXJ0KFwiTmV3IHNlbGVjdGVkIG9iamVjdCBvbiBjb250cm9sbGVyIHNjb3BlISBcXG5cXG5cIitKU09OLnN0cmluZ2lmeShuZXd2YWwpKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1dKVxuXG59KShhbmd1bGFyIHx8IHt9KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgbXppbW1lcm1hbiBvbiA3LzgvMTUuXG4gKi9cblxuKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUdsb2JhbChzdGF0dXMsbXNnKSB7XG4gICAgICAgIGlmICghXy5jb250YWlucyhbJ2RlZmF1bHQnLCdlcnJvcicsJ2xvYWRlZCcsJ3VwbG9hZGVkJywndXBsb2FkaW5nJ10sIHN0YXR1cykpIHRocm93IG5ldyBFcnJvcihzdGF0dXMpO1xuICAgICAgICB0aGlzLnVwbG9hZE1hbmFnZXIuc3RhdHVzID0gc3RhdHVzO1xuICAgICAgICB0aGlzLnVwbG9hZE1hbmFnZXIuZXJyID0gbXNnID8gbXNnIDogXCJcIjtcbiAgICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICB9XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnQmlvaW5mb3JtYXRpY3NEaXJlY3RpdmVzJywgWydCaW9pbmZvcm1hdGljc1NlcnZpY2VzJ10pXG4gICAgICAgIC5kaXJlY3RpdmUoJ3VwbG9hZE1hbmFnZXInLCBmdW5jdGlvbigkY29tcGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGUsIGF0dHIsIGN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVwZGF0ZSA9IHVwZGF0ZUdsb2JhbC5iaW5kKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2F2ZSBkYXRhIGZyb20gYXR0cmlidXRlXG5cblxuICAgICAgICAgICAgICAgICAgICAvLyBkeW5hbWljIGRpcmVjdGl2ZSBhZGRcbiAgICAgICAgICAgICAgICAgICAgZWxlLnJlbW92ZUF0dHIoJ3VwbG9hZC1tYW5hZ2VyJyk7XG4gICAgICAgICAgICAgICAgICAgIGVsZS5hdHRyKCduZy1jbGFzcycsJ3snICtcbiAgICAgICAgICAgICAgICAgICAgJ1wicGFuZWwgcGFuZWwtZGVmYXVsdFwiOiB1cGxvYWRNYW5hZ2VyLnN0YXR1cyA9PT0gXCJkZWZhdWx0XCIsJyArXG4gICAgICAgICAgICAgICAgICAgICdcInBhbmVsIHBhbmVsLXdhcm5pbmdcIjogdXBsb2FkTWFuYWdlci5zdGF0dXMgPT09IFwibG9hZGVkXCIsJyArXG4gICAgICAgICAgICAgICAgICAgICdcInBhbmVsIHBhbmVsLXN1Y2Nlc3NcIjogdXBsb2FkTWFuYWdlci5zdGF0dXMgPT09IFwidXBsb2FkZWRcIiB8fCB1cGxvYWRNYW5hZ2VyLnN0YXR1cyA9PT0gXCJ1cGxvYWRpbmdcIiwnICtcbiAgICAgICAgICAgICAgICAgICAgJ1wicGFuZWwgcGFuZWwtZGFuZ2VyXCI6IHVwbG9hZE1hbmFnZXIuc3RhdHVzID09PSBcImVycm9yXCIgfScpO1xuICAgICAgICAgICAgICAgICAgICAkY29tcGlsZShlbGUpKHNjb3BlKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgYSB1cGxvYWRlciBzdGF0ZVxuICAgICAgICAgICAgICAgICAgICBzY29wZS51cGxvYWRNYW5hZ2VyID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YU5hbWU6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2aWV3RGF0YTogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogXCJkZWZhdWx0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnI6IFwiTm8gZmlsZSBsb2FkZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFOYW1lID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50eXBlID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXZpZXdEYXRhID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFwiZGVmYXVsdFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyID0gXCJObyBmaWxlIGxvYWRlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGlucHV0cyA9IGFuZ3VsYXIuZWxlbWVudChfLmZpbHRlcihlbGUuZmluZCgnaW5wdXQnKSwgZnVuY3Rpb24oaSkgeyByZXR1cm4gaS50eXBlID09PSBcImZpbGVcIjsgfSkpO1xuICAgICAgICAgICAgICAgICAgICBpbnB1dHMub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZmlsZS50eXBlLm1hdGNoKFwidGV4dCpcIikpIHJldHVybiB1cGRhdGUoXCJlcnJvclwiLFwiSW5jb3JyZWN0IGZpbGUgdHlwZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNjb3BlLnVwbG9hZE1hbmFnZXIuZGF0YU5hbWUpIHNjb3BlLnVwbG9hZE1hbmFnZXIuZGF0YU5hbWUgPSBmaWxlLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUudXBsb2FkTWFuYWdlci50eXBlID0gZmlsZS50eXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnVwbG9hZE1hbmFnZXIuc2l6ZSA9IGZpbGUuc2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS51cGxvYWRNYW5hZ2VyLmZpbGUgPSBmaWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnVwbG9hZE1hbmFnZXIuZGF0YSA9IHRoaXMucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnVwbG9hZE1hbmFnZXIucHJldmlld0RhdGEgPSB0aGlzLnJlc3VsdC5sZW5ndGggPiAyOTkgPyB0aGlzLnJlc3VsdC5zbGljZSgwLDMwMCkgKyAnLi4uJyA6IHRoaXMucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZSgnbG9hZGVkJywgXCJGaWxlIGxvYWRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge3VwZGF0ZSgnZXJyb3InLCAnVW5rbm93biBlcnJvcicpfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAvKipcbiAgICAgKiB1cGxvYWRGaWxlIC0gZGVwZW5kZW50IG9uIHVwbG9hZE1hbmFnZXIsIG11c3QgdXNlIGluIHRoZSBzYW1lIHNjb3BlXG4gICAgICovXG4gICAgICAgIC5kaXJlY3RpdmUoJ3VwbG9hZEZpbGUnLCBmdW5jdGlvbihEYXRhU2V0KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZSwgYXR0ciwgY3RybCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdXBkYXRlID0gdXBkYXRlR2xvYmFsLmJpbmQoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICBlbGUub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzY29wZS51cGxvYWRNYW5hZ2VyLmZpbGUpIHJldHVybiBhbGVydCgndXBsb2FkIGEgZmlsZSwgc2lsbHlraW5zJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoJ3VwbG9hZGluZycsICdVcGxvYWRpbmcgZGF0YXNldCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSBhIHJlc291cmNlIFBPU1QgcmVxdWVzdFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFzZXQgPSBuZXcgRGF0YVNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogc2NvcGUudXBsb2FkTWFuYWdlci5kYXRhTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplOiBzY29wZS51cGxvYWRNYW5hZ2VyLnNpemUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogc2NvcGUudXBsb2FkTWFuYWdlci5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHNjb3BlLnVwbG9hZE1hbmFnZXIudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhZmlsZTogc2NvcGUudXBsb2FkTWFuYWdlci5maWxlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFzZXQuJHNhdmUoZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlKCdlcnJvcicsIGEuc3RhdHVzICsgJyAnICsgYS5lcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoJ3VwbG9hZGVkJywgJ0ZpbGUgdXBsb2FkZWQgc3VjY2Vzc2Z1bGx5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnVwZGF0ZURhdGFzZXRzKCk7IC8vIGRlcGVuZGVudCBvbiBjb250cm9sbGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG59KShhbmd1bGFyIHx8IHt9KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgbXppbW1lcm1hbiBvbiA3LzgvMTUuXG4gKi9cblxucmVxdWlyZSgnLi9zZXJ2aWNlcycpO1xucmVxdWlyZSgnLi9jb250cm9sbGVycycpO1xucmVxdWlyZSgnLi9kaXJlY3RpdmVzJyk7XG5cbihmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnQmlvaW5mb3JtYXRpY3MnLCBbJ0Jpb2luZm9ybWF0aWNzQ29udHJvbGxlcnMnLCAnQmlvaW5mb3JtYXRpY3NEaXJlY3RpdmVzJ10pO1xuXG59KShhbmd1bGFyIHx8IHt9KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgbXppbW1lcm1hbiBvbiA3LzgvMTUuXG4gKi9cblxuKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdCaW9pbmZvcm1hdGljc1NlcnZpY2VzJywgWyduZ1Jlc291cmNlJ10pXG4gICAgICAgIC5mYWN0b3J5KCdEYXRhU2V0JywgZnVuY3Rpb24oJHJlc291cmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gJHJlc291cmNlKCdhcGkvdXBsb2FkJywgbnVsbCwge1xuICAgICAgICAgICAgICAgIHF1ZXJ5OiB7bWV0aG9kOiBcIkdFVFwiLCBpc0FycmF5OiBmYWxzZX1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIC5mYWN0b3J5KCdCaW9Db21wdXRhdGlvbicsIGZ1bmN0aW9uKCRyZXNvdXJjZSkge1xuICAgICAgICAgICAgcmV0dXJuICRyZXNvdXJjZSgnL2FwaS9jb21wdXRhdGlvbicsIG51bGwsIHtcbiAgICAgICAgICAgICAgICBxdWVyeToge21ldGhvZDogXCJHRVRcIiwgaXNBcnJheTpmYWxzZX1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbn0pKGFuZ3VsYXIgfHwge30pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBtemltbWVybWFuIG9uIDcvOC8xNS5cbiAqL1xuXG5yZXF1aXJlKCcuL2NvbmZpZy9nbG9iYWxDb25maWdzJyk7XG5yZXF1aXJlKCcuL0Jpb2luZm9ybWF0aWNzQ29tcC9tb2R1bGUnKTtcbnJlcXVpcmUoJy4vc2hhcmVkRGlyZWN0aXZlcy90YWJsZScpO1xuXG4oZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsnTGFiYXBwQ29uZmlnJywnQmlvaW5mb3JtYXRpY3MnLCdUYWJsZSddKVxuXG59KShhbmd1bGFyIHx8IHt9KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgbXppbW1lcm1hbiBvbiA3LzIwLzE1LlxuICovXG5cbihmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnTGFiYXBwQ29uZmlnJywgW10pXG4gICAgICAgIC5jb25maWcoZnVuY3Rpb24oJGludGVycG9sYXRlUHJvdmlkZXIsICRodHRwUHJvdmlkZXIpIHtcbiAgICAgICAgICAgIC8vIGZpeCBpbnRlcnBvbGF0aW9uIGZvciBibGFkZSB0ZW1wbGF0ZXNcbiAgICAgICAgICAgICRpbnRlcnBvbGF0ZVByb3ZpZGVyLnN0YXJ0U3ltYm9sKCdbWycpO1xuICAgICAgICAgICAgJGludGVycG9sYXRlUHJvdmlkZXIuZW5kU3ltYm9sKCddXScpO1xuXG4gICAgICAgICAgICAvLyBzZXQgdXAgWC1DU1JGLVRPS0VOIGhlYWRlcnMgb24gYW55IGNsaWVudCByZXF1ZXN0c1xuICAgICAgICAgICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1DU1JGLVRPS0VOJ10gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCJjc3JmXCJdJykuY29udGVudFxuICAgICAgICB9KVxuXG59KShhbmd1bGFyIHx8IHt9KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgbXppbW1lcm1hbiBvbiA3LzIwLzE1LlxuICovXG5cblxuLyoqXG4gKiBUYWJsZSBkaXJlY3RpdmVcbiAqXG4gKiBEZXBlbmRlbmNpZXM6IHVuZGVyc2NvcmUuanNcbiAqXG4gKiBUYWtlIHNjb3BlIGRhdGEgYXJyYXkgaW4gYXR0cmlidXRlIFwibGFiYXBwZGF0YVwiXG4gKiAgICAgIE11c3QgYmUgYXJyYXkgb2Ygb2JqZWN0c1xuICpcbiAqIENsaWNrIHRvIHNlbGVjdCwgYW5kIHNlbGVjdGVkIG9iamVjdCBpcyBzdG9yZWQgb24gdGhlXG4gKiAgICAgIHNjb3BlIHdpdGggbmFtZSBcIltkYXRhb2JqZWN0XS1zZWxlY3RlZFwiXG4gKlxuICogRXguIDxsYWJhcHAtdGFibGUgbGFiYXBwZGF0YT1cImJvb2tzXCIgZXhjbHVkZT1cIiQkaGFzaEtleSBwYXRoXCI+PC9kaXY+XG4gKi9cbihmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnVGFibGUnLCBbXSlcbiAgICAgICAgLmRpcmVjdGl2ZSgnbGFiYXBwVGFibGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgICAgICBkYXRhQXJyYXk6IFwiPWxhYmFwcGRhdGFcIixcbiAgICAgICAgICAgICAgICAgICAgX3NlbGVjdGVkOiBcIj1sYWJhcHBzZWxlY3RlZFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RhYmxlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGUsIGF0dHIsIGN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvcHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZXhjbHVkZXMgPSBhdHRyLmV4Y2x1ZGVmaWVsZHMgJiYgYXR0ci5leGNsdWRlZmllbGRzLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgnZGF0YUFycmF5JywgZnVuY3Rpb24obmV3dmFsLG9sZHZhbCwkc2NvcGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb3BzID0gbmV3dmFsICYmIF8ua2V5cyhzY29wZS5kYXRhQXJyYXlbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvcHMgPSBzY29wZS5wcm9wcyAmJiBfLmRpZmZlcmVuY2Uoc2NvcGUucHJvcHMsIHNjb3BlLmV4Y2x1ZGVzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5zZWxlY3RlZCA9IHNjb3BlLl9zZWxlY3RlZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2VsZWN0ZWQgPSBzY29wZS5fc2VsZWN0ZWQgPSBvYmo7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG59KShhbmd1bGFyIHx8IHt9KTsiXX0=
