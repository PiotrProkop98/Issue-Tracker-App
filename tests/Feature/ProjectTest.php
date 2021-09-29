<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use Hash;

use App\Models\Project;
use App\Models\User;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_request_all_public_projects()
    {
        Project::create([
            'name' => 'Test project.',
            'is_private' => false
        ]);

        Project::create([
            'name' => 'This project should NOT be visible.',
            'is_private' => true
        ]);

        $response = $this->json('GET', '/api/projects');

        $response
            ->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Test project.'
            ])
            ->assertJsonMissing([
                'name' => 'This project should NOT be visible.'
            ]);
    }

    public function test_request_project_that_user_belongs_to()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => Hash::make('123456')
        ]);

        $project_private = Project::create([
            'name' => 'Private project.',
            'is_private' => true
        ]);

        $project_public = Project::create([
            'name' => 'Public project.',
            'is_private' => false
        ]);

        Project::create([
            'name' => 'This project should NOT be visible.',
            'is_private' => false
        ]);

        Project::create([
            'name' => 'This project should NOT be visible as well.',
            'is_private' => true
        ]);

        $user->projects()->attach($project_private->id);
        $user->projects()->attach($project_public->id);

        Sanctum::actingAs($user, ['*']);

        $response = $this->json('GET', '/api/projects/projects-user-belongs-to-only');

        $response
            ->assertStatus(200)
            ->assertJsonFragment(['name' => 'Private project.'])
            ->assertJsonFragment(['name' => 'Public project.'])
            ->assertJsonMissing(['name' => 'This project should NOT be visible.'])
            ->assertJsonMissing(['name' => 'This project should NOT be visible as well.']);
    }
}
