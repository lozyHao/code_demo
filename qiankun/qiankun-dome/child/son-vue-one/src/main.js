import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

import {
	renderWithQiankun,
	qiankunWindow,
} from 'vite-plugin-qiankun/dist/helper'

const createMyApp = () => {
	const app = createApp(App);
	app.use(router);
	return app;
};

const render = (props = {}) => {
	const { container } = props
	const app2 = container?.querySelector('#app-one') || '#app-one' // 避免 id 重复导致微应用挂载失败
	const app = createMyApp()
	app.mount(app2)
}

const initQianKun = () => {
	renderWithQiankun({
		bootstrap() {
			console.log('微应用：bootstrap')
		},
		mount(props) {
			// 获取主应用传入数据
			console.log('微应用：mount', props)
			render(props)
		},
		unmount(props) {
			console.log('微应用：unmount', props)
		},
		update(props) {
			console.log('微应用：update', props)
		},
	})
}
qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : render() // 判断是否使用 qiankun ，保证项目可以独立运行
