<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // create roles table
        Schema::create('roles', function(Blueprint $table) {
            $table->increments('id');
            $table->string('name');
        });

        DB::table('roles')->insert(array(
            array(
                'name' => 'admin'
            ),
            array(
                'name' => 'mod'
            ),
            array(
                'name' => 'user'
            )
        ));
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('roles');
    }
}
