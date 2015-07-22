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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJyZXNvdXJjZXMvYXNzZXRzL2pzL2NvbmZpZy9nbG9iYWxDb25maWdzLmpzIiwicmVzb3VyY2VzL2Fzc2V0cy9qcy9xYy1hcHAuanMiLCJyZXNvdXJjZXMvYXNzZXRzL2pzL3NoYXJlZERpcmVjdGl2ZXMvdGFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgbXppbW1lcm1hbiBvbiA3LzIwLzE1LlxuICovXG5cbihmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnTGFiYXBwQ29uZmlnJywgW10pXG4gICAgICAgIC5jb25maWcoZnVuY3Rpb24oJGludGVycG9sYXRlUHJvdmlkZXIsICRodHRwUHJvdmlkZXIpIHtcbiAgICAgICAgICAgIC8vIGZpeCBpbnRlcnBvbGF0aW9uIGZvciBibGFkZSB0ZW1wbGF0ZXNcbiAgICAgICAgICAgICRpbnRlcnBvbGF0ZVByb3ZpZGVyLnN0YXJ0U3ltYm9sKCdbWycpO1xuICAgICAgICAgICAgJGludGVycG9sYXRlUHJvdmlkZXIuZW5kU3ltYm9sKCddXScpO1xuXG4gICAgICAgICAgICAvLyBzZXQgdXAgWC1DU1JGLVRPS0VOIGhlYWRlcnMgb24gYW55IGNsaWVudCByZXF1ZXN0c1xuICAgICAgICAgICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1DU1JGLVRPS0VOJ10gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCJjc3JmXCJdJykuY29udGVudFxuICAgICAgICB9KVxuXG59KShhbmd1bGFyIHx8IHt9KTsiLCJyZXF1aXJlKCcuL3NoYXJlZERpcmVjdGl2ZXMvdGFibGUnKTtcbnJlcXVpcmUoJy4vY29uZmlnL2dsb2JhbENvbmZpZ3MnKTtcblxuKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ0xhYmFwcENvbmZpZycsICdUYWJsZSddKVxuXG59KShhbmd1bGFyIHx8IHt9KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgbXppbW1lcm1hbiBvbiA3LzIwLzE1LlxuICovXG5cblxuLyoqXG4gKiBUYWJsZSBkaXJlY3RpdmVcbiAqXG4gKiBEZXBlbmRlbmNpZXM6IHVuZGVyc2NvcmUuanNcbiAqXG4gKiBUYWtlIHNjb3BlIGRhdGEgYXJyYXkgaW4gYXR0cmlidXRlIFwibGFiYXBwZGF0YVwiXG4gKiAgICAgIE11c3QgYmUgYXJyYXkgb2Ygb2JqZWN0c1xuICpcbiAqIENsaWNrIHRvIHNlbGVjdCwgYW5kIHNlbGVjdGVkIG9iamVjdCBpcyBzdG9yZWQgb24gdGhlXG4gKiAgICAgIHNjb3BlIHdpdGggbmFtZSBcIltkYXRhb2JqZWN0XS1zZWxlY3RlZFwiXG4gKlxuICogRXguIDxsYWJhcHAtdGFibGUgbGFiYXBwZGF0YT1cImJvb2tzXCIgZXhjbHVkZT1cIiQkaGFzaEtleSBwYXRoXCI+PC9kaXY+XG4gKi9cbihmdW5jdGlvbihhbmd1bGFyKSB7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnVGFibGUnLCBbXSlcbiAgICAgICAgLmRpcmVjdGl2ZSgnbGFiYXBwVGFibGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgICAgICBkYXRhQXJyYXk6IFwiPWxhYmFwcGRhdGFcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0YWJsZS5odG1sJyxcbiAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlLCBhdHRyLCBjdHJsKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb3BzID0gW107XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmV4Y2x1ZGVzID0gYXR0ci5leGNsdWRlZmllbGRzICYmIGF0dHIuZXhjbHVkZWZpZWxkcy5zcGxpdCgnICcpO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goJ2RhdGFBcnJheScsIGZ1bmN0aW9uKG5ld3ZhbCxvbGR2YWwsJHNjb3BlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5wcm9wcyA9IG5ld3ZhbCAmJiBfLmtleXMoc2NvcGUuZGF0YUFycmF5WzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb3BzID0gc2NvcGUucHJvcHMgJiYgXy5kaWZmZXJlbmNlKHNjb3BlLnByb3BzLCBzY29wZS5leGNsdWRlcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2VsZWN0ZWQ7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2VsZWN0ZWQgPSBvYmo7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG59KShhbmd1bGFyIHx8IHt9KTsiXX0=
