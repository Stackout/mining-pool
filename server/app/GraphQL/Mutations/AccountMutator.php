<?php

namespace App\GraphQL\Mutations;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Profile;
use App\Mail\WelcomeMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Hash;

class AccountMutator
{
    public function createUser($root, array $args, $context)
    {
        $data = $args['data'];

        // Start creating a user account, fucking complicated IDs and stuff
        $user =  User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);

        // Assign Roles
        $user->assignRole($data['roles']);

        // Assign Permissions
        if(isset($data['permissions'])){
            $user->givePermissionTo($data['permissions']);
        }

        // Mail::to($data['email'])->send(new WelcomeMail($user));

        return compact('user');

    }

    public function updateUser($root, array $args, $context)
    {

        $data = $args['data'];
        $user =  User::find($args['id']);
        
        $user->update(array_except($data, ['confirm_password', 'password']));

        if(array_key_exists('password', $data)) {
            $user->password = $data['password'];
        }
        
        // Sync Roles
        $user->syncRoles($data['roles']);

        // Sync Permissions
        if(array_key_exists('permissions', $data)) {
            $user->syncPermissions($data['permissions']);
        }

        // Save User
        $user->save();

        return compact('user');

    }

    public function registerUser($root, array $args, $context)
    {
        $data = $args['data'];

        // First step is to create user, second step send out welcome email
        $user =  User::create([
            'email' => $data['email'],
            'name' => $data['name'],
            'password' => $data['password'],
        ]);
        
        // Assign User Roles
        $user->assignRole('user');

        // Email user code
        $user->notify(new VerifyEmail);

        return [
            'status' => 'USER_REGISTERED',
            'message' => 'You have successfully registered. Before you can login, you must active your account with the code sent to your email address.'
        ];
    }

    public function updateProfile($root, array $args, $contex)
    {
        $data = $args['data'];
        $user = auth()->user();
        $profile = $user->profile;
        if ($profile === null) {
            $profile = new Profile;
            $profile->phone = $data['phone'];
            $profile->bio = $data['bio'];
            $profile->website = $data['website'];
            $profile->user()->associate($user);
        } else {
            $profile->update([
                'phone' => $data['phone'],
                'bio' => $data['bio'],
                'website' => $data['website']
            ]);
        }
        $profile->save();

        return [
            'status' => 'PROFILE_UPDATED',
            'message' => 'User\'s profile was successfully updated.'
        ];
    }

    public function changePassword($root, array $args, $contex)
    {
        $data = $args['data'];
        $user = auth()->user();

        if (Hash::check($data['old_password'], $user->password)) { 
           $user->fill([
                'password' => $data['password']
            ])->save();

            return [
                'status' => 'PASSWORD_CHANGED',
                'message' => 'Password changed.'
            ];

        } else {
            return [
                'status' => 'PASSWORD_CHANGE_FAILED',
                'message' => 'Passwords do not match.'
            ];
        }



    }
}