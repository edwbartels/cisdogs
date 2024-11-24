import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import checker from 'vite-plugin-checker'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), checker({ typescript: true })],
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
})
