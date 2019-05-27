<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Config;

class Setting extends Model
{
    protected $table = 'settings';
    protected $fillable = ['value'];
    
    /**
     * Grab a setting value from the database.
     *
     * @param string $key The setting key, as defined in the key db column
     *
     * @return string The setting value.
     */
    public static function get($key)
    {
        $setting = new self();
        $entry = $setting->where('key', $key)->first();
        if (!$entry) {
            return;
        }
        return $entry->value;
    }
    
    /**
     * Update a setting's value.
     *
     * @param string $key   The setting key, as defined in the key db column
     * @param string $value The new value.
     */
    public static function set($key, $value = null)
    {
        $prefixed_key = 'settings.'.$key;
        $setting = new self();
        $entry = $setting->where('key', $key)->firstOrFail();
        // update the value in the database
        $entry->value = $value;
        $entry->saveOrFail();
        // update the value in the session
        Config::set($prefixed_key, $value);
        if (Config::get($prefixed_key) == $value) {
            return true;
        }
        return false;
    }

    /**
     * Get the provider record associated with the setting.
     */
    public function provider() {
        return $this->belongsTo(Provider::class);
    }

    public function setValueAttribute($value) {

        if($this->is_encrypted && isset($value) && !is_null($value)){
            $keyContents = file_get_contents('/usr/local/keyfile.priv');
            $key = \Defuse\Crypto\Key::loadFromAsciiSafeString($keyContents);
            $secret = \Defuse\Crypto\Crypto::encrypt($value, $key);
            $this->attributes['value'] = $secret;
        } else {
            $this->attributes['value'] = $value;
        }

    }

    public function getValueAttribute() {

        if($this->is_encrypted){
            try {
                $keyContents = file_get_contents('/usr/local/keyfile.priv');
                $key = \Defuse\Crypto\Key::loadFromAsciiSafeString($keyContents);
                $contents = \Defuse\Crypto\Crypto::decrypt($this->attributes['value'], $key);
                return $contents;
            } catch (\Exception $e) {
                return "";
            }
        }
        return $this->attributes['value'];
    }
}