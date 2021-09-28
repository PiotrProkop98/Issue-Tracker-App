<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Project;
use App\Models\ProjectUser;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $projects = Project::orderBy('created_at')
            ->where('is_private', '=', '0')
            ->paginate(10);

        return response()->json($projects, 200);
    }

    public function all(Request $request)
    {
        $projects = Project::orderBy('created_at')->paginate(10);
        return response()->json($projects, 200);
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
}
