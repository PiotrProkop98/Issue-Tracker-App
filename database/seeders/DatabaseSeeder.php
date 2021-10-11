<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

use App\Models\Project;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'Piotr',
            'email' => 'piotr1@gmail.com',
            'password' => Hash::make('123456'),
            'email_verified_at' => now(),
            'remember_token' => Str::random(10)
        ]);

        Project::factory()
            ->count(30)
            ->has(User::factory()->count(3))
            ->create();
        
        User::factory()
            ->count(3)
            ->has(Project::factory()->count(2))
            ->create();
    }
}
