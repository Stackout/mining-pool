<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInitialTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('secondary_email')->nullable();
            $table->string('password');
            $table->string('security_phone', 32)->nullable();
            $table->string('multifactor_auth_is_enabled')->nullable();
            $table->string('multifactor_auth_token')->nullable();
            $table->string('multifactor_auth_expiry')->nullable();
            $table->rememberToken();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('created_at')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            $table->softDeletes();
        });

        Schema::create('password_resets', function (Blueprint $table) {
            $table->string('email')->index();
            $table->string('token');
            $table->timestamps();
        });

        Schema::create('addresses', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_id')->unsigned();
            $table->string('label')->nullable();
            $table->string('street_1',    60)->nullable();
            $table->string('street_2',    60)->nullable();
            $table->string('city',      60)->nullable();
            $table->string('state',     60)->nullable();
            $table->string('postal_code', 10)->nullable();
            $table->integer('country')->nullable()->unsigned()->index();
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onUpdate('RESTRICT')
                ->onDelete('CASCADE');
        });

        Schema::create('profiles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_id')->unsigned();
            $table->string('avatar_url')->nullable();
            $table->string('phone',    32)->nullable();
            $table->string('website', 100)->nullable();
            $table->string('bio')->nullable();
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onUpdate('RESTRICT')
                ->onDelete('CASCADE');

        });

        Schema::create('providers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('key')->index()->unique();
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->tinyInteger('active');
            $table->timestamps();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('provider_id')->unsigned()->nullable();
            $table->string('key')->unique();
            $table->string('name');
            $table->string('description')->nullable();
            $table->text('value')->nullable();
            $table->text('field');
            $table->tinyInteger('active');
            $table->tinyInteger('is_encrypted')->default(0);
            $table->timestamps();

            $table->foreign('provider_id')->references('id')->on('providers');
        });

        Schema::create('trusted_devices', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_id')->unsigned();
            $table->ipAddress('user_ip');
            $table->string('platform');
            $table->string('browser');
            $table->string('version');
            $table->boolean('is_trusted');
            $table->dateTime('expires_at');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_resets');
        Schema::dropIfExists('addresses');
        Schema::dropIfExists('profiles');
        Schema::dropIfExists('settings');
        Schema::dropIfExists('providers');
        Schema::dropIfExists('providers_settings');

    }
}
