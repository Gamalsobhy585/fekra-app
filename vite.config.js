import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx', 'resources/css/app.css'],
            refresh: true,
        }),
        react(),
    ],
    esbuild: {
        loader: 'jsx', // Ensure JSX syntax is handled
        include: /\.(js|jsx)$/, // Process .js and .jsx files as JSX
        exclude: /node_modules/,
    },
    server: {
        hmr: {
            overlay: false, // Disable the error overlay if it's intrusive
        },
    },
});
