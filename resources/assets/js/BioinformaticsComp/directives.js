/**
 * Created by mzimmerman on 7/8/15.
 */

(function(angular) {

    function updateGlobal(status,msg) {
        if (!_.contains(['default','error','loaded','uploaded','uploading'], status)) throw new Error(status);
        this.uploadManager.status = status;
        this.uploadManager.err = msg ? msg : "";
        this.$apply();
    }

    angular.module('BioinformaticsDirectives', ['BioinformaticsServices'])
        .directive('uploadManager', function($compile) {
            return {
                restrict: 'A',
                link: function(scope, ele, attr, ctrl) {
                    var update = updateGlobal.bind(scope);
                    // save data from attribute


                    // dynamic directive add
                    ele.removeAttr('upload-manager');
                    ele.attr('ng-class','{' +
                    '"panel panel-default": uploadManager.status === "default",' +
                    '"panel panel-warning": uploadManager.status === "loaded",' +
                    '"panel panel-success": uploadManager.status === "uploaded" || uploadManager.status === "uploading",' +
                    '"panel panel-danger": uploadManager.status === "error" }');
                    $compile(ele)(scope);

                    // create a uploader state
                    scope.uploadManager = {
                        dataName: "",
                        data: "",
                        size: 0,
                        type: "",
                        previewData: "",
                        status: "default",
                        err: "No file loaded",
                        reset: function() {
                            this.dataName = "";
                            this.data = "";
                            this.size = 0;
                            this.type = "";
                            this.previewData = "";
                            this.status = "default";
                            this.err = "No file loaded"
                        }
                    };

                    var inputs = angular.element(_.filter(ele.find('input'), function(i) { return i.type === "file"; }));
                    inputs.on('change', function(event) {
                        var file = event.target.files[0];
                        if (!file.type.match("text*")) return update("error","Incorrect file type");
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            if (!scope.uploadManager.dataName) scope.uploadManager.dataName = file.name;
                            scope.uploadManager.type = file.type;
                            scope.uploadManager.size = file.size;
                            scope.uploadManager.file = file;
                            scope.uploadManager.data = this.result;
                            scope.uploadManager.previewData = this.result.length > 299 ? this.result.slice(0,300) + '...' : this.result;
                            update('loaded', "File loaded");
                        };
                        reader.onerror = function() {update('error', 'Unknown error')};
                        reader.readAsText(file);
                    })
                }
            }
        })
    /**
     * uploadFile - dependent on uploadManager, must use in the same scope
     */
        .directive('uploadFile', function(DataSet) {
            return {
                restrict: 'A',
                link: function(scope, ele, attr, ctrl) {
                    var update = updateGlobal.bind(scope);
                    ele.on('click', function(event) {
                        event.stopImmediatePropagation();
                        if (!scope.uploadManager.file) return alert('upload a file, sillykins');
                        update('uploading', 'Uploading dataset');
                        // make a resource POST request
                        var dataset = new DataSet({
                            name: scope.uploadManager.dataName,
                            size: scope.uploadManager.size,
                            data: scope.uploadManager.data,
                            type: scope.uploadManager.type,
                            datafile: scope.uploadManager.file
                        });
                        dataset.$save(function(a,b) {
                            if (a.error) {
                                update('error', a.status + ' ' + a.error);
                            }
                            else {
                                update('uploaded', 'File uploaded successfully');
                                scope.updateDatasets(); // dependent on controller
                            }
                        });
                    })
                }
            }
        })

})(angular || {});