<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Hash;

use Illuminate\Support\Facades\DB;

use App\Models\User;

class UserController extends Controller
{
    public function login(Request $request) {
        $errorResponse = [
            'success' => false,
            'error' => 'Invalid email or password!'
        ];

        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|min:5|max:255'
            ]);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($errorResponse, 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json($errorResponse, 400);
        }

        $token = $user->createToken('token-' . $user->id);

        return response()->json([
            'success' => true,
            'email' => $request->all()['email'],
            'name' => $user->name,
            'token' => $token->plainTextToken
        ], 200);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true
        ], 200);
    }

    public function register(Request $request) {
        $errorResponse = [
            'success' => false,
            'error' => 'Invalid credentials!'
        ];

        try {
            $request->validate([
                'email' => 'required|email|unique:users',
                'name' => 'required|min:3|max:255',
                'password' => 'required|min:5|max:255|confirmed'
            ]);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json($errorResponse, 400);
        }

        $user = User::create([
            'email' => $request->all()['email'],
            'name' => $request->all()['name'],
            'password' => Hash::make($request->all()['password'])
        ]);

        $token = $user->createToken('token-' . $user->id);

        return response()->json([
            'success' => true,
            'email' => $request->all()['email'],
            'name' => $request->all()['name'],
            'token' => $token->plainTextToken
        ], 201);
    }
}
