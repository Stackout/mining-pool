<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{

    /**
     * Grab a provider from the database by its key.
     *
     * @param string $key The setting key, as defined in the key db column
     *
     * @return string The setting value.
     */
    public static function get($keys)
    {
        $setting = new self();
        $result = $setting->whereIn('key', $keys)->get();
        
        if (!$result) {
            return;
        }

        return $result;
    }

    /**
     * Get all settings records associated with the provider.
     */
    public function settings() {
        return $this->hasMany(Setting::class);
    }
}
