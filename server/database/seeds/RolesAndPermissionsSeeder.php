<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\Users;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        $models = [
          'users',
        ];

        $roles = [
          'admin',
          'moderator',
          'user',
        ];

        // create permissions
        foreach($models as $model) {
          Permission::create(['name' => "view {$model}"]);
          Permission::create(['name' => "create {$model}"]);
          Permission::create(['name' => "update {$model}"]);
          Permission::create(['name' => "delete {$model}"]);
          Permission::create(['name' => "force-delete {$model}"]);
        }


        $role = Role::create(['name' => 'admin']);
        $role->givePermissionTo(Permission::all());

        // Create Default Admin with all Roles and Permissions
        $user = \App\Models\User::find(1);
        $user->givePermissionTo(Permission::all());
        $user->assignRole('admin');
    }
}

?>