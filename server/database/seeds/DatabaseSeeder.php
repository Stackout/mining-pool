<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(RolesAndPermissionsSeeder::class);
        $this->call(UsersTableSeeder::class);
        $this->call(CoinsTableSeeder::class);
        $this->call(HashrateTableSeeder::class);
        $this->call(MarketsTableSeeder::class);
        $this->call(NicehashTableSeeder::class);
        $this->call(RawcoinsTableSeeder::class);
        $this->call(MiningServicesTableSeeder::class);
        $this->call(ProvidersTableSeeder::class);
        $this->call(SettingsTableSeeder::class);
        $this->call(StatsTableSeeder::class);
        $this->call(BlocksTableSeeder::class);
        $this->call(AlgosTableSeeder::class);
        $this->call(OauthSeeder::class);
    }
}
