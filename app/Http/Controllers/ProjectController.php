<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Project;
use App\Models\User;
use App\Models\ProjectUser;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $projects = Project::orderBy('created_at', 'DESC')
            ->where('is_private', '=', '0')
            ->paginate(10);

        return response()->json($projects, 200);
    }

    public function view($id)
    {
        $error = [
            'success' => false,
            'message' => '404 Not Found.'
        ];

        $project = Project::where('id', '=', $id)->first();

        if (!$project || $project->is_private == 1) {
            return response()->json($error, 404);
        }

        return response()->json($project, 200);
    }

    public function projects_user_belongs_to_only(Request $request)
    {
        $projects = $request
            ->user()
            ->projects()
            ->orderBy('created_at')
            ->paginate();

        return response()->json($projects, 200);
    }

    public function create(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string'
            ]);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid project name!'
            ], 400);
        }

        try {
            $request->validate([
                'description' => 'required|string'
            ]);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid project description!'
            ], 400);
        }

        try {
            $request->validate([
                'developer_company_name' => 'required|string'
            ]);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid Developer company name!'
            ], 400);
        }

        try {
            $request->validate([
                'client_company_name' => 'required|string'
            ]);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid Client company name!'
            ], 400);
        }

        try {
            $request->validate([
                'is_private' => 'required|boolean'
            ]);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid project data!'
            ], 400);
        }

        $project_exists = Project::where('name', '=', $request->all()['name'])->first();

        if ($project_exists) {
            return response()->json([
                'success' => false,
                'message' => 'Project name already taken!'
            ], 400);
        }

        $project = Project::create([
            'name' => $request->all()['name'],
            'description' => $request->all()['description'],
            'developer_company_name' => $request->all()['developer_company_name'],
            'client_company_name' => $request->all()['client_company_name'],
            'is_private' => $request->all()['is_private']
        ]);

        return response()->json([
            'success' => true,
            'id' => $project->id,
            'name' => $request->all()['name'],
            'description' => $request->all()['description'],
            'developer_company_name' => $request->all()['developer_company_name'],
            'client_company_name' => $request->all()['client_company_name'],
            'is_private' => $request->all()['is_private']
        ], 201);
    }

    public function makeUserLeader(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|integer',
                'project_id' => 'required|integer'
            ]);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid request!'
            ], 400);
        }

        $user = User::where('id', '=', $request->all()['user_id'])->first();
        $project = Project::where('id', '=', $request->all()['project_id'])->first();

        if (!$user || !$project) {
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

        $project_user = ProjectUser::create([
            'role' => 'Leader',
            'user_id' => $request->all()['user_id'],
            'project_id' => $request->all()['project_id']
        ]);

        return response()->json([
            'success' => true
        ], 201);
    }
}
