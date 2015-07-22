<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Computation;
use App\Models\DataSet;
use Storage;
use App\Http\Requests;

class ComputeController extends Controller
{
    /**
     * @param $computationId
     * @param $datasetId
     * @return JSON {error,data}
     */
    public function compute($computationId, $datasetId) {
        $result = response()->json([
            "error" => true,
            "status" => 400,
            "data" => "Data not found"
        ]);

        $computation = Computation::where('id', $computationId)->first();
        $dataset = DataSet::where('id', $datasetId)->first();
        if (empty($computation) || empty($dataset)) return $result;

        try {
            // load data
            $data = Storage::disk("local")->get($dataset->name);
            $lines = explode("\n", $data);

            $fullclass = $computation->namespace . $computation->classname;
            $computer = new $fullclass;

            // call computation here
            $result = $computer->compute($lines);
            return response()->json([
              "error" => false,
              "data" => $result
            ]);
        } catch (Exception $e) {
            return response()->json([
              "error" => true,
              "status" => 500,
              "data" => "Bio computation error"
            ]);
        }
    }
}
