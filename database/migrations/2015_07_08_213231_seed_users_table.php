<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SeedUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // add role_id column to users
        Schema::table('users', function($table) {
            $table->integer('role_id');
        });

        $admin_role = DB::table('roles')
          ->select('id')
          ->where('name','admin')
          ->first()
          ->id;

        DB::table('users')->insert(array(
          'name' => 'Shahar Zimmerman',
          'email' => 'szimmer1@ucsc.edu',
          'password' => Hash::make('nn7xjsoioxj'),
          'role_id' => $admin_role
        ));
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('roles', function($table) {
            $table->dropColumn('role_id');
        });
        DB::table('users')->where('email','szimmer1@ucsc.edu')->delete();
    }
}
