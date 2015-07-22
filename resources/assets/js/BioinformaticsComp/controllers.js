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