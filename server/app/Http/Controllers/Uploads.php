<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class Uploads extends Controller
{

    public function uploadAvatar(Request $request)
    {
      $uploaded_file = $request->file('file');
      $user = auth()->user();
      $user->avatar_url = Storage::put("/files/avatar", $uploaded_file);
      $user->save();

      $storage_path = Storage::url($user->avatar_url);

      return response()->json([
        "name" => basename($storage_path),
        "status" => "done",
        'url' => $storage_path,
        "thumbUrl" => $storage_path,
      ]);
    }
}