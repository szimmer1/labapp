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