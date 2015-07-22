(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
require('./sharedDirectives/table');
require('./config/globalConfigs');

(function(angular) {

    angular.module('app', ['LabappConfig', 'Table'])

})(angular || {});
},{"./config/globalConfigs":1,"./sharedDirectives/table":3}],3:[function(require,module,exports){
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
},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJyZXNvdXJjZXMvYXNzZXRzL2pzL2NvbmZpZy9nbG9iYWxDb25maWdzLmpzIiwicmVzb3VyY2VzL2Fzc2V0cy9qcy9mZXJtLWFwcC5qcyIsInJlc291cmNlcy9hc3NldHMvanMvc2hhcmVkRGlyZWN0aXZlcy90YWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IG16aW1tZXJtYW4gb24gNy8yMC8xNS5cbiAqL1xuXG4oZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ0xhYmFwcENvbmZpZycsIFtdKVxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uKCRpbnRlcnBvbGF0ZVByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKSB7XG4gICAgICAgICAgICAvLyBmaXggaW50ZXJwb2xhdGlvbiBmb3IgYmxhZGUgdGVtcGxhdGVzXG4gICAgICAgICAgICAkaW50ZXJwb2xhdGVQcm92aWRlci5zdGFydFN5bWJvbCgnW1snKTtcbiAgICAgICAgICAgICRpbnRlcnBvbGF0ZVByb3ZpZGVyLmVuZFN5bWJvbCgnXV0nKTtcblxuICAgICAgICAgICAgLy8gc2V0IHVwIFgtQ1NSRi1UT0tFTiBoZWFkZXJzIG9uIGFueSBjbGllbnQgcmVxdWVzdHNcbiAgICAgICAgICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQ1NSRi1UT0tFTiddID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPVwiY3NyZlwiXScpLmNvbnRlbnRcbiAgICAgICAgfSlcblxufSkoYW5ndWxhciB8fCB7fSk7IiwicmVxdWlyZSgnLi9zaGFyZWREaXJlY3RpdmVzL3RhYmxlJyk7XG5yZXF1aXJlKCcuL2NvbmZpZy9nbG9iYWxDb25maWdzJyk7XG5cbihmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWydMYWJhcHBDb25maWcnLCAnVGFibGUnXSlcblxufSkoYW5ndWxhciB8fCB7fSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IG16aW1tZXJtYW4gb24gNy8yMC8xNS5cbiAqL1xuXG5cbi8qKlxuICogVGFibGUgZGlyZWN0aXZlXG4gKlxuICogRGVwZW5kZW5jaWVzOiB1bmRlcnNjb3JlLmpzXG4gKlxuICogVGFrZSBzY29wZSBkYXRhIGFycmF5IGluIGF0dHJpYnV0ZSBcImxhYmFwcGRhdGFcIlxuICogICAgICBNdXN0IGJlIGFycmF5IG9mIG9iamVjdHNcbiAqXG4gKiBDbGljayB0byBzZWxlY3QsIGFuZCBzZWxlY3RlZCBvYmplY3QgaXMgc3RvcmVkIG9uIHRoZVxuICogICAgICBzY29wZSB3aXRoIG5hbWUgXCJbZGF0YW9iamVjdF0tc2VsZWN0ZWRcIlxuICpcbiAqIEV4LiA8bGFiYXBwLXRhYmxlIGxhYmFwcGRhdGE9XCJib29rc1wiIGV4Y2x1ZGU9XCIkJGhhc2hLZXkgcGF0aFwiPjwvZGl2PlxuICovXG4oZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ1RhYmxlJywgW10pXG4gICAgICAgIC5kaXJlY3RpdmUoJ2xhYmFwcFRhYmxlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YUFycmF5OiBcIj1sYWJhcHBkYXRhXCIsXG4gICAgICAgICAgICAgICAgICAgIF9zZWxlY3RlZDogXCI9bGFiYXBwc2VsZWN0ZWRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0YWJsZS5odG1sJyxcbiAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlLCBhdHRyLCBjdHJsKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb3BzID0gW107XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmV4Y2x1ZGVzID0gYXR0ci5leGNsdWRlZmllbGRzICYmIGF0dHIuZXhjbHVkZWZpZWxkcy5zcGxpdCgnICcpO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goJ2RhdGFBcnJheScsIGZ1bmN0aW9uKG5ld3ZhbCxvbGR2YWwsJHNjb3BlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5wcm9wcyA9IG5ld3ZhbCAmJiBfLmtleXMoc2NvcGUuZGF0YUFycmF5WzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb3BzID0gc2NvcGUucHJvcHMgJiYgXy5kaWZmZXJlbmNlKHNjb3BlLnByb3BzLCBzY29wZS5leGNsdWRlcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2VsZWN0ZWQgPSBzY29wZS5fc2VsZWN0ZWQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5zZWxlY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnNlbGVjdGVkID0gc2NvcGUuX3NlbGVjdGVkID0gb2JqO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxufSkoYW5ndWxhciB8fCB7fSk7Il19
