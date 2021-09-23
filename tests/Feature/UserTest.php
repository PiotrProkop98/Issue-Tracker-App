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
        $jsonObject = [
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => '123456',
            'password_confirmation' => '123456'
        ];

        $response = $this->json('POST', '/api/register', $jsonObject);

        $expected_json_data = [
            'success' => true,
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop'
        ];

        $user = User::where('email', 'piotr1@gmail.com')->first();
        $password_match = Hash::check('123456', $user->password);

        $response
            ->assertStatus(200)
            ->assertJsonFragment($expected_json_data);
        
        $this->assertNotEmpty($user);
        $this->assertSame('piotr1@gmail.com', $user->email);
        $this->assertSame('Piotr Prokop', $user->name);
        $this->assertTrue($password_match);
    }

    public function test_register_invalid_email()
    {
        $jsonObject = [
            'email' => 'piotr1gmail.com',
            'name' => 'Piotr Prokop',
            'password' => '123456',
            'password_confirmation' => '123456'
        ];

        $response = $this->json('POST', '/api/register', $jsonObject);

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
        $jsonObject = [
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => '123456',
            'password_confirmation' => '123456'
        ];

        User::create([
            'email' => $jsonObject['email'],
            'name' => 'Diffrent name',
            'password' => Hash::make('123456')
        ]);

        $response = $this->json('POST', '/api/register', $jsonObject);

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
        $jsonObject = [
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => '123456',
            'password_confirmation' => 'diffrentPassword'
        ];

        $response = $this->json('POST', '/api/register', $jsonObject);

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
        $jsonObject = [
            'email' => 'piotr1@gmail.com',
            'password' => '123456'
        ];

        User::create([
            'email' => $jsonObject['email'],
            'name' => 'Piotr Prokop',
            'password' => Hash::make('123456')
        ]);

        $response = $this->json('POST', '/api/login', $jsonObject);

        $expected_json_data = [
            'success' => true,
            'email' => $jsonObject['email'],
            'name' => 'Piotr Prokop'
        ];

        $response
            ->assertStatus(200)
            ->assertJsonFragment($expected_json_data);
    }

    public function test_login_invalid_email()
    {
        $jsonObject = [
            'email' => 'piotr1gmail.com',
            'password' => '123456'
        ];

        $response = $this->json('POST', '/api/login', $jsonObject);

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
        $jsonObject = [
            'email' => 'piotr1@gmail.com',
            'password' => '123456'
        ];

        $response = $this->json('POST', '/api/login', $jsonObject);

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
        $jsonObject = [
            'email' => 'piotr1@gmail.com',
            'password' => '12'
        ];

        $response = $this->json('POST', '/api/login', $jsonObject);

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
        $jsonObject = [
            'email' => 'piotr1@gmail.com',
            'password' => '123456'
        ];

        User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => Hash::make('654321')
        ]);

        $response = $this->json('POST', '/api/login', $jsonObject);

        $expected_json_data = [
            'success' => false,
            'error' => 'Invalid email or password!'
        ];

        $response
            ->assertStatus(400)
            ->assertJson($expected_json_data);
    }
}
