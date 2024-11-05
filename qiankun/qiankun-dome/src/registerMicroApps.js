// registerMicroApps.js
import { registerMicroApps, start, addGlobalUncaughtErrorHandler } from 'qiankun';


registerMicroApps([
	{
		name: 'sonVueOne', // 子应用名称
		entry: '//localhost:7771', // 子应用入口
		container: '#container', // 子应用挂载的容器
		activeRule: '/son-vue-one', // 子应用激活规则
	}, {
		name: 'sonVueTwo', // 子应用名称
		entry: '//localhost:7772', // 子应用入口
		container: '#container', // 子应用挂载的容器
		activeRule: '/son-vue-two', // 子应用激活规则
	},
], {
	beforeLoad: [
		app => {
			console.log('[LifeCycle] before load %c%s', 'color: green;', app.name)
		}
	],
	beforeMount: [
		app => {
			console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name)
		}
	],
	afterUnmount: [
		app => {
			console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name)
		}
	]
});

// 全局的未捕获异常处理器
addGlobalUncaughtErrorHandler(event => {
	console.log(event)
})

start({
	prefetch: false, // 开启预加载
	sandbox: {
		experimentalStyleIsolation: true, //   开启沙箱模式,实验性方案
	},
});