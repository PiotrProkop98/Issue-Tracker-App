<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'developer_company_name',
        'client_company_name',
        'is_private'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'project_users');
    }

    public function issue()
    {
        return $this->hasMany(Issue::class);
    }
}
