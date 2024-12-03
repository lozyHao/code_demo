<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import Konva from 'konva';
import { computed, onMounted, ref, watch } from 'vue'

let w = 5000 // 初始化宽度
let h = 3200 // 初始化高度

const stage = ref<null | Konva.Stage>(null)
const layer = ref<null | Konva.Layer>(null)

// 初始化
const initStage = () => {
	stage.value = new Konva.Stage({
		container: 'container',
		width: w,
		height: h
	})

	layer.value = new Konva.Layer()
}


// 绘制文字
const textC = ref<Konva.Text | null>(null)
const drawText = (t: string = 'Hello World', x: number = 0, y: number = 0) => {
	textC.value = new Konva.Text({
		x: x,
		y: y,
		text: t,
		fontSize: 100,
		fontFamily: 'Arial',
		fill: 'black',
		draggable: true,
	})

	layer.value?.add(textC.value as Konva.Text)


	const tr = new Konva.Transformer({
		nodes: [textC.value as Konva.Text],
		keepRatio: false,
		flipEnabled: false,
		boundBoxFunc: (oldBox, newBox) => {
			if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
				return oldBox;
			}
			return newBox;
		},
	});

	layer.value?.add(tr);
}


// 绘制图片
const imageC = ref<Konva.Image | null>(null)
const drawImage = (image: CanvasImageSource, x: number = 10, y: number = 10, w: number = 200, h: number = 100, borderRadius: number) => {
	imageC.value = new Konva.Image({
		x: x,
		y: y,
		image: image,
		width: w,
		height: h,
		cornerRadius: borderRadius,
		draggable: true,
	})

	layer.value?.add(imageC.value as Konva.Image)
}

// 添加到舞台
const addToStage = () => {
	if (stage.value && layer.value) {
		stage.value.add(layer.value as Konva.Layer)
	}
}


// 绘制文字
const text = ref("您好呀")
const onUpdate = () => {
	textC.value?.setText(text.value)
	textC.value?.setSize(100)
}

const img = ref<string | null>(null)
const onUploadImage = (e: any) => {
	const file = e.target.files[0]
	const image = new Image()
	const url = URL.createObjectURL(file)
	image.src = URL.createObjectURL(file)
	img.value = url
	image.onload = () => {
		console.log(image.width, image.height)

		// 设置canvas尺寸
		w = image.width * 1.1
		h = image.height * 1.1
		onScale()

		const x = (w - image.width) / 2
		const y = (h - image.height) / 2
		const borderRadius = Math.random() * 0.5 + 0.1
		if (!imageC.value) {
			drawImage(image, x, y, image.width, image.height, borderRadius)
		} else {
			imageC.value?.image(image)
			imageC.value?.width(image.width)
			imageC.value?.height(image.height)
			imageC.value?.x(x)
			imageC.value?.y(y)
			imageC.value?.cornerRadius(Math.min(image.width / 2, image.height / 2) * borderRadius)
		}

	}
}

onMounted(() => {
	initStage()
	drawText()
	addToStage()
})


const el = ref(null)
const { width, height } = useElementSize(el)
const boxWidth = computed(() => width.value)
const boxHeight = computed(() => height.value)

// 监听窗口变化
watch([width, height], () => {
	console.log(width.value, height.value)
	onScale()
})

// 响应式
const onScale = () => {
	const { width, height } = resizeImageToFit(boxWidth.value, boxHeight.value, w, h)
	stage.value?.width(width)
	stage.value?.height(height)
	stage.value?.scale({ x: width / w, y: height / h })
}


// 根据窗口变化计算缩放
function resizeImageToFit(boxWidth: number, boxHeight: number, imageWidth: number, imageHeight: number) {
	// 计算宽高比例
	const imageRatio = imageWidth / imageHeight;
	const boxRatio = boxWidth / boxHeight;

	let newWidth, newHeight;

	if (imageRatio > boxRatio) {
		// 图片更宽，以高度为准来缩放
		newWidth = boxWidth;
		newHeight = newWidth / imageRatio;
	} else {
		// 图片更高或宽高比例与盒子相同，以宽度为准来缩放
		newHeight = boxHeight;
		newWidth = newHeight * imageRatio;
	}

	return {
		width: newWidth,
		height: newHeight,
	};
}
</script>

<template>
	<div class="home w-full flex flex-col relative" style="height: calc(100vh - 40px);">
		<div class="box w-full flex items-center justify-center absolute top-0" style="height: calc(100vh - 100px);"
			ref="el">
		</div>
		<div class="flex justify-center items-center" ref="box"
			:style="{ width: boxWidth + 'px', height: boxHeight + 'px' }">
			<div class="canvas bg-#eee" id="container"></div>
		</div>
		<div class="control w-full my-6">
			<n-grid :cols="32" :x-gap="8" class="flex items-center">
				<n-gi :span="2" align="end">文本</n-gi>
				<n-gi :span="6">
					<n-input v-model:value="text" @update:value="onUpdate"></n-input>
				</n-gi>
				<n-gi :span="6">
					<!-- <n-button class="w-full" type="info">上传图片</n-button> -->
					<input type="file" accept="image/*" @change="onUploadImage">
				</n-gi>
				<n-gi :span="2" class="flex items-center">
					<img class="w-full h-8 object-contain bg-#ddd"
						:src="img || 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'"></img>
				</n-gi>
			</n-grid>
		</div>
	</div>
</template>