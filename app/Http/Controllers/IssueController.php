<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Project;
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
}
