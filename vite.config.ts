import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths({ projects: ['./tsconfig.json'] })],
    resolve: {
        alias: {
            '@shared': path.resolve(__dirname, 'src/shared'),
            '@widgets': path.resolve(__dirname, 'src/widgets'),
            '@features': path.resolve(__dirname, 'src/features'),
            '@app': path.resolve(__dirname, 'src/app'),
            '@pages': path.resolve(__dirname, 'src/pages'),
        },
    },
});
