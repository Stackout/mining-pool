<?php

namespace App\Concerns;

use RuntimeException;
use Spatie\Permission\Traits\HasRoles;

/**
 * 
 *
 * @author Ryan Hein <me@ryanhein.com>
 */
trait HasRolesAndPermissions
{
    use HasRoles;

     /**
     * @return Array
     */
    public function getModelRolesAttribute()
    {
        return $this->roles->reduce(function($array, $role) {
            $array[] = [
                'id' => $role->id,
                'name' => $role->name,
            ];
            return $array;
        }, []);
    }

    /**
     * @return Array
     */
    public function getModelPermissionsAttribute()
    {
        return $this->permissions->reduce(function($array, $permission) {
            $array[] = [
                'id' => $permission->id,
                'name' => $permission->name,
            ];
            return $array;
        }, []);
    }
}