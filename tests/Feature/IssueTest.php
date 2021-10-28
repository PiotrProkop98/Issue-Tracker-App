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
}
