<script setup lang="ts">
import type { UploadFileInf, UploadInst } from 'naive-ui'
import { ref } from "vue";

import ExifFactory from "@/util/exifFactory";
import CanvasDraw from "@/util/canvasDraw";
import GroupFactory, { ImageTextItem } from "@/util/createFactory";

const imgUrl = ref("")
const imgPreUrl = ref<string[]>([])
const imageData = ref<File>()

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
	const exif = new ExifFactory(imageData.value)
	const data = await exif.load()
	console.log("图片元数据：", data)
}

// 白色边框
const handleDrawBg1 = async () => {
	const img = new Image();
	img.src = URL.createObjectURL(imageData.value)
	img.onload = async () => {
		const canvasDraw = new CanvasDraw(img.width * 0.5, img.height * 0.5);
		// 绘制背景图
		await canvasDraw.drawBlurImage(imageData.value, img.width * 0.5, img.height * 0.5)
		// 绘制主图
		await canvasDraw.drawMainImage(imageData.value, img.width * 0.5, img.height * 0.5)

		// 绘制白底边框
		canvasDraw.drawColorBackground('#ffffff', 0, img.height * 0.5, img.width * 0.5, img.height * 0.5 * 0.15);

		// 绘制文字
		const imageDataURL: string = canvasDraw.drawText("Nikon", 'Arial', img.width * 0.25, img.height * 0.55, "#000000", img.height * 0.55 * 0.06, 'bold', 'center')

		// 添加到页面
		imgPreUrl.value.push(imageDataURL)
	}
}

// 黑色边框
const handleDrawBg11 = async () => {
	const img = new Image();
	img.src = URL.createObjectURL(imageData.value)
	img.onload = async () => {
		const canvasDraw = new CanvasDraw(img.width * 0.5, img.height * 0.5);
		// 绘制背景图
		await canvasDraw.drawBlurImage(imageData.value, img.width * 0.5, img.height * 0.5)
		// 绘制主图
		await canvasDraw.drawMainImage(imageData.value, img.width * 0.5, img.height * 0.5)

		// 绘制黑底边框
		canvasDraw.drawColorBackground('#000000', 0, img.height * 0.5, img.width * 0.5, img.height * 0.5 * 0.15);

		// 绘制文字
		const imageDataURL: string = canvasDraw.drawText("Nikon", 'Arial', img.width * 0.25, img.height * 0.55, "#ffffff", img.height * 0.55 * 0.06, 'bold', 'center')

		// 添加到页面
		imgPreUrl.value.push(imageDataURL)
	}
}

// 黑色边框-1
const handleDrawBg111 = async () => {
	const img = new Image();
	img.src = URL.createObjectURL(imageData.value)
	img.onload = async () => {
		const canvasDraw = new CanvasDraw(img.width * 0.5, img.height * 0.5);
		// 绘制主图
		await canvasDraw.drawMainImage(imageData.value, img.width * 0.5, img.height * 0.5, 1, 1, 10)

		// 绘制黑底边框
		canvasDraw.drawColorBackground('#000000', 0, img.height * 0.5, img.width * 0.5, img.height * 0.5 * 0.15);

		// 绘制文字
		const imageDataURL: string = canvasDraw.drawText("Nikon", 'Arial', img.width * 0.25, img.height * 0.55, "#ffffff", img.height * 0.55 * 0.06, 'bold', 'center')

		// 添加到页面
		imgPreUrl.value.push(imageDataURL)
	}
}


// 透明边框
const handleDrawBg2 = async () => {
	const img = new Image();
	img.src = URL.createObjectURL(imageData.value)
	img.onload = async () => {
		const canvasDraw = new CanvasDraw(img.width * 0.5, img.height * 0.5);
		// 绘制背景图
		await canvasDraw.drawBlurImage(imageData.value, img.width * 0.5, img.height * 0.5)
		// 绘制主图
		await canvasDraw.drawMainImage(imageData.value, img.width * 0.5, img.height * 0.5)

		// 绘制文字
		canvasDraw.drawText("Nikon", 'Arial', img.width * 0.025, img.height * 0.55, "#ffffff", img.height * 0.55 * 0.06, 'bold', 'left')
		const imageDataURL = canvasDraw.drawText("135mm f/1.8 200s ISO200", 'Arial', img.width * 0.475, img.height * 0.55, "#ffffff", img.height * 0.55 * 0.04, 'normal', 'right')

		// 添加到页面
		imgPreUrl.value.push(imageDataURL)
	}
}

// 透明边框-1
const handleDrawBg21 = async () => {
	const img = new Image();
	img.src = URL.createObjectURL(imageData.value)
	img.onload = async () => {
		const canvasDraw = new CanvasDraw(img.width * 0.5, img.height * 0.5);
		// 绘制背景图
		await canvasDraw.drawBlurImage(imageData.value, img.width * 0.5, img.height * 0.5)
		// 绘制主图
		await canvasDraw.drawMainImage(imageData.value, img.width * 0.5, img.height * 0.5)

		// 绘制文字
		await canvasDraw.drawImage('/src/assets/images/logo.jpg', img.height * 0.55 * 0.06, img.height * 0.55 * 0.06, img.width * (0.25 * (1 - 0.03)), img.height * 0.50)
		const imageDataURL = canvasDraw.drawText("135mm f/1.8 200s ISO200", 'Arial', img.width * 0.25, img.height * 0.56, "#ffffff", img.height * 0.55 * 0.04, 'normal', 'center')

		// 添加到页面
		imgPreUrl.value.push(imageDataURL)
	}
}

// 内部
const handleDrawBg3 = async () => {
	const img = new Image();
	img.src = URL.createObjectURL(imageData.value)
	img.onload = async () => {
		const canvasDraw = new CanvasDraw(img.width * 0.5, img.height * 0.5, 0);
		// 绘制主图
		await canvasDraw.drawMainImage(imageData.value, img.width * 0.5, img.height * 0.5, 1, 1, 10)

		// 绘制文字
		const imageDataURL: string = canvasDraw.drawText("Nikon", 'Arial', img.width * 0.25, img.height * 0.48, "#ffffff", img.height * 0.55 * 0.06, 'bold', 'center')

		// 添加到页面
		imgPreUrl.value.push(imageDataURL)
	}
}

// 图文结合绘制在一排
const handleDrawTextWidthImage = async (type: string = 'left') => {
	const img = new Image();
	img.src = URL.createObjectURL(imageData.value)
	img.onload = async () => {
		const size = img.height * 0.55 * 0.04 // 字体大小、图片高度

		const canvasDraw = new CanvasDraw(img.width * 0.5, img.height * 0.5, 0);
		const createFactory = new GroupFactory(canvasDraw)
		// 绘制主图
		await canvasDraw.drawMainImage(imageData.value, img.width * 0.5, img.height * 0.5, 1, 1, 10)

		// 设置内容
		const items: ImageTextItem = [
			{
				type: 'image',
				content: "/src/assets/images/logo.jpg",
			},
			{
				type: 'text',
				content: "Nikon Z 6_2",
			}, {
				type: 'image',
				content: "/src/assets/images/huawei.svg",
			}
		]

		// 绘制
		const imageDataURL: string = await createFactory.drawItems(items, type, size)

		// 添加到页面
		imgPreUrl.value.push(imageDataURL)
	}
}
</script>

<template>
	<div class="home">
		<div class="img-box w-full flex justify-center items-center py-4">
			<img class="h-50 w-full object-contain" :src="imgUrl" v-if="imgUrl" />
		</div>
		<div class="w-40 h-10 flex justify-center items-center bg-red mx-auto rounded-full relative">
			<input class="opacity-0 w-full h-full cursor-pointer absolute" type="file"
				accept="image/jpg,image/jpeg,image/png" @change="handleChange" />
			<span class="text-#fff font-bold text-xl">选择图片</span>
		</div>
		<n-space class="my-4" justify="center">
			<n-button type="info" @click="handleParse" :disabled="!imageData">解析元数据</n-button>
			<n-button type="info" @click="handleDrawBg1" :disabled="!imageData">白色边框</n-button>
			<n-button type="info" @click="handleDrawBg11" :disabled="!imageData">黑色边框</n-button>
			<n-button type="info" @click="handleDrawBg111" :disabled="!imageData">黑色边框-1</n-button>
			<n-button type="info" :disabled="!imageData" @click="handleDrawBg2">透明边框</n-button>
			<n-button type="info" :disabled="!imageData" @click="handleDrawBg21">透明边框-1</n-button>
			<n-button type="info" :disabled="!imageData" @click="handleDrawBg3">内部水印</n-button>
			<n-button type="info" :disabled="!imageData" @click="handleDrawTextWidthImage('left')">图文组合绘制-左</n-button>
			<n-button type="info" :disabled="!imageData"
				@click="handleDrawTextWidthImage('center')">图文组合绘制-中心</n-button>
			<n-button type="info" :disabled="!imageData" @click="handleDrawTextWidthImage('right')">图文组合绘制-右</n-button>
		</n-space>

		<div class="grid grid-cols-3 py-10">
			<div class="w-full h-full p-2 object-contain" v-for="item in imgPreUrl" :key="item">
				<img :src="item" class="w-full h-full object-contain">
			</div>
		</div>
	</div>
</template>

<style lang="less" scoped>
.home {
	background: #eee;
}
</style>
