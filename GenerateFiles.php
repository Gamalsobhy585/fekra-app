<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

class GenerateFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:files {names*}'; 

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate Service, Repository, and Controller files for the provided names';

    protected $fileService;

    /**
     * Create a new command instance.
     */
    public function __construct(Filesystem $fileService)
    {
        parent::__construct();
        $this->fileService = $fileService;
    }

  
    public function handle(): void
    {
        $names = $this->argument('names');

        foreach ($names as $name) {
            $this->info("Generating files for {$name}...");

            // File paths and names
            $files = [
                app_path("Services/{$name}Service.php"),
                app_path("Repositories/Interface/I{$name}.php"),
                app_path("Repositories/Implementation/{$name}Repository.php"),
                app_path("Http/Controllers/{$name}Controller.php"),
                app_path("Models/{$name}.php"),
                app_path("Http/Resources/{$name}Resource.php"),
                app_path("Http/Requests/Store{$name}Request.php"),
                app_path("Http/Requests/Update{$name}Request.php"),
            ];

            foreach ($files as $file) {
                $this->createFile($file, $name);
            }

            // Update AppServiceProvider
            $this->updateAppServiceProvider($name);

            $this->info("Files for {$name} generated successfully.");
        }
    }
    protected function createFile($filePath, $name)
    {
        if ($this->fileService->exists($filePath)) {
            $this->warn("File {$filePath} already exists.");
            return;
        }
    
        $this->fileService->ensureDirectoryExists(dirname($filePath));
    
        // Determine the file type from its path
        $type = $this->determineFileType($filePath);
    
        // Get the content for the file
        $content = $this->getStubContent($type, $name);
    
        if (!$content) {
            $this->error("Could not generate content for file type: {$type}");
            return;
        }
    
        $this->fileService->put($filePath, $content);
        $this->info("File {$filePath} created.");
    }
    
    
    protected function determineFileType($filePath)
    {
        if (str_contains($filePath, 'Interface')) {
            return 'repository-interface';
        } elseif (str_contains($filePath, 'Implementation')) {
            return 'repository';
        } elseif (str_contains($filePath, 'Service')) {
            return 'service-interface';
        } elseif (str_contains($filePath, 'Controller')) {
            return 'controller';
        } elseif (str_contains($filePath, 'Resource')) {
            return 'resource';
        } elseif (str_contains($filePath, 'Models')) {
            return 'model';
        } elseif (str_contains($filePath, 'Store')) {
            return 'store-request';
        } elseif (str_contains($filePath, 'Update')) {
            return 'update-request';
        }
    
        return ''; // Default case for unknown file types
    }
    
    protected function updateAppServiceProvider($name)
    {
        $appServiceProviderPath = app_path('Providers/AppServiceProvider.php');
        
        if (!$this->fileService->exists($appServiceProviderPath)) {
            $this->error("AppServiceProvider not found.");
            return;
        }

        $content = $this->fileService->get($appServiceProviderPath);

        // Check if the binding already exists
        $bindingCode = "\$this->app->bind(I{$name}::class, {$name}Repository::class);";
        $useStatement = "use App\Repositories\Interface\I{$name};\nuse App\Repositories\Implementation\{$name}Repository;";

        // Add use statement if not exists
        if (!str_contains($content, $useStatement)) {
            $content = str_replace(
                'use Illuminate\Support\ServiceProvider;',
                "use Illuminate\Support\ServiceProvider;\n{$useStatement}",
                $content
            );
        }

        // Add binding if not exists
        if (!str_contains($content, $bindingCode)) {
            $content = preg_replace(
                '/public function boot\(\)[\s\S]*?{/',
                "public function boot()\n    {\n        {$bindingCode}",
                $content
            );
        }

        $this->fileService->put($appServiceProviderPath, $content);
        $this->info("Updated AppServiceProvider with {$name} repository binding.");
    }


    protected function getStubContent($type, $className)
    {
        switch ($type) {
            case 'repository-interface':
                return <<<EOT
    <?php
    
    namespace App\Repositories\Interface;
    
    interface I{$className}
    {
        public function get(\$limit);
        public function show(\$model);
        public function save(\$model);
        public function delete(\$model);
        public function update(\$model);
        public function search(\$request, \$limit);
    }
    
    EOT;
            
            case 'repository':
                return <<<EOT
    <?php
    
    namespace App\Repositories\Implementation;
    
    use App\Models\\{$className};
    use App\Repositories\Interface\\I{$className};
    
    class {$className}Repository implements I{$className}
    {
        public function get(\$limit)
        {
                    return {$className}::paginate(\$limit);

        }
    
        public function show(\$model)
        {
        return {$className}::find(\$model->id);
        }
    
        public function save(\$model)
        {
        return  {$className}::create(\$model);
        }
    
        public function delete(\$model)
        {
                return \$model->delete(); 
        }
    
        public function search(\$request, \$limit)
        {
         return  {$className}::whereAny([],"LIKE","%".\$request."%")->paginate(\$limit);    
        }

         public function update(\$model)
    {
        return \$model->save();
    }



    }
    
    EOT;
    
            case 'service-interface':
                return <<<EOT
    <?php
    
    namespace App\Services;
    
    use App\Repositories\Interface\\I{$className};
    use App\Traits\ResponseTrait;
    use Illuminate\Support\Facades\Log;
    use App\Http\Resources\\{$className}Resource;
    
    class {$className}Service
    {
        private I{$className} \${$className}repo;
    
        public function __construct(I{$className} \${$className}repo)
        {
            \$this->{$className}repo = \${$className}repo;
        }
    
        // Add methods to use the repository here
    }
    
    EOT;
    
            case 'controller':
                return <<<EOT
    <?php
    
    namespace App\Http\Controllers;
    
    use App\Http\Controllers\Controller;
    use App\Models\\{$className};
    use App\Services\\{$className}Service;
    use Illuminate\Http\Request;
    
    class {$className}Controller extends Controller
    {
        private {$className}Service \${$className}service;
    
        public function __construct({$className}Service \${$className}service)
        {
            \$this->{$className}service = \${$className}service;
        }
    
        // Controller methods to call the service methods here
    }
    
    EOT;
            case 'resource':
                return <<<EOT
    <?php
    namespace App\Http\Resources;

    use Illuminate\Http\Request;
    use Illuminate\Http\Resources\Json\JsonResource;

    class {$className}Resource extends JsonResource
    {
     public function toArray(Request \$request): array
    {
       return [
        ];
    }
    
    }
    
    EOT;
            case 'model':
                return <<<EOT
    
     <?php

    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

    class {$className} extends Model
        {
        protected \$fillable = [];

    
     }

    
    }
    
    EOT;
    case 'store-request':
        return <<<EOT
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Store{$className}Request extends FormRequest
{
public function authorize()
{
return true;
}

public function rules()
{
return [

];
}
}
EOT;
    
    case 'update-request':
        return <<<EOT
<?php

namespace App\Http\Requests;

use App\Models\\{$className};
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Http\FormRequest;

class Update{$className}Request extends FormRequest
{
public function authorize()
{
return true;
}

public function rules()
{
return [
   
];
}
}
EOT;
    
            default:
                return '';
        }
    }
    
}
