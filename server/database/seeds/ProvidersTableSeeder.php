<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProvidersTableSeeder extends Seeder
{
    /**
     * The providers to add.
     */
    protected $providers = [
        [
            'name'        => 'App',
            'key'         => 'main_app',
            'description' => 'The app\'s main API settings.',
            'active'      => 1
        ],
        [
            'name'        => 'Facebook',
            'key'         => 'facebook',
            'description' => 'Facebook is an American online social media and social networking service company',
            'active'      => 1
        ],
        [
            'name'        => 'Twilio',
            'key'         => 'twilio',
            'description' => 'Twilio is a cloud communications platform as a service company. Twilio allows software developers to programmatically make and receive phone calls, send and receive text messages, and perform other communication functions using its web service APIs.',
            'active'      => 1
        ],
        [
            'name'        => 'Google',
            'key'         => 'google',
            'description' => "Google API keys, and other settings.",
            'active'      => 1
        ],
    ];

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('providers')->delete();

        foreach ($this->providers as $index => $setting) {
            $result = DB::table('providers')->insert($setting);
            if (!$result) {
                $this->command->info("Insert failed at record $index.");
                return;
            }
        }

        $this->command->info('Inserted '.count($this->providers).' records.');
        
    }
}