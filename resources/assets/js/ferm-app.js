require('./sharedDirectives/table');
require('./config/globalConfigs');

(function(angular) {

    angular.module('app', ['LabappConfig', 'Table'])

})(angular || {});