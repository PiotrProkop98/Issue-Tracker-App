<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Models\Project;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_request_all_public_projects()
    {
        $this->withoutExceptionHandling();

        Project::create([
            'name' => 'Test project.',
            'is_private' => false
        ]);

        Project::create([
            'name' => 'This project should NOT be visible.',
            'is_private' => true
        ]);

        $expected_json_data = [
            'current_page' => 1,
            'data' => [
                [
                    'name' => 'Test project.',
                    'is_private' => 0
                ]
            ]
        ];

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
}
