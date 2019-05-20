
  <?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
class UsersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {

      \DB::table('users')->insert([
        'name' => 'Ryan Hein',
        'email' => 'admin@helixalpha.com',
        'password' => bcrypt('secret'),
      ]);

      $users = factory(App\Models\User::class, 99)->create();
      foreach($users as $user){
        $user->assignRole('user');
      }

      // Create Default Admin with all Roles and Permissions
      $user = \App\Models\User::find(1);
      $user->givePermissionTo(Permission::all());
      $user->assignRole('admin');

    }
  }