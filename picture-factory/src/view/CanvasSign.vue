<script setup lang="ts">
import fzBold from '../assets/fonts/fz_bold.ttf'
import fzLan from '../assets/fonts/fz_lan.ttf'
import fz from '../assets/fonts/fz.ttf'
import zh from '../assets/fonts/zh.ttf'

import { ref } from 'vue';

const fontList: { name: string, src: string }[] = [
	{
		name: 'zh',
		src: zh
	}, {
		name: 'fz_bold',
		src: fzBold
	}, {
		name: 'fz_lan',
		src: fzLan
	}, {
		name: 'fz',
		src: fz
	}
]
const index = ref<number>(0)

const italic = ref(false)
const bold = ref(false)
const color = ref('#000000')
const letterSpace = ref(0)
const wordSpace = ref(0)

const text = ref(null)

// 方式一：canvas
const fontSize = ref(40)

const draw = (text: string) => {
	// 校验text是否存在中文
	if (/[\u4e00-\u9fa5]/.test(text)) {
		console.log('有中文');
	}
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	const { width, height } = getTextWidth()
	canvas.width = width + 20
	canvas.height = height

	ctx.textBaseline = 'middle';
	ctx.letterSpacing = `${letterSpace.value}px`;
	ctx.wordSpacing = `${wordSpace.value}px`;
	ctx.font = `${bold.value ? 'bold' : 'normal'} ${italic.value ? 'italic' : 'normal'} ${fontSize.value}px ${fontList[index.value].name}`;
	ctx.fillStyle = color.value;
	ctx.fillText(text, 10, canvas.height / 2);
}

// 计算绘制的文字的宽高
const getTextWidth = () => {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	ctx.letterSpacing = `${letterSpace.value}px`;
	ctx.wordSpacing = `${wordSpace.value}px`;
	ctx.font = `${bold.value ? 'bold' : 'normal'} ${italic.value ? 'italic' : 'normal'} ${fontSize.value}px ${fontList[index.value].name}`;
	return {
		width: ctx.measureText(text.value || '').width,
		height: ctx.measureText(text.value || '').actualBoundingBoxAscent * 2 / 1.2
	};
}


const exportCanvas = () => {
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	const dataUrl = canvas.toDataURL('image/png');
	const a = document.createElement('a');
	a.href = dataUrl;
	a.download = 'sign.png';
	a.click();
}


const onChange = () => {
	draw(text.value ?? '')
}
const onChangeFont = (i: number) => {
	index.value = i
	draw(text.value ?? '')
}

const loadFont = () => {
	for (const item of fontList) {
		const f = new FontFace(item.name, `url(${item.src})`, {
			style: 'normal',
		});
		f.load().then(() => {
			document.fonts.add(f);
		}).catch(err => {
			console.log(err);
		})
	}
}
loadFont()
</script>
<template>
	<div class="canvas-sign">
		<!-- 方式一 -->
		<h3 class="text-center">canvas</h3>
		<div class="bg-#ddd min-h-4 p-4 overflow-x-auto">
			<canvas class="bg-transparent m-auto block" id="canvas"></canvas>
		</div>
		<n-button class="block w-20 h-10 mx-auto my-4 cursor-pointer" type="info" @click="exportCanvas">导出图片</n-button>
		<h3 class="text-center mt-5">字体选择</h3>
		<div class="flex justify-center">
			<div class="mx-4 cursor-pointer text-blue hover:text-red font-bold text-xl" v-for="(item, i) in fontList"
				:key="item.name" :class="index === i ? 'text-red' : ''" :style="{ 'font-family': item.name }"
				@click="onChangeFont(i)">
				{{ item.name }}
			</div>
		</div>
		<div class="flex justify-center items-center w-80% mx-auto mt-4">
			<n-input v-model:value="text" class="flex-1 mr-4" type=" text" placeholder="请输入签名" @input="draw($event)"
				:maxlength="50" show-count></n-input>
			斜体：<n-switch v-model:value="italic" @change="onChange"></n-switch>
			粗体：<n-switch v-model:value="bold" @change="onChange"></n-switch>
			颜色：<n-color-picker class="w-20" v-model:value="color" @update:value="onChange"></n-color-picker>
		</div>
		<div class="flex justify-center items-center w-80% mx-auto mt-4">
			字号：<n-slider class="w-60 mr-4" v-model:value="fontSize" @dragend="onChange"></n-slider>
			字母间距：<n-slider class="w-60 mr-4" v-model:value="letterSpace" @dragend="onChange"></n-slider>
			单词/文字间距：<n-slider class="w-60" v-model:value="wordSpace" @dragend="onChange"></n-slider>
		</div>
	</div>
</template>