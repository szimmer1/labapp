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