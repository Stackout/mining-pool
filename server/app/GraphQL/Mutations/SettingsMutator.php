<?php

namespace App\GraphQL\Mutations;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Profile;
use App\Mail\WelcomeMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Hash;
use App\Models\Setting;
use App\Models\Provider;

class SettingsMutator
{
    public function createSetting($root, array $args, $contex)
    {
      $data = $args['data'];
      $setting = new Setting;
      $provider = Provider::get(["main_app"])->first();

      // Convert Field into JSON Data
      $field = json_encode([
        "name" => $data['field_name'],
        "type" => $data['field_type'],
        "label" => $data['field_label']
      ]);

      $setting->field = $field;
      $setting->provider()->associate($provider->id);
      $setting->key = $data['key'];
      $setting->name = $data['field_name'];
      $setting->description = $data['description'];

      if(isset($data['is_encrypted'])){
        $setting->is_encrypted = $data['is_encrypted'];
      }

      if(isset($data['active'])){
        $setting->active = $data['active'];
      }
      
      $setting->save();

      return [
        "message" => "Setting was successfully created.",
        "status" => "SETTING_CREATED"
      ];
    }

    public function updateSetting($root, array $args, $contex)
    {
        $data = $args['data'];
        $setting = Setting::findOrFail($args['id']);

        // Convert Field into JSON Data
        $field = json_encode([
          "name" => $data['field_name'],
          "type" => $data['field_type'],
          "label" => $data['field_label']
        ]);

        $setting->field = $field;
        $setting->name = $data['field_name'];
        $setting->key = $data['key'];
        $setting->description = $data['description'];

        if(isset($data['is_encrypted'])){
          $setting->is_encrypted = $data['is_encrypted'];
        }

        if(isset($data['active'])){
          $setting->active = $data['active'];
        }
        
        $setting->save();

        return [
          "message" => "Setting was successfully updated.",
          "status" => "SETTING_UPDATED"
        ];
    }

    /**
     * Update key value pairs of a setting's key value pairs.
     */
    public function putSetting($root, array $args, $contex)
    {
        $data = collect($args['data']);
        Setting::set($data['key'], $data['value']);
       
        return [
          "STATUS" => "SETTING_UPDATED",
          "MESSAGE" => "The setting's key value pair was update."
        ];

    }

    /**
     * Update in batch all key value pairs of multiple setting key value pairs.
     */
    public function putSettings($root, array $args, $contex)
    {
        $data = collect($args['data']);
        $data->reduce(function($carry, $setting) {
          Setting::set($setting['key'], $setting['value']);
        });
       
        return [
          "status" => "SETTINGS_UPDATED",
          "message" => "The setting's key value pairs have been update."
        ];
    }

    /**
     * Get a setting by its key from cache.
     */
    public function getSetting($root, array $args, $contex)
    {
        return Setting::get($args['key']);
    }

}