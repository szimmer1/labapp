<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MotifScore extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $motifscore = new \App\Models\Computation();
        $motifscore->name = "Randomized Best Motifs";
        $motifscore->classname = "MotifRandom";
        $motifscore->namespace = "App\\Bio";
        $motifscore->save();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Computation::where('classname','MotifRandom')->delete();
    }
}
