<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\IssueController;

use Illuminate\Support\Facades\DB;
use App\Models\User;

/*
Route::get('/users', function (Request $request) {
    $users = User::all();
    return response()->json($users, 200);
});

Route::get('/users-projects', function () {
    $users_projects = DB::table('user_project')->get();
    return response()->json($users_projects, 200);
});
*/


Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/register', [UserController::class, 'register']);
Route::post('/user/is-email-taken', [UserController::class, 'isEmailTaken']);
Route::get('/user/get-personal-data/{id}', [UserController::class, 'getPersonalData'])->middleware('auth:sanctum');
Route::post('/user/change-name', [UserController::class, 'changeName'])->middleware('auth:sanctum');
Route::post('/user/change-email', [UserController::class, 'changeEmail'])->middleware('auth:sanctum');
Route::post('/user/change-password', [UserController::class, 'changePassword'])->middleware('auth:sanctum');
Route::get('/user/get-project-members/{project_id}', [UserController::class, 'getProjectMembers'])->middleware('auth:sanctum');

Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/projects-user-belongs-to-only', [ProjectController::class, 'projects_user_belongs_to_only'])->middleware('auth:sanctum');
Route::get('/projects/{id}', [ProjectController::class, 'view']);
Route::get('/projects/view-private/{user_id}/{project_id}', [ProjectController::class, 'viewPrivate'])->middleware('auth:sanctum');
Route::post('/projects/create', [ProjectController::class, 'create'])->middleware('auth:sanctum');
Route::post('/projects/edit/{user_id}/{project_id}', [ProjectController::class, 'edit'])->middleware('auth:sanctum');
Route::post('/project/create/make-user-leader', [ProjectController::class, 'makeUserLeader'])->middleware('auth:sanctum');
Route::get('/project/edit-get/{id}', [ProjectController::class, 'getEditData'])->middleware('auth:sanctum');
Route::get('/project/get-by-issue-id/{issue_id}', [ProjectController::class, 'getProjectByIssueId']);
Route::get('/project/{user_id}/{project_id}', [ProjectController::class, 'checkIfUserAuthorized'])->middleware('auth:sanctum');
Route::delete('/project/{user_id}/{project_id}', [ProjectController::class, 'delete'])->middleware('auth:sanctum');

Route::get('/issues/{project_id}', [IssueController::class, 'all']);
Route::get('/issue/{issue_id}', [IssueController::class, 'show']);
Route::get('/issue/show-user/{issue_id}/{user_id}', [IssueController::class, 'showUser']);
Route::post('/issue/create', [IssueController::class, 'create'])->middleware('auth:sanctum');
Route::post('/issue/assign', [IssueController::class, 'assign'])->middleware('auth:sanctum');