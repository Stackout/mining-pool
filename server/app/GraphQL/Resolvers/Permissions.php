<?php

namespace App\GraphQL\Resolvers;

use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Nuwave\Lighthouse\Exceptions\AuthenticationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

class PermissionsResolver
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
        if (!$context->request->hasCookie('_token')) {
            return (Auth::user()->hasPermissionTo($args['data']['permission']));
        }

        return false;
    }
}
