import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import checker from 'vite-plugin-checker'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(() => {
	// const env = loadEnv(mode, process.cwd())
	return {
		build: { outDir: '../backend/app/static', emptyOutDir: true },
		plugins: [
			react(),
			checker({ typescript: true }),
			visualizer({
				filename: './stats.html', // Output file
				open: true, // Open in browser automatically
			}),
		],
		server: {
			proxy: {
				'/api/': {
					target: 'http://127.0.0.1:8000',
					changeOrigin: true,
					secure: false,
					debug: true,
				},
			},
			open: true,
			watch: {
				usePolling: true,
				interval: 1000,
			},
		},
	}
})
