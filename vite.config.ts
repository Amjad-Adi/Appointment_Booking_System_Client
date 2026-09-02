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
                    target:
                        env.VITE_NODE_ENV == 'development'
                            ? env.VITE_SERVER_DEVELOPMENT + (Number(env.VITE_SERVER_PORT) || 3000)
                            : env.VITE_DEPLOYMENT_SERVER,
                    changeOrigin: true,
                },
            },
        },
    };
});
