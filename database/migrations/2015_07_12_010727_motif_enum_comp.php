<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Computation;

class MotifEnumComp extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $motif_comp = new Computation();
        $motif_comp->name = "Motif Enumeration";
        $motif_comp->classname = "MotifEnum";
        $motif_comp->namespace = "App\\Bio";
        $motif_comp->save();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Computation::where('name',"Motif Enumeration")->delete();
    }
}
