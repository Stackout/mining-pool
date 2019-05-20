<?php

namespace App\GraphQL\Resolvers;

use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

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
        $token = '';
        $permissions = [];
        $roles = [];
        if (!$context->request->hasCookie('_token')) {
            $user = Auth::user();
            $token = $user->createToken('Access Token');
            Cookie::queue('_token', $token->accessToken, 1800, '/', $context->request->getHost(), false, true);

            $token = [
                'access_token' => $token->accessToken,
                'expires_in' => $token->token->expires_at,
            ];

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
        }
        
        return compact('token', 'permissions', 'roles');
    }
}
