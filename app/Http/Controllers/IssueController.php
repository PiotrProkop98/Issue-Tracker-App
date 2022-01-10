<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Project;
use App\Models\User;
use App\Models\ProjectUser;
use App\Models\Issue;

class IssueController extends Controller
{
    public function all($id)
    {
        $error = [
            'success' => false,
            'message' => '404 Not Found.'
        ];

        $project = Project::where('id', '=', $id)->first();

        if (!$project || $project->is_private == 1) {
            return response()->json($error, 404);
        }

        $issues = $project->issues()->where('status', '<>', 'Closed')->get();

        return response()->json($issues, 200);
    }

    public function show($id)
    {
        $error = [
            'success' => false,
            'message' => '404 Not Found.'
        ];

        $issue = Issue::where('id', '=', $id)->first();

        if (!$issue) {
            return response()->json($error, 404);
        }

        $project = $issue->project()->first();

        if (!$project || $project->is_private == 1) {
            return response()->json($error, 404);
        }

        return response()->json($issue, 200);
    }

    public function showUser($issue_id, $user_id)
    {
        $error = [
            'success' => false,
            'message' => '404 Not Found.'
        ];

        $issue = Issue::where('id', '=', $issue_id)->first();

        if (!$issue) {
            return response()->json($error, 404);
        }

        $project = $issue->project()->first();

        if (!$project || $project->is_private == 1) {
            return response()->json($error, 404);
        }

        $user = User::where('id', '=', $user_id)->first();

        if (!$user) {
            return response()->json($error, 404);
        } else {
            $userData = [
                'id' => $user->id,
                'name' => $user->name
            ];

            return response()->json([
                'success' => true,
                'user' => $userData
            ], 200);
        }
    }

    public function create(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string',
                'description' => 'required|string',
                'status' => 'required|string',
                'project_id' => 'required'
            ]);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid issue data!'
            ], 400);
        }

        $user = $request->user();

        $project = Project::where('id', '=', $request->all()['project_id'])->first();

        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid issue data!'
            ], 400);
        }

        $issue = Issue::create([
            'title' => $request->all()['title'],
            'description' => $request->all()['description'],
            'status' => $request->all()['status'],
            'project_id' => $request->all()['project_id'],
            'user_id' => null
        ]);

        return response()->json([
            'success' => true,
            'id' => $issue->id
        ], 201);
    }

    public function assign(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required',
                'issue_id' => 'required'
            ]);
        }
        catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid data!'
            ], 400);
        }

        $user_leader = $request->user();

        $user_developer = User::where('id', '=', $request->all()['user_id'])->first();

        if (!$user_developer) {
            return response()->json([
                'success' => false,
                'message' => '404 Project not found.'
            ], 404);
        }

        $project_user_leader = ProjectUser::where('user_id', '=', $user_leader->id)->first();

        if (!$project_user_leader) {
            return response()->json([
                'success' => false,
                'message' => '404 Project not found.'
            ], 401);
        }

        $project = Project::where('id', '=', $project_user_leader->project_id)->first();

        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => '404 Project not found.'
            ], 401);
        }

        if ($project_user_leader->role != 'Leader') {
            return response()->json([
                'success' => false,
                'message' => 'Only project leader can assing issues.'
            ], 401);
        }

        $project_user_developer = ProjectUser::where('user_id', '=', $user_developer->id)->first();

        if (!$project_user_developer) {
            return response()->json([
                'success' => false,
                'message' => 'This user is not part of a team.'
            ], 401);
        }

        $issue = Issue::where('id', '=', $request->all()['issue_id'])->first();

        if (!$issue || $issue->project_id != $project->id) {
            return response()->json([
                'success' => false,
                'message' => '404 Issue not found.'
            ], 404);
        }

        $issue->user_id = $user_developer->id;
        $issue->save();

        return response()->json([
            'success' => true
        ], 200);
    }
}
