<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Post;
class FetchPosts extends Command
{
    protected $signature = 'fetch:posts';
    protected $description = 'Fetch posts from external API and save them to the database';

    public function handle()
    {
        $response = Http::get('https://jsonplaceholder.typicode.com/posts');

        if ($response->successful()) {
            $posts = $response->json();

            foreach ($posts as $post) {
                Post::updateOrCreate(
                    ['id' => $post['id']],
                    ['title' => $post['title'], 'body' => $post['body']]
                );
            }
            $this->info('Posts have been successfully fetched and saved.');
        } else {
            $this->error('Failed to fetch data from the API.');
        }
    }
}
