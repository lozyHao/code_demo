import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';

import qiankun from 'vite-plugin-qiankun'

export default defineConfig((mode) => {
	return {
		plugins: [
			vue(),
			qiankun('sonVueTwo', {
				useDevMode: true,
			}),
		],
		server: {
			port: 7772,
		}
	}
})
