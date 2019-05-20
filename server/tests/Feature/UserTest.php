<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Concerns\GraphQLTester;
use App\Models\User;

class UserTest extends TestCase
{
    use GraphQLTester;

    /**
     * Test if a user can login
     *
     * @return void
     */
    public function testUserCanLogin()
    {
        // Set Default Password
        $password = 'thisisaredfgsfdgs5RGWGallyuglupasswordKJH($&TGHURG';

        // Create a user to login
        $user = factory(User::class)->create(['name' => "Jack Conway", "password" => bcrypt($password)]);
        $user->assignRole('user');
    
        $response = $this->graphql($this->loginMutation($user->email, $password));

        $this->assertEquals(
            "user",
            $response->json("data.login.roles.0.name")
        );
        $this->assertNotNull(
            $response->json("data.login.token.access_token")
        );
    }

    /**
     * Test if a user can not login
     *
     * @return void
     */
    public function testUserCanNotLogin()
    {
        // Set Default Password
        $password = 'thisisaredfasswordKJH(sdagQGGSDFGFD$&TGHURG';

        // Create a user to login
        $user = factory(User::class)->create(['name' => "Jack Conway", "password" => bcrypt($password . 1)]);
        $user->assignRole('user');
    
        $response = $this->graphql($this->loginMutation($user->email, $password));

        $this->assertEquals(
            "Authentication Failed.",
            $response->json("errors.0.message")
        );
        
    }
}
