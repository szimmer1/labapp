/**
 * Created by mzimmerman on 7/8/15.
 */

require('./services');
require('./controllers');
require('./directives');

(function(angular) {

    angular.module('Bioinformatics', ['BioinformaticsControllers', 'BioinformaticsDirectives']);

})(angular || {});