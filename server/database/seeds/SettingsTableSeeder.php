<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Setting;
use App\Models\Provider;
use Illuminate\Support\Facades\Config;

class SettingsTableSeeder extends Seeder
{
    /**
     * The settings to pre-seed the database with.
     */
    protected $providers = [
        'main_app' => [
            [
                'key'         => 'site_title',
                'name'        => 'Site Title',
                'description' => 'Give a title for your Mining Pool (i.e. HelixAlpha Mining Community).',
                'value'       => 'admin@helixalpha.com',
                'field'       => '{"name":"site_title","label":"Site Title","type":"text"}',
                'active'      => 1,
            ],
            [
                'key'           => 'site_tagline',
                'name'          => 'Site Tagline',
                'description'   => 'In a few words, explain what this Mining Pool is about.',
                'value'         => 'HelixAlpha Mining Pool',
                'field'       => '{"name":"site_tagline","label":"Application Tagline","type":"text","placeholder":"Enter a tagline for your mining community."}',
                'active'        => 1,
            ],
            [
                'key'           => 'site_address',
                'name'          => 'Site Address',
                'description'   => 'The URL address of your website.',
                'value'         => '',
                'field'         => '{"name":"site_address","label":"Enter your site address here.","type":"text","placeholder":"Enter the description of your mining pool."}',
                'active'        => 1,
            ],
            [
                'key'           => 'support_email',
                'name'          => 'Support Email',
                'description'   => 'Your mining pool\'s support contact email.',
                'value'         => 'support@helixalpha.com',
                'field'         => '{"name":"support_email","label":"Support Email","type":"email","placeholder":"Enter the mining pool\'s support email."}',
                'active'        => 1,
            ],
        ],
        'twilio' => [
            [
                'key'         => 'twilio_sid',
                'name'        => 'Twilio Account SID',
                'description' => 'An account SID is the way that a Twilio account is identified.',
                'value'       => '',
                'field'       => '{"name":"twilio_sid","label":"Account SID","type":"text"}',
                'active'      => 1,
                'is_encrypted' => 0,
            ],
            [
                'key'         => 'twilio_app_sid',
                'name'        => 'Twilio Application Sid',
                'description' => 'An application SID is the way that a Twilio application is identified.',
                'value'       => '',
                'field'       => '{"name":"twilio_app_sid","label":"Twilio Application SID","type":"text"}',
                'active'      => 1,
                'is_encrypted' => 0,
            ],
            [
                'key'         => 'twilio_phone_number',
                'name'        => 'Twilio Phone Number',
                'description' => 'The phoe number associated with this twilio application.',
                'value'       => '',
                'field'       => '{"name":"twilio_phone_number","label":"Twilio Phone Number","type":"text"}',
                'active'      => 1,
                'is_encrypted' => 0,
            ],
            [
                'key'         => 'twilio_auth_token',
                'name'        => 'Auth Token',
                'description' => 'Twilio auth token. You can find this at [twilio.com/console](https://www.twilio.com/console)',
                'value'       => '',
                'field'       => '{"name":"twilio_auth_token","label":"Twilio Auth Token","type":"password"}',
                'active'      => 1,
                'is_encrypted' => 1,
            ],
        ],
        'facebook' => [
            [
                'key'         => 'facebook_app_id',
                'name'        => 'Application ID',
                'description' => 'An application ID is the way that a Facebook application is identified.',
                'value'       => '',
                'field'       => '{"name":"facebook_app_id","label":"Application ID","type":"text"}',
                'active'      => 1,
                'is_encrypted' => 0,
            ],
            [
                'key'         => 'facebook_app_secret',
                'name'        => 'Application Secret',
                'description' => 'An application secret is the way a Facebook application is authorized.',
                'value'       => '',
                'field'       => '{"name":"facebook_app_secret","label":"Application Secret","type":"password"}',
                'active'      => 1,
                'is_encrypted' => 1,
            ],
        ],
    ];

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('settings')->delete();

        $count = 0;
        $this->command->info("Seeding application settings.");

        foreach($this->providers as $provider_name => $settings) {
            foreach($settings as $index => $setting) {
                $provider = Provider::get([$provider_name]);
                $result = Setting::create($setting);
                $result->provider()->associate($provider->first());
                $result->save();
                $count++;
                
                $setting_config_value = config("settings." . $setting['key']);
                if($setting_config_value){
                    $result->update([
                        'value' => $setting_config_value
                    ]);
                }

                $display_value = $result->is_encrypted ? '**redacted**' : ($result->value ? $result->value : 'empty');
                $this->command->info("Creating setting for {$provider_name}: {$result->key} => {$display_value}");

                if (!$result) {
                    $this->command->info("Insert failed at record $index.");
                    return;
                }
            }
        }
 

        $this->command->info('Inserted '.$count.' records.');
        



        // \DB::table('settings')->insert(array (
        //     0 => 
        //     array (
        //         'param' => 'alcurex-disabled',
        //         'value' => '1',
        //         'type' => 'bool',
        //     ),
        //     1 => 
        //     array (
        //         'param' => 'binance-disabled',
        //         'value' => '1',
        //         'type' => 'bool',
        //     ),
        //     2 => 
        //     array (
        //         'param' => 'bittrex-withdraw_fee_btc',
        //         'value' => '0.0005',
        //         'type' => 'price',
        //     ),
        //     3 => 
        //     array (
        //         'param' => 'bleutrade-withdraw_fee_btc',
        //         'value' => '0.001',
        //         'type' => 'price',
        //     ),
        //     4 => 
        //     array (
        //         'param' => 'c-cex-DCR-BTC-disabled',
        //         'value' => '1',
        //         'type' => 'bool',
        //     ),
        //     5 => 
        //     array (
        //         'param' => 'coinbene-disabled',
        //         'value' => '1',
        //         'type' => 'bool',
        //     ),
        //     6 => 
        //     array (
        //         'param' => 'coinexchange-disabled',
        //         'value' => '1',
        //         'type' => 'bool',
        //     ),
        //     7 => 
        //     array (
        //         'param' => 'coinsmarkets-disabled',
        //         'value' => '1',
        //         'type' => 'bool',
        //     ),
        //     8 => 
        //     array (
        //         'param' => 'empoex-disabled',
        //         'value' => '1',
        //         'type' => 'bool',
        //     ),
        //     9 => 
        //     array (
        //         'param' => 'escodex-disabled',
        //         'value' => '1',
        //         'type' => 'bool',
        //     ),
        //     10 => 
        //     array (
        //         'param' => 'gateio-disabled',
        //         'value' => '1',
        //         'type' => 'bool',
        //     ),
        //     11 => 
        //     array (
        //         'param' => 'jubi-disabled',
        //         'value' => '1',
        //         'type' => 'bool',
        //     ),
        //     12 => 
        //     array (
        //         'param' => 'nova-disabled',
        //         'value' => '1',
        //         'type' => 'bool',
        //     ),
        //     13 => 
        //     array (
        //         'param' => 'stocksexchange-disabled',
        //         'value' => '1',
        //         'type' => 'bool',
        //     ),
        //     14 => 
        //     array (
        //         'param' => 'tradesatoshi-disabled',
        //         'value' => '1',
        //         'type' => 'bool',
        //     ),
        //     15 => 
        //     array (
        //         'param' => 'yobit-DCR-BTC-disabled',
        //         'value' => '1',
        //         'type' => 'bool',
        //     ),
        // ));
        

    }
}