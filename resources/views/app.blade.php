<!DOCTYPE html>
<html  lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <link href="{{ asset('css/app.css') }}" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])

        @inertiaHead
    </head>
    <body class="font-sans antialiased rtl">
        <div class="page-wrapper compact-wrapper" id="pageWrapper">
            @inertia
        </div>

        <!-- Scripts -->
        <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
        <script src="{{ asset('/js/bootstrap.js') }}"></script>
    </body>
</html>
