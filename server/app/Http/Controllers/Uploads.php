<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class Uploads extends Controller
{

    public function uploadAvatar(Request $request)
    {

      $uploadedFile = $request->file('file');
      $user = auth()->user();
      $user->avatar_url = Storage::put("/files/avatar", $uploadedFile);
      $user->save();

      $file = Storage::url($user->avatar_url);

      return response()->json([
        'avatar_url' => $file
      ]);
    }
}