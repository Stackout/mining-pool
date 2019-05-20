<?php

namespace App\Concerns;

use RuntimeException;
use Spatie\Permission\Traits\HasRoles;

/**
 * 
 * @author Ryan Hein <me@ryanhein.com>
 */
trait GraphQLTester
{
    public function graphql(string $query)
    {
        return $this->post('/graphql', [
            'query' => $query
        ]);
    }

    public function loginMutation($username, $password){
        return "mutation {
            login(data: {password: \"{$password}\", username: \"{$username}\"}){
              token {
                expires_in
                access_token
              }
              roles {
                name
                id
                guard
              }
              permissions {
                name
                id
              }
            }
          }";
    }

}