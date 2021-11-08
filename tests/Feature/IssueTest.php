<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Hash;

use App\Models\Project;
use App\Models\User;
use App\Models\Issue;

class IssueTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_issues_success()
    {
        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => Hash::make('123456')
        ]);

        $issue = Issue::create([
            'title' => 'Test issue.',
            'description' => 'Bla bla bla.',
            'status' => 'New',
            'project_id' => $project->id,
            'user_id' => $user->id
        ]);

        $response = $this->json('GET', '/api/issues/' . $issue->id);

        $response
            ->assertStatus(200)
            ->assertJsonFragment([
                'title' => 'Test issue.',
                'description' => 'Bla bla bla.',
                'status' => 'New'
            ]);
    }

    public function test_no_private_projects_in_response()
    {
        $project = Project::create([
            'name' => 'Private project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => true
        ]);

        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => Hash::make('123456')
        ]);

        $issue = Issue::create([
            'title' => 'Test issue.',
            'description' => 'Bla bla bla.',
            'status' => 'New',
            'project_id' => $project->id,
            'user_id' => $user->id
        ]);

        $response = $this->json('GET', '/api/issues/' . $issue->id);

        $response
            ->assertStatus(404)
            ->assertJsonMissing([
                'title' => 'Test issue.',
                'description' => 'Bla bla bla.',
                'status' => 'New'
            ]);
    }

    public function test_no_closed_issues_in_json()
    {
        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => Hash::make('123456')
        ]);

        $issue = Issue::create([
            'title' => 'Test issue.',
            'description' => 'Bla bla bla.',
            'status' => 'Closed',
            'project_id' => $project->id,
            'user_id' => $user->id
        ]);

        $response = $this->json('GET', '/api/issues/' . $issue->id);

        $response
            ->assertStatus(200)
            ->assertJsonMissing([
                'title' => 'Test issue.',
                'description' => 'Bla bla bla.',
                'status' => 'Closed'
            ]);
    }

    public function test_show_issue_success()
    {
        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        $issue = Issue::create([
            'title' => 'Test issue.',
            'description' => 'Bla bla bla.',
            'status' => 'New',
            'project_id' => $project->id,
            'user_id' => null
        ]);

        $response = $this->json('GET', '/api/issue/' . $issue->id);

        $response
            ->assertStatus(200)
            ->assertJsonFragment([
                'title' => 'Test issue.',
                'description' => 'Bla bla bla.',
                'status' => 'New'
            ]);
    }

    public function test_show_issue_no_private_project_in_json()
    {
        $project = Project::create([
            'name' => 'Private project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => true
        ]);

        $issue = Issue::create([
            'title' => 'Test issue.',
            'description' => 'Bla bla bla.',
            'status' => 'New',
            'project_id' => $project->id,
            'user_id' => null
        ]);

        $response = $this->json('GET', '/api/issue/' . $issue->id);

        $response
            ->assertStatus(404)
            ->assertJsonMissing([
                'title' => 'Test issue.',
                'description' => 'Bla bla bla.',
                'status' => 'New'
            ]);
    }

    public function test_issue_does_not_exists()
    {
        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        $response = $this->json('GET', '/api/issue/1');

        $response
            ->assertStatus(404)
            ->assertJsonMissing([
                'title' => 'Test issue.',
                'description' => 'Bla bla bla.',
                'status' => 'New'
            ]);
    }

    public function test_show_user_success()
    {
        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => Hash::make('123456')
        ]);

        $issue = Issue::create([
            'title' => 'Test issue.',
            'description' => 'Bla bla bla.',
            'status' => 'New',
            'project_id' => $project->id,
            'user_id' => $user->id
        ]);

        $response = $this->json('GET', '/api/issue/show-user/' . $issue->id . '/' . $user->id);

        $response
            ->assertStatus(200)
            ->assertJsonFragment([
                'success' => true,
            ]);
    }

    public function test_show_user_no_user()
    {
        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => false
        ]);

        $issue = Issue::create([
            'title' => 'Test issue.',
            'description' => 'Bla bla bla.',
            'status' => 'New',
            'project_id' => $project->id,
            'user_id' => null
        ]);

        $response = $this->json('GET', '/api/issue/show-user/' . $issue->id . '/1');

        $response
            ->assertStatus(404)
            ->assertJsonFragment([
                'success' => false,
                'message' => '404 Not Found.'
            ]);
    }

    public function test_show_user_no_issue()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => Hash::make('123456')
        ]);

        $response = $this->json('GET', '/api/issue/show-user/1/' . $user->id);

        $response
            ->assertStatus(404)
            ->assertJsonFragment([
                'success' => false,
                'message' => '404 Not Found.'
            ]);
    }

    public function test_show_user_no_project()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => Hash::make('123456')
        ]);

        $issue = Issue::create([
            'title' => 'Test issue.',
            'description' => 'Bla bla bla.',
            'status' => 'New',
            'project_id' => null,
            'user_id' => $user->id
        ]);

        $response = $this->json('GET', '/api/issue/show-user/' . $issue->id . '/' . $user->id);

        $response
            ->assertStatus(404)
            ->assertJsonFragment([
                'success' => false,
                'message' => '404 Not Found.'
            ]);
    }

    public function test_show_user_project_is_private()
    {
        $project = Project::create([
            'name' => 'Test project.',
            'description' => 'Bla bla bla.',
            'developer_company_name' => 'Developer.com',
            'client_company_name' => 'Client.com',
            'is_private' => true
        ]);

        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => Hash::make('123456')
        ]);

        $issue = Issue::create([
            'title' => 'Test issue.',
            'description' => 'Bla bla bla.',
            'status' => 'New',
            'project_id' => $project->id,
            'user_id' => $user->id
        ]);

        $response = $this->json('GET', '/api/issue/show-user/' . $issue->id . '/' . $user->id);

        $response
            ->assertStatus(404)
            ->assertJsonFragment([
                'success' => false,
                'message' => '404 Not Found.'
            ]);
    }
}
