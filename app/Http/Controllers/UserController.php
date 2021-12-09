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
            'id' => $user->id,
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
            'id' => $user->id,
            'email' => $request->all()['email'],
            'name' => $request->all()['name'],
            'token' => $token->plainTextToken
        ], 201);
    }

    public function isEmailTaken(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|unique:users'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['taken' => true], 200);
        }

        return response()->json(['taken' => false], 200);
    }

    public function getPersonalData(Request $request, $id)
    {
        $user = User::where('id', '=', $id)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        $user_logged_in = $request->user();

        if ($user_logged_in->id != $user->id) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        return response()->json([
            'email' => $user_logged_in->email,
            'name' => $user_logged_in->name
        ], 200);
    }

    public function changeName(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|min:3|max:255',
                'id' => 'required'
            ]);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid username!'
            ], 400);
        }

        $user = User::where('id', '=', $request->all()['id'])->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid request!'
            ], 400);
        }

        $user_logged_in = $request->user();

        if ($user_logged_in->id != $user->id) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        $user->name = $request->all()['name'];
        $user->save();

        return response()->json([
            'success' => true,
            'name' => $request->all()['name']
        ], 200);
    }

    public function changeEmail(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|unique:users',
                'id' => 'required'
            ]);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email!'
            ], 400);
        }

        $user = User::where('id', '=', $request->all()['id'])->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid request!'
            ], 400);
        }

        $user_logged_in = $request->user();

        if ($user_logged_in->id != $user->id) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        $user->email = $request->all()['email'];
        $user->save();

        return response()->json([
            'success' => true,
            'email' => $request->all()['email']
        ], 200);
    }

    public function changePassword(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required'
            ]);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid request'
            ], 400);
        }

        try {
            $request->validate([
                'new_password' => 'required|min:5|max:255'
            ]);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid new password!'
            ], 400);
        }

        try {
            $request->validate([
                'old_password' => 'required|min:5|max:255'
            ]);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid old password!'
            ], 400);
        }

        $user = User::where('id', '=', $request->all()['id'])->first();

        if (!$user || !Hash::check($request->all()['old_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid old password!'
            ], 400);
        }

        $user_logged_in = $request->user();

        if ($user_logged_in->id != $user->id) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        $user->password = Hash::make($request->all()['new_password']);
        $user->save();

        return response()->json([
            'success' => true,
            'new_password' => $request->all()['new_password']
        ], 200);
    }
}
