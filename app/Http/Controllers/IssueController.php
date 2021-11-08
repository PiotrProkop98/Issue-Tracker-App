<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Project;
use App\Models\Issue;
use App\Models\User;

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
            return response()->json([
                'success' => true,
                'user' => $user
            ], 200);
        }
    }
}
