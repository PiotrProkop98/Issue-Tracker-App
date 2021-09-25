<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController;

use Illuminate\Support\Facades\DB;
use App\Models\User;

/*
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
*/

Route::get('/users', function (Request $request) {
    $users = User::all();
    return response()->json($users, 200);
});

Route::get('/users-projects', function () {
    $users_projects = DB::table('user_project')->get();
    return response()->json($users_projects, 200);
});

Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/register', [UserController::class, 'register']);

Route::get('/projects', [ProjectController::class, 'index']);