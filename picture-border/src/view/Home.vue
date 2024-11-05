<script setup lang="ts">
import type { UploadFileInf, UploadInst } from 'naive-ui'
import { ref } from "vue";

import ExifFactory from "@/util/exifFactory";
import CanvasDraw from "@/util/canvasDraw";
import GroupFactory from "@/util/createFactory";

const imgUrl = ref("")
const imgPreUrl = ref("")
const imageData = ref<File>(null)

const exifList = ref<{ [key: string]: string }[]>([])

const handleChange = (event: Event) => {
	const file = event.target.files[0]
	console.log(file)
	imageData.value = file
	imgUrl.value = URL.createObjectURL(file)
	// 清空
	event.target.value = ''
}


// 解析
const handleParse = async () => {
	const data = await ExifFactory.load(imageData.value)
	console.log("图片元数据：", data)
	for (const key in data) {
		if (data[key].description !== '0') {
			exifList.value.push({ key, value: data[key].description })
		}
	}

}

// 绘制
const handleDrawBg = async () => {
	const img = new Image();
	img.src = URL.createObjectURL(imageData.value)
	img.onload = async () => {
		const canvasDraw = new CanvasDraw(img.width * 0.5, img.height * 0.5);
		// 绘制背景图
		await canvasDraw.drawBlurImage(imageData.value, img.width * 0.5, img.height * 0.5)
		// 绘制主图
		// const imageDataURL = await canvasDraw.drawImage(imageData.value, img.width, img.height)
		await canvasDraw.drawMainImage(imageData.value, img.width * 0.5, img.height * 0.5)

		// 绘制文字
		await canvasDraw.drawImage('/src/assets/images/logo.jpg', img.height * 0.55 * 0.06, img.height * 0.55 * 0.06, img.width * (0.25 * (1 - 0.03)), img.height * 0.50)
		// canvasDraw.drawText("Nikon", 'Arial', img.width * 0.25, img.height * 0.53, "#ffffff", img.height * 0.55 * 0.06, 'bold', 'center')
		const imageDataURL = canvasDraw.drawText("135mm f/1.8 200s ISO200", 'Arial', img.width * 0.25, img.height * 0.56, "#ffffff", img.height * 0.55 * 0.04, 'normal', 'center')

		// 添加到页面
		imgPreUrl.value = imageDataURL
	}
}
</script>

<template>
	<div class="home">
		<div class="img-box w-full flex justify-center items-center py-4">
			<img :src="imgUrl" v-if="imgUrl" />
			<img :src="imgPreUrl" v-if="imgPreUrl" />
		</div>
		<div class="w-40 h-10 flex justify-center items-center bg-red mx-auto rounded-full relative">
			<input class="opacity-0 w-full h-full cursor-pointer absolute" type="file"
				accept="image/jpg,image/jpeg,image/png" @change="handleChange" />
			<span class="text-#fff font-bold text-xl">选择图片</span>
		</div>
		<n-space class="my-4" justify="center">
			<n-button type="info" @click="handleParse" :disabled="!imageData">解析元数据</n-button>
			<n-button type="info" @click="handleDrawBg" :disabled="!imageData">生成高斯模糊</n-button>
			<n-button type="info" :disabled="!imageData">添加主图</n-button>
			<n-button type="info" :disabled="!imageData">添加文字</n-button>
			<n-button type="info" :disabled="!imageData">导出图片</n-button>
		</n-space>

		<ul class="list grid grid-cols-2">
			<li v-for="item in exifList" :key="item.key" class="text-xl ">
				<span class="text-#666">{{ item.key }}:</span>
				<span class="text-green">{{ item.value }}</span>
			</li>
		</ul>
	</div>
</template>

<style lang="less" scoped>
.home {
	background: #eee;
}

img {
	width: auto;
	height: 30vh;
	object-fit: contain;
	margin: 0 20px;
}
</style>
