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