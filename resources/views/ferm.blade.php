@extends('layouts.default')

@section('content')
    <div id="page-wrapper" ng-app="app" ng-cloak>
        <div class="container">
            <h1>[[ pageHeader ]]</h1>
            <div class="row">

                <div upload-manager>
                    <div ng-show="uploadManager.status !== 'uploaded'">
                        <input type="file" />
                        <button upload-file class="btn btn-primary">Upload</button>
                        <input ng-model="uploadManager.dataName" type="text" placeholder="Data set name"/>
                        <p>[[ uploadManager.err ]]</p>
                        <p>[[ uploadManager.previewData ]]</p>
                    </div>
                    <img ng-show="uploadManager.status === 'uploading'" src="/img/loading.gif"/>
                    <div ng-show="uploadManager.status === 'uploaded'">
                        <h1>Success!</h1>
                        <button ng-click="uploadManager.reset()" class="btn btn-primary">Upload another?</button>
                    </div>
                </div>

            </div>

            <div class="row">
                <div class="col col-md-4">
                    <table class="table table-condensed">
                        <thead>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th>uploaded</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr ng-repeat="ds in datasets">
                            <td>[[ ds.id ]]</td>
                            <td>[[ ds.name ]]</td>
                            <td>[[ ds.created_at ]]</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col col-md-4">

                </div>
            </div>
        </div>
    </div>
@endsection

@section('title')
    <title>LabApp</title>
@endsection

@section('metatags')
    <meta name="csrf" content="{{ csrf_token() }}" />
@endsection

@section('stylesheets')
    <link rel="stylesheet" href="/bower_components/bootstrap/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="css/app.css" />
@endsection

@section('scripts')
    <script src="/bower_components/angular/angular.min.js"></script>
    <script src="/bower_components/angular-resource/angular-resource.min.js"></script>
    <script src="/bower_components/underscore/underscore-min.js"></script>
    <script src="/js/ferm-bundle.js"></script>
@endsection