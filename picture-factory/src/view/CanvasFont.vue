<script setup lang="ts">
import { ref } from 'vue';
import fzBold from '../assets/fonts/fz_bold.ttf'
import fzLan from '../assets/fonts/fz_lan.ttf'
import fz from '../assets/fonts/fz.ttf'
import zh from '../assets/fonts/zh.ttf'

import FontWorker from '../hooks/fontWorker?worker';
import WorkerManager from '../hooks/WorkerManager';


const fontList: { name: string, src: string }[] = [
	{
		name: 'fz_bold',
		src: fzBold
	}, {
		name: 'fz_lan',
		src: fzLan
	}, {
		name: 'fz',
		src: fz
	}, {
		name: 'zh',
		src: zh
	}
]
const index = ref<number>(0)

// canvas 绘制
const draw = () => {
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.font = `bold 20px ${fontList[index.value].name}`;
	ctx.textAlign = 'center';
	ctx.fillStyle = "#000000";
	ctx.fillText("Hello World", canvas.width / 2, canvas.height / 2);
}

// 离屏canvas绘制
const image = ref<string | null>(null)
const handleOffscreenCanvas = async () => {
	const canvas = new OffscreenCanvas(500, 500);
	const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

	ctx.font = `20px ${fontList[index.value].name}`;
	ctx.textAlign = 'center';
	ctx.fillStyle = "#000000";
	ctx.fillText("Hello World", canvas.width / 2, canvas.height / 2);

	const blob = await canvas.convertToBlob({ type: 'image/png' });
	image.value = URL.createObjectURL(blob) as string;
}

// worker 离屏绘制
const workerDraw = () => {
	const worker = new WorkerManager();
	worker.createWorker("draw", FontWorker);
	worker.postMessage("draw", { font: fontList[index.value].name, fontBuffer: fontList[index.value].src }, (message: any) => {
		console.log("接收到的数据", message);

		image.value = message
	});
}

const loadFont = () => {
	for (const item of fontList) {
		const f = new FontFace(item.name, `url(${item.src})`, {
			style: 'normal',
		});
		f.load().then((result) => {
			console.log('font loaded', result);
			document.fonts.add(f);
		}).catch(err => {
			console.log(err);
		})
	}
}
loadFont()
</script>
<template>
	<div class="canvas-font flex justify-center">
		<canvas class=" bg-#ddd" id="canvas" width="400" height="400"></canvas>
		<img :src="image" v-if="image" class="w-100 h-100 object-contain bg-#eee">
	</div>
	<button class="block w-20 h-10 mx-auto my-4 cursor-pointer" @click="draw">绘制</button>
	<button class="block w-20 h-10 mx-auto my-4 cursor-pointer" @click="handleOffscreenCanvas">离屏绘制</button>
	<button class="block w-60 h-10 mx-auto my-4 cursor-pointer" @click="workerDraw">离屏绘制+worker(字体不生效)</button>
	<div class="flex justify-center">
		<div class="mx-4 cursor-pointer text-blue hover:text-red font-bold text-xl" v-for="(item, i) in fontList"
			:key="item.name" :class="index === i ? 'text-red' : ''" :style="{ 'font-family': item.name }"
			@click="index = i">
			{{ item.name }}
		</div>
	</div>
</template>