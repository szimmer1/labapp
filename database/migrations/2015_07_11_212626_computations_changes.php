<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ComputationsChanges extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('computations', function(Blueprint $table) {
            $table->removeColumn('extends');
            $table->string('namespace');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('computations', function(Blueprint $table) {
            $table->removeColumn('namespace');
            $table->string('extends');
        });
    }
}
