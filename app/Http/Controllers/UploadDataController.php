<?php

namespace App\Http\Controllers;

use App\Models\DataSet;
use Request;
use Storage;
use App\Http\Requests;

class UploadDataController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $datasets = DataSet::all();
        return response()->json([
            'error' => false,
            'data' => $datasets->toArray()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        $badrequest = response()->json([
            "error" => "Bad request",
            "status" => 400
        ]);

        $dataset = new DataSet();
        $tmpname = Request::input('name');
        $data = Request::input('data');
        if (empty($tmpname) || empty($data)) return $badrequest;
        $dataset->name = strrpos($tmpname, '.') ? $tmpname : $tmpname . ".txt";
        $dataset->size = Request::input('size');
        $dataset->type = Request::input('type');


        // TODO check for versions - probably a database field

        // write file locally
        if (!empty(Storage::disk('local')->put($dataset->name, $data))) {
            $dataset->stored = 'local';
            $dataset->save();
        }
        else {
            return $badrequest;
        }

        return $this->index();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $dataset = DataSet::where('id',$id)->first();
        if (!empty($dataset)) {
            return response()->json([
                'error' => false,
                'data' => $dataset
            ]);
        }
        else {
            return response()->json([
                "error" => "Data not found",
                "status" => 404
            ]);
        }
    }
}
