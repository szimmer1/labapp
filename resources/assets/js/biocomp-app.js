/**
 * Created by mzimmerman on 7/8/15.
 */

require('./config/globalConfigs');
require('./BioinformaticsComp/module');
require('./sharedDirectives/table');

(function(angular) {

    angular.module('app', ['LabappConfig','Bioinformatics','Table'])

})(angular || {});