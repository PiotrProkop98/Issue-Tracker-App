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
use App\Models\ProjectUser;

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

        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        Sanctum::actingAs($user);

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

        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        Sanctum::actingAs($user);

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

        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        Sanctum::actingAs($user);

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

        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        Sanctum::actingAs($user);

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

        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        Sanctum::actingAs($user);

        Project::create($json_object);

        $response = $this->json('POST', '/api/projects/create', $json_object);

        $response
            ->assertStatus(400)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_create_project_user_not_logged_in()
    {
        $json_object = [
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ];

        $expected_json_data = [
            'message' => 'Unauthenticated.'
        ];

        $response = $this->json('POST', '/api/projects/create', $json_object);

        $response
            ->assertStatus(401)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_make_user_leader_success()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        $json_object = [
            'user_id' => $user->id,
            'project_id' => $project->id
        ];

        $expected_json_data = [
            'success' => true
        ];

        Sanctum::actingAs($user);

        $response = $this->json('POST', '/api/project/create/make-user-leader', $json_object);

        $response
            ->assertStatus(201)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_make_user_leader_invalid_id()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        $json_object = [
            'user_id' => $user->id,
            'project_id' => 'string'
        ];

        $expected_json_data = [
            'success' => false,
            'message' => 'Invalid request!'
        ];

        Sanctum::actingAs($user);

        $response = $this->json('POST', '/api/project/create/make-user-leader', $json_object);

        $response
            ->assertStatus(400)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_make_user_leader_user_not_logged_in()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        $json_object = [
            'user_id' => $user->id,
            'project_id' => $project->id
        ];

        $expected_json_data = [
            'message' => 'Unauthenticated.'
        ];

        $response = $this->json('POST', '/api/project/create/make-user-leader', $json_object);

        $response
            ->assertStatus(401)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_make_user_leader_user_does_not_exists()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        $json_object = [
            'user_id' => $user->id + 1,
            'project_id' => $project->id
        ];

        $expected_json_data = [
            'success' => false,
            'message' => 'Invalid request!'
        ];

        Sanctum::actingAs($user);

        $response = $this->json('POST', '/api/project/create/make-user-leader', $json_object);

        $response
            ->assertStatus(400)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_project_edit_get_success()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        $expected_json_data = [
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => 0
        ];

        Sanctum::actingAs($user);

        $response = $this->json('GET', '/api/project/edit-get/' . $project->id);

        $response
            ->assertStatus(200)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_project_edit_get_user_not_logged_in()
    {
        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        $expected_json_data = [
            'message' => 'Unauthenticated.'
        ];

        $response = $this->json('GET', '/api/project/edit-get/' . $project->id);

        $response
            ->assertStatus(401)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_project_edit_get_project_not_found()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $expected_json_data = [
            'success' => false,
            'message' => '404 Not Found...'
        ];

        Sanctum::actingAs($user);

        $response = $this->json('GET', '/api/project/edit-get/1');

        $response
            ->assertStatus(404)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_check_if_user_authorized_success()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        $projectUser = ProjectUser::create([
            'role' => 'Leader',
            'user_id' => $user->id,
            'project_id' => $project->id
        ]);

        $expected_json_data = [
            'allowed' => 1
        ];

        Sanctum::actingAs($user);

        $response = $this->json('GET', '/api/project/' . $user->id . '/' . $project->id);

        $response
            ->assertStatus(200)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_check_if_user_authorized_user_not_logged_in()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        $projectUser = ProjectUser::create([
            'role' => 'Leader',
            'user_id' => $user->id,
            'project_id' => $project->id
        ]);

        $expected_json_data = [
            'message' => 'Unauthenticated.'
        ];

        $response = $this->json('GET', '/api/project/' . $user->id . '/' . $project->id);

        $response
            ->assertStatus(401)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_check_if_user_authorized_wrong_user_id()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        $projectUser = ProjectUser::create([
            'role' => 'Leader',
            'user_id' => $user->id,
            'project_id' => $project->id
        ]);

        $expected_json_data = [
            'message' => 'Unauthenticated.'
        ];

        $wrong_id = $user->id + 1;

        Sanctum::actingAs($user);

        $response = $this->json('GET', '/api/project/' . $wrong_id . '/' . $project->id);

        $response
            ->assertStatus(401)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_check_if_user_authorized_user_is_not_project_leader()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        $projectUser = ProjectUser::create([
            'role' => 'Developer',
            'user_id' => $user->id,
            'project_id' => $project->id
        ]);

        $expected_json_data = [
            'message' => 'Unauthenticated.'
        ];

        Sanctum::actingAs($user);

        $response = $this->json('GET', '/api/project/' . $user->id . '/' . $project->id);

        $response
            ->assertStatus(401)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_view_private_success()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => true
        ]);

        $projectUser = ProjectUser::create([
            'role' => 'Leader',
            'user_id' => $user->id,
            'project_id' => $project->id
        ]);

        $expected_json_data = [
            'success' => true,
            'id' => $project->id,
            'name' => $project->name,
            'description' => $project->description,
            'developer_company_name' => $project->developer_company_name,
            'client_company_name' => $project->client_company_name,
            'is_private' => 1
        ];

        Sanctum::actingAs($user);

        $response = $this->json('GET', '/api/projects/view-private/' . $user->id . '/' . $project->id);

        $response
            ->assertStatus(200)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_view_private_user_not_logged_in()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => true
        ]);

        $projectUser = ProjectUser::create([
            'role' => 'Leader',
            'user_id' => $user->id,
            'project_id' => $project->id
        ]);

        $expected_json_data = [
            'message' => 'Unauthenticated.'
        ];

        $response = $this->json('GET', '/api/projects/view-private/' . $user->id . '/' . $project->id);

        $response
            ->assertStatus(401)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_view_private_user_is_not_a_project_leader()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => true
        ]);

        $projectUser = ProjectUser::create([
            'role' => 'Developer',
            'user_id' => $user->id,
            'project_id' => $project->id
        ]);

        $expected_json_data = [
            'success' => false,
            'message' => 'Unauthenticated.'
        ];

        Sanctum::actingAs($user);

        $response = $this->json('GET', '/api/projects/view-private/' . $user->id . '/' . $project->id);

        $response
            ->assertStatus(401)
            ->assertJsonFragment($expected_json_data);
    }
}
