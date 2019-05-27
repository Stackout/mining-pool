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

class MultiFactorAuth
{
    public function textMessageSecurityCode($root, array $args, $context)
    {
        // $data = $args['data'];

        $account_sid = Setting::get('twilio_sid');
        $auth_token  = Setting::get('twilio_auth_token');
        $phone_number = Setting::get('twilio_phone_number');
        $client = new Client($account_sid, $auth_token);

        try {
            $client->messages->create(
                // the number you'd like to send the message to
                '+13036566491',
                [
                    // A Twilio phone number you purchased at twilio.com/console
                    'from' => $phone_number,
                    // the body of the text message you'd like to send
                    'body' => 'Hey Ryan! Glad to see this is working. From PHP!'
            ]);
        } catch (Exception $e) {
            echo $e->getMessage();
        }

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