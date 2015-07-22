<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Computation;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ComputationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $comps = Computation::all();
        return response()->json([
            "data" => $comps->toArray(),
            "error" => false
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        //
    }
}
