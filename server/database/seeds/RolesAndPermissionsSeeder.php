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
          'security',
          'roles',
          'permissions',
          'settings',
        ];

        $roles = [
          'admin',
          'moderator',
          'user',
        ];

        // create permissions
        foreach($models as $model) {
          Permission::create(['name' => "create {$model}"]);
          Permission::create(['name' => "update {$model}"]);
          Permission::create(['name' => "delete {$model}"]);
          Permission::create(['name' => "restore {$model}"]);
          Permission::create(['name' => "force-delete {$model}"]);
          Permission::create(['name' => "view {$model}"]);
        }

        $role = Role::create(['name' => 'admin']);
        $role->givePermissionTo(Permission::all());

        Role::create(['name' => 'moderator']);
        Role::create(['name' => 'user']);
        Role::create(['name' => 'guest']);
    }
}

?>