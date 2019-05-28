<?php

namespace App\GraphQL\Resolvers;

use App\Models\TrustedDevice;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Propaganistas\LaravelPhone\PhoneNumber;
use Twilio;
use App\Models\User;

class LoginResolver
{
    /**
     * @param $rootValue
     * @param array $args
     * @param \Nuwave\Lighthouse\Support\Contracts\GraphQLContext|null $context
     * @param \GraphQL\Type\Definition\ResolveInfo $resolveInfo
     * @return array
     * @throws \Exception
     */
    public function resolve($rootValue, array $args, GraphQLContext $context = null, ResolveInfo $resolveInfo)
    {
        if (! Auth::once(['email' => $args['data']['username'], 'password' => $args['data']['password']])) {
            throw new AuthenticationException('Authentication Failed.');
        }

        // Create Personal Access Tokena and return a JWT
        $permissions = [];
        $roles = [];
        if (!$context->request->hasCookie('_token')) {
            $user = Auth::user();

            if($user->multifactor_auth_is_enabled && $user->security_phone){
                if(!TrustedDevice::isTrusted()){
                    
                    $user->multifactor_auth_token = mt_rand(100000,999999);
                    $user->save(); 
    
                    Twilio::message($user->security_phone, "Your Mining Pool verification code HXA-{$user->multifactor_auth_token }.");
    
                    $national_phone = PhoneNumber::make($user->security_phone)->formatNational();
    
                    $last_two = substr($national_phone, -2);
                    $phone = substr(preg_replace('/[0-9]/', "*", $national_phone), 0, strlen($national_phone) - 2) . $last_two;

                    return [
                        'status' => 'DEVICE_NOT_TRUSTED',
                        'message' => 'User needs to retrust browser and device.',
                        'meta' => [
                            'phone' => $phone
                        ]
                    ];
                }
            }

            [ $roles, $permissions ] = $this->authorizeUser($user, $context);

        }
        
        return [
            'status' => 'USER_LOGIN_SUCCESS',
            'message' => 'User successfully logged in.',
            'meta' => [
                'roles' => $roles,
                'permissions' => $permissions
            ]
        ];
    }

   /**
     * @param $rootValue
     * @param array $args
     * @param \Nuwave\Lighthouse\Support\Contracts\GraphQLContext|null $context
     * @param \GraphQL\Type\Definition\ResolveInfo $resolveInfo
     * @return array
     * @throws \Exception
     */
    public function validateCode($rootValue, array $args, GraphQLContext $context = null, ResolveInfo $resolveInfo)
    {
        $data = $args['data'];
        $email = $data['username'];

        $user = User::where('email', $email)->first();

        $permissions = [];
        $roles = [];
        if($user->multifactor_auth_token === $data['code']){

            $device = TrustedDevice::add($user, isset($data['remember_device']));
            
            [ $roles, $permissions ] = $this->authorizeUser($user, $context);

            return [
                'status' => 'USER_AUTHENTICATED',
                'message' => 'User login successful.',
                'meta' => [
                    'roles' => $roles,
                    'permissions' => $permissions
                ]
            ];
        }

        return [
            'status' => 'AUTH_CODE_INCORRECT',
            'message' => 'The user inputted an incorrect validation code.',
        ];
    }

    protected function authorizeUser($user, $context) {
        $token = $user->createToken('Access Token');

        Cookie::queue('_token', $token->accessToken, 1800, '/', $context->request->getHost(), false, true);

        return $this->transformRolesAndPermissions($user);
    }

    protected function transformRolesAndPermissions($user) {
        $permissions = $user->permissions->reduce(function($array, $permission) {
            $array[] = [
                'name' => $permission->name,
                'id' => $permission->id
            ];
            return $array;
        }, []);

        $roles = $user->roles->reduce(function($array, $role) {
            $array[] = [
                'name' => $role->name,
                'id' => $role->id
            ];
            return $array;
        }, []);

        return [ $roles, $permissions ];
    }
}
