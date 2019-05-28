<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Http\Request;
use Browser;
use Carbon\Carbon;

class TrustedDevice extends Model
{
    protected $table = 'trusted_devices';

    protected $fillable = ["user_id", "user_ip", "browser", "version", "platform", "is_trusted", "expires_at"];

    public function users() {
        return $this->belongsTo(User::class);
    }

    public static function isTrusted() {

        $browser = new \WhichBrowser\Parser($_SERVER['HTTP_USER_AGENT']);
        $user = auth()->user();
        $self = self::where([
            'user_id' => $user->id,
            'user_ip' => $_SERVER['REMOTE_ADDR'],
            'browser' => $browser->browser->name,
            'version' => $browser->browser->version->value,
            'platform' => $browser->os->name,
        ])->first();

        if($self && !$self->is_expired){
            return true;
        }

        return false;
    }


    public static function add($user, $trust = false) {
        $browser = new \WhichBrowser\Parser($_SERVER['HTTP_USER_AGENT']);
        $self = self::create([
            'user_id' => $user->id,
            'user_ip' => $_SERVER['REMOTE_ADDR'],
            'browser' => $browser->browser->name,
            'version' => $browser->browser->version->value,
            'platform' => $browser->os->name,
            'is_trusted' => true,
            'expires_at' => ($trust ? Carbon::now()->addDays(30) : Carbon::now()->addDays(1))
        ]);

        return $self;
    }

    public function getIsExpiredAttribute() {
        return Carbon::parse($this->expires_at)->isPast();
    }
}
