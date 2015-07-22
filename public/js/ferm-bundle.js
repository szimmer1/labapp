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
},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJyZXNvdXJjZXMvYXNzZXRzL2pzL2NvbmZpZy9nbG9iYWxDb25maWdzLmpzIiwicmVzb3VyY2VzL2Fzc2V0cy9qcy9mZXJtLWFwcC5qcyIsInJlc291cmNlcy9hc3NldHMvanMvc2hhcmVkRGlyZWN0aXZlcy90YWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBtemltbWVybWFuIG9uIDcvMjAvMTUuXG4gKi9cblxuKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdMYWJhcHBDb25maWcnLCBbXSlcbiAgICAgICAgLmNvbmZpZyhmdW5jdGlvbigkaW50ZXJwb2xhdGVQcm92aWRlciwgJGh0dHBQcm92aWRlcikge1xuICAgICAgICAgICAgLy8gZml4IGludGVycG9sYXRpb24gZm9yIGJsYWRlIHRlbXBsYXRlc1xuICAgICAgICAgICAgJGludGVycG9sYXRlUHJvdmlkZXIuc3RhcnRTeW1ib2woJ1tbJyk7XG4gICAgICAgICAgICAkaW50ZXJwb2xhdGVQcm92aWRlci5lbmRTeW1ib2woJ11dJyk7XG5cbiAgICAgICAgICAgIC8vIHNldCB1cCBYLUNTUkYtVE9LRU4gaGVhZGVycyBvbiBhbnkgY2xpZW50IHJlcXVlc3RzXG4gICAgICAgICAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYLUNTUkYtVE9LRU4nXSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT1cImNzcmZcIl0nKS5jb250ZW50XG4gICAgICAgIH0pXG5cbn0pKGFuZ3VsYXIgfHwge30pOyIsInJlcXVpcmUoJy4vc2hhcmVkRGlyZWN0aXZlcy90YWJsZScpO1xucmVxdWlyZSgnLi9jb25maWcvZ2xvYmFsQ29uZmlncycpO1xuXG4oZnVuY3Rpb24oYW5ndWxhcikge1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsnTGFiYXBwQ29uZmlnJywgJ1RhYmxlJ10pXG5cbn0pKGFuZ3VsYXIgfHwge30pOyIsIi8qKlxuICogQ3JlYXRlZCBieSBtemltbWVybWFuIG9uIDcvMjAvMTUuXG4gKi9cblxuXG4vKipcbiAqIFRhYmxlIGRpcmVjdGl2ZVxuICpcbiAqIERlcGVuZGVuY2llczogdW5kZXJzY29yZS5qc1xuICpcbiAqIFRha2Ugc2NvcGUgZGF0YSBhcnJheSBpbiBhdHRyaWJ1dGUgXCJsYWJhcHBkYXRhXCJcbiAqICAgICAgTXVzdCBiZSBhcnJheSBvZiBvYmplY3RzXG4gKlxuICogQ2xpY2sgdG8gc2VsZWN0LCBhbmQgc2VsZWN0ZWQgb2JqZWN0IGlzIHN0b3JlZCBvbiB0aGVcbiAqICAgICAgc2NvcGUgd2l0aCBuYW1lIFwiW2RhdGFvYmplY3RdLXNlbGVjdGVkXCJcbiAqXG4gKiBFeC4gPGxhYmFwcC10YWJsZSBsYWJhcHBkYXRhPVwiYm9va3NcIiBleGNsdWRlPVwiJCRoYXNoS2V5IHBhdGhcIj48L2Rpdj5cbiAqL1xuKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdUYWJsZScsIFtdKVxuICAgICAgICAuZGlyZWN0aXZlKCdsYWJhcHBUYWJsZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFBcnJheTogXCI9bGFiYXBwZGF0YVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RhYmxlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGUsIGF0dHIsIGN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvcHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZXhjbHVkZXMgPSBhdHRyLmV4Y2x1ZGVmaWVsZHMgJiYgYXR0ci5leGNsdWRlZmllbGRzLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgnZGF0YUFycmF5JywgZnVuY3Rpb24obmV3dmFsLG9sZHZhbCwkc2NvcGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb3BzID0gbmV3dmFsICYmIF8ua2V5cyhzY29wZS5kYXRhQXJyYXlbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvcHMgPSBzY29wZS5wcm9wcyAmJiBfLmRpZmZlcmVuY2Uoc2NvcGUucHJvcHMsIHNjb3BlLmV4Y2x1ZGVzKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5zZWxlY3RlZDtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2VsZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5zZWxlY3RlZCA9IG9iajtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbn0pKGFuZ3VsYXIgfHwge30pOyJdfQ==
