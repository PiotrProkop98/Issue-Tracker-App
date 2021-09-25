<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Hash;

use App\Models\User;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_success()
    {
        $json_object = [
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => '123456',
            'password_confirmation' => '123456'
        ];

        $response = $this->json('POST', '/api/register', $json_object);

        $expected_json_data = [
            'success' => true,
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop'
        ];

        $user = User::where('email', 'piotr1@gmail.com')->first();
        $password_match = Hash::check('123456', $user->password);

        $response
            ->assertStatus(201)
            ->assertJsonFragment($expected_json_data);
        
        $this->assertNotEmpty($user);
        $this->assertSame('piotr1@gmail.com', $user->email);
        $this->assertSame('Piotr Prokop', $user->name);
        $this->assertTrue($password_match);
    }

    public function test_register_invalid_email()
    {
        $json_object = [
            'email' => 'piotr1gmail.com',
            'name' => 'Piotr Prokop',
            'password' => '123456',
            'password_confirmation' => '123456'
        ];

        $response = $this->json('POST', '/api/register', $json_object);

        $expected_json_data = [
            'success' => false,
            'error' => 'Invalid credentials!'
        ];

        $user = User::where('email', 'piotr1@gmail.com')->first();

        $response
            ->assertStatus(400)
            ->assertJson($expected_json_data);
        
        $this->assertEmpty($user);
    }

    public function test_register_email_not_unique()
    {
        $json_object = [
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => '123456',
            'password_confirmation' => '123456'
        ];

        User::create([
            'email' => $json_object['email'],
            'name' => 'Diffrent name',
            'password' => Hash::make('123456')
        ]);

        $response = $this->json('POST', '/api/register', $json_object);

        $expected_json_data = [
            'success' => false,
            'error' => 'Invalid credentials!'
        ];

        $user = User::where('email', 'piotr1@gmail.com')->first();

        $response
            ->assertStatus(400)
            ->assertJson($expected_json_data);
        
        $this->assertSame(1, count(User::all()));
    }

    public function test_register_passwords_arent_the_same()
    {
        $json_object = [
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => '123456',
            'password_confirmation' => 'diffrentPassword'
        ];

        $response = $this->json('POST', '/api/register', $json_object);

        $expected_json_data = [
            'success' => false,
            'error' => 'Invalid credentials!'
        ];

        $user = User::where('email', 'piotr1@gmail.com')->first();

        $response
            ->assertStatus(400)
            ->assertJson($expected_json_data);
        
        $this->assertEmpty($user);
    }

    public function test_login_success()
    {
        $json_object = [
            'email' => 'piotr1@gmail.com',
            'password' => '123456'
        ];

        User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => Hash::make('123456')
        ]);

        $response = $this->json('POST', '/api/login', $json_object);

        $expected_json_data = [
            'success' => true,
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop'
        ];

        $response
            ->assertStatus(200)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_login_invalid_email()
    {
        $json_object = [
            'email' => 'piotr1gmail.com',
            'password' => '123456'
        ];

        $response = $this->json('POST', '/api/login', $json_object);

        $expected_json_data = [
            'success' => false,
            'error' => 'Invalid email or password!'
        ];

        $response
            ->assertStatus(400)
            ->assertJson($expected_json_data);
    }

    public function test_login_user_does_not_exists()
    {
        $json_object = [
            'email' => 'piotr1@gmail.com',
            'password' => '123456'
        ];

        $response = $this->json('POST', '/api/login', $json_object);

        $expected_json_data = [
            'success' => false,
            'error' => 'Invalid email or password!'
        ];

        $response
            ->assertStatus(400)
            ->assertJson($expected_json_data);
    }

    public function test_login_password_too_short()
    {
        $json_object = [
            'email' => 'piotr1@gmail.com',
            'password' => '12'
        ];

        $response = $this->json('POST', '/api/login', $json_object);

        $expected_json_data = [
            'success' => false,
            'error' => 'Invalid email or password!'
        ];

        $response
            ->assertStatus(400)
            ->assertJson($expected_json_data);
    }

    public function test_login_incorrect_password()
    {
        $json_object = [
            'email' => 'piotr1@gmail.com',
            'password' => '123456'
        ];

        User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => Hash::make('654321')
        ]);

        $response = $this->json('POST', '/api/login', $json_object);

        $expected_json_data = [
            'success' => false,
            'error' => 'Invalid email or password!'
        ];

        $response
            ->assertStatus(400)
            ->assertJson($expected_json_data);
    }

    public function test_logout()
    {
        $json_object = [
            'email' => 'piotr1@gmail.com',
            'password' => '123456'
        ];

        $expected_json_data = [
            'success' => true
        ];

        User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => Hash::make('123456')
        ]);

        $response = $this->json('POST', '/api/login', $json_object);

        $response
            ->assertStatus(200)
            ->assertJson($expected_json_data);
    }
}
