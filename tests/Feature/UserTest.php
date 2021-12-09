<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Hash;
use Laravel\Sanctum\Sanctum;

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

    public function test_is_email_taken_returns_true()
    {
        User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => Hash::make('123456')
        ]);

        $json_object = [
            'email' => 'piotr1@gmail.com'
        ];

        $expected_json_data = [
            'taken' => true
        ];

        $response = $this->json('POST', '/api/user/is-email-taken', $json_object);

        $response
            ->assertStatus(200)
            ->assertJson($expected_json_data);
    }

    public function test_is_email_taken_returns_false()
    {
        User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => Hash::make('123456')
        ]);

        $json_object = [
            'email' => 'diffrentemail@gmail.com'
        ];

        $expected_json_data = [
            'taken' => false
        ];

        $response = $this->json('POST', '/api/user/is-email-taken', $json_object);

        $response
            ->assertStatus(200)
            ->assertJson($expected_json_data);
    }

    public function test_get_user_personal_data_success()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => Hash::make('123456')
        ]);

        Sanctum::actingAs($user);

        $expected_json_data = [
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop'
        ];

        $response = $this->json('GET', '/api/user/get-personal-data/' . $user->id);

        $response
            ->assertStatus(200)
            ->assertJson($expected_json_data);
    }

    public function test_get_user_personal_data_user_not_log_in()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop',
            'password' => Hash::make('123456')
        ]);

        $expected_json_data = [
            'message' => 'Unauthenticated.'
        ];

        $response = $this->json('GET', '/api/user/get-personal-data/' . $user->id);

        $response
            ->assertStatus(401)
            ->assertJson($expected_json_data);
    }

    public function test_get_user_personal_data_wrong_user_id()
    {
        $user1 = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $user2 = User::create([
            'email' => 'piotr2@gmail.com',
            'name' => 'Piotr Prokop 2',
            'password' => Hash::make('123456')
        ]);

        $expected_json_data = [
            'message' => 'Unauthenticated.'
        ];

        Sanctum::actingAs($user1);

        $response = $this->json('GET', '/api/user/get-personal-data/' . $user2->id);

        $response
            ->assertStatus(401)
            ->assertJson($expected_json_data);
    }

    public function test_change_name_success()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $json_object = [
            'id' => $user->id,
            'name' => 'New valid name'
        ];

        $expected_json_data = [
            'success' => true,
            'name' => $json_object['name']
        ];

        Sanctum::actingAs($user);

        $response = $this->json('POST', '/api/user/change-name', $json_object);

        $response
            ->assertStatus(200)
            ->assertJson($expected_json_data);
    }

    public function test_change_name_invalid_name()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $json_object = [
            'id' => $user->id,
            'name' => 'a'
        ];

        $expected_json_data = [
            'success' => false,
            'message' => 'Invalid username!'
        ];

        Sanctum::actingAs($user);

        $response = $this->json('POST', '/api/user/change-name', $json_object);

        $response
            ->assertStatus(400)
            ->assertJson($expected_json_data);
    }

    public function test_change_name_user_not_log_in()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $json_object = [
            'id' => $user->id,
            'name' => 'New valid name'
        ];

        $expected_json_data = [
            'message' => 'Unauthenticated.'
        ];

        $response = $this->json('POST', '/api/user/change-name', $json_object);

        $response
            ->assertStatus(401)
            ->assertJson($expected_json_data);
    }

    public function test_change_name_user_does_not_exists()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $json_object = [
            'id' => $user->id + 1,
            'name' => 'New valid name'
        ];

        $expected_json_data = [
            'success' => false,
            'message' => 'Invalid request!'
        ];

        Sanctum::actingAs($user);

        $response = $this->json('POST', '/api/user/change-name', $json_object);

        $response
            ->assertStatus(400)
            ->assertJson($expected_json_data);
    }

    public function test_change_name_wrong_user_id()
    {
        $user1 = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $user2 = User::create([
            'email' => 'piotr2@gmail.com',
            'name' => 'Piotr Prokop 2',
            'password' => Hash::make('123456')
        ]);

        $json_object = [
            'id' => $user2->id,
            'name' => 'New valid name'
        ];

        $expected_json_data = [
            'message' => 'Unauthenticated.'
        ];

        Sanctum::actingAs($user1);

        $response = $this->json('POST', '/api/user/change-name', $json_object);

        $response
            ->assertStatus(401)
            ->assertJson($expected_json_data);
    }

    public function test_change_email_success()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $json_object = [
            'id' => $user->id,
            'email' => 'piotr2@gmail.com'
        ];

        $expected_json_data = [
            'success' => true,
            'email' => $json_object['email']
        ];

        Sanctum::actingAs($user);

        $response = $this->json('POST', '/api/user/change-email', $json_object);

        $response
            ->assertStatus(200)
            ->assertJson($expected_json_data);
    }

    public function test_change_email_user_not_log_in()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $json_object = [
            'id' => $user->id,
            'email' => 'piotr2@gmail.com'
        ];

        $expected_json_data = [
            'message' => 'Unauthenticated.'
        ];

        $response = $this->json('POST', '/api/user/change-email', $json_object);

        $response
            ->assertStatus(401)
            ->assertJson($expected_json_data);
    }

    public function test_change_email_user_does_not_exists()
    {
        $user = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $json_object = [
            'id' => $user->id + 1,
            'email' => 'piotr2@gmail.com'
        ];

        $expected_json_data = [
            'success' => false,
            'message' => 'Invalid request!'
        ];

        Sanctum::actingAs($user);

        $response = $this->json('POST', '/api/user/change-email', $json_object);

        $response
            ->assertStatus(400)
            ->assertJson($expected_json_data);
    }

    public function test_change_email_wrong_user_id()
    {
        $user1 = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $user2 = User::create([
            'email' => 'piotr2@gmail.com',
            'name' => 'Piotr Prokop 2',
            'password' => Hash::make('123456')
        ]);

        $json_object = [
            'id' => $user2->id,
            'email' => 'piotr3@gmail.com'
        ];

        $expected_json_data = [
            'message' => 'Unauthenticated.'
        ];

        Sanctum::actingAs($user1);

        $response = $this->json('POST', '/api/user/change-email', $json_object);

        $response
            ->assertStatus(401)
            ->assertJson($expected_json_data);
    }

    public function test_change_email_email_already_taken()
    {
        $user1 = User::create([
            'email' => 'piotr1@gmail.com',
            'name' => 'Piotr Prokop 1',
            'password' => Hash::make('123456')
        ]);

        $user2 = User::create([
            'email' => 'piotr2@gmail.com',
            'name' => 'Piotr Prokop 2',
            'password' => Hash::make('123456')
        ]);

        $json_object = [
            'id' => $user1->id,
            'email' => 'piotr2@gmail.com'
        ];

        $expected_json_data = [
            'success' => false,
            'message' => 'Invalid email!'
        ];

        Sanctum::actingAs($user1);

        $response = $this->json('POST', '/api/user/change-email', $json_object);

        $response
            ->assertStatus(400)
            ->assertJson($expected_json_data);
    }
}
