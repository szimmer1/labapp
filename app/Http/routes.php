<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/ferm', function() {
    return view('ferm');
});

Route::get('/qc', function() {
    return view('qc');
});

Route::resource('api/upload', 'UploadDataController',
    ['only' => ['index','store','show']]);

Route::resource('api/computation', 'ComputationController',
    ['only' => ['index','show']]);

Route::get('api/compute/{computationId}/{datasetId}', [
    'as' => 'compute', 'uses' => 'ComputeController@compute']);