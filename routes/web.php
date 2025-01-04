<?php
use Illuminate\Support\Facades\Route;
use App\Exports\PostsExport;
use App\Imports\PostsImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Post;

// Route::get('/', function () {
//     return Inertia::render('Welcome');
// });

Route::get('/posts', function () {
    return Inertia::render('Posts', [
        'posts' => Post::all()
    ]);
});

Route::get('/export-posts', function () {
    return Excel::download(new PostsExport, 'posts.xlsx');
});

Route::post('/import-posts', function (Request $request) {
    $request->validate([
        'file' => 'required|mimes:xlsx',
    ]);

    Excel::import(new PostsImport, $request->file('file'));
    
    return redirect()->back()
        ->with('message', 'Posts imported successfully!');
});