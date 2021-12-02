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
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        Project::create([
            'name' => 'This project should NOT be visible.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
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
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => true
        ]);

        $project_public = Project::create([
            'name' => 'Public project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        Project::create([
            'name' => 'This project should NOT be visible.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        Project::create([
            'name' => 'This project should NOT be visible as well.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
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

    public function test_view_returns_correct_json()
    {
        Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        $project = Project::get()->first();

        $response = $this->json('GET', '/api/projects/' . $project->id);

        $response
            ->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Test project.'
            ]);
    }

    public function test_view_private_project_returns_404()
    {
        Project::create([
            'name' => 'Private project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => true
        ]);

        $project = Project::get()->first();

        $response = $this->json('GET', '/api/projects/' . $project->id);

        $response
            ->assertStatus(404)
            ->assertJsonFragment([
                'success' => false,
                'message' => '404 Not Found.'
            ]);
    }

    public function test_create_project_success()
    {
        $json_object = [
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ];

        $expected_json_data = [
            'success' => true,
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ];

        $response = $this->json('POST', '/api/projects/create', $json_object);

        $response
            ->assertStatus(201)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_create_project_invalid_name()
    {
        $json_object = [
            'name' => '',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ];

        $expected_json_data = [
            'success' => false,
            'message' => 'Invalid project name!'
        ];

        $response = $this->json('POST', '/api/projects/create', $json_object);

        $response
            ->assertStatus(400)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_create_project_invalid_description()
    {
        $json_object = [
            'name' => 'Test project.',
            'description' => '',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ];

        $expected_json_data = [
            'success' => false,
            'message' => 'Invalid project description!'
        ];

        $response = $this->json('POST', '/api/projects/create', $json_object);

        $response
            ->assertStatus(400)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_create_project_invalid_is_private()
    {
        $json_object = [
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => 123
        ];

        $expected_json_data = [
            'success' => false,
            'message' => 'Invalid project data!'
        ];

        $response = $this->json('POST', '/api/projects/create', $json_object);

        $response
            ->assertStatus(400)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_create_project_name_already_taken()
    {
        $json_object = [
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ];

        $expected_json_data = [
            'success' => false,
            'message' => 'Project name already taken!'
        ];

        Project::create($json_object);

        $response = $this->json('POST', '/api/projects/create', $json_object);

        $response
            ->assertStatus(400)
            ->assertJsonFragment($expected_json_data);
    }
}
