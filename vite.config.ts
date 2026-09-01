import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
        server: {
            port: Number(env.VITE_CLIENT_PORT) || 8080,
            proxy: {
                '/api': {
                    target: `http://localhost:${Number(env.VITE_SERVER_PORT) || 3000}`,
                    changeOrigin: true,
                },
            },
        },
    };
});
