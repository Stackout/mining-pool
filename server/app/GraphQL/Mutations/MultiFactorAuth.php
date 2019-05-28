<?php

namespace App\GraphQL\Mutations;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Profile;
use App\Mail\WelcomeMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Hash;
use Twilio\Rest\Client;
use App\Models\Setting;
use Twilio;

class MultiFactorAuth
{
    public function textMessageSecurityCode($root, array $args, $context)
    {
        // $data = $args['data'];

        Twilio::message('+13036566491', 'What an awesome librariy! I got it to work!');

        return [
            'status' => 'SMS_VERIFICATION_CODE_SENT',
            'message' => 'SMS verification code successfully sent.',
        ];
    }

    public function emailSecurityCode($root, array $args, $context)
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

    public function changeSecurityPhone($root, array $args, $context)
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

    public function enable() {

    }

    public function disable() {

    }

    public function getValidateToken() {

    }

    public function validate() {

    }
}