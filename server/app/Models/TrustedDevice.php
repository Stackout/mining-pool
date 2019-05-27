<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class TrustedDevice extends Model
{
    protected $table = 'trusted_devices';

    public function users() {
        return $this->belongsTo(User::class);
    }
}
