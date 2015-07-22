<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ComputationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('computations', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('classname');
            $table->string('extends');
        });

        Schema::table('input_data', function ($table) {
            $table->enum('stored', ['local','s3']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('computations');
    }
}
