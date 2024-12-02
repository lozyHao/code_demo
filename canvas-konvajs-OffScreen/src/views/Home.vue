<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import Konva from 'konva';
import { computed, onMounted, ref, watch } from 'vue'

const w = 5000
const h = 3200

const el = ref(null)
const { width, height } = useElementSize(el)
const boxWidth = computed(() => width.value)
const boxHeight = computed(() => height.value)

// 监听窗口变化
watch([width, height], () => {
	console.log(width.value, height.value)
	onScale()
})


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
const drawText = (t: string = 'Hello World', x: number = 10) => {
	const text = new Konva.Text({
		x: x,
		y: 10,
		text: t,
		fontSize: 100,
		fontFamily: 'Arial',
		fill: 'black'
	})

	layer.value?.add(text)
}

// 添加到舞台
const addToStage = () => {
	if (stage.value && layer.value) {
		stage.value.add(layer.value as Konva.Layer)
	}
}

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


// 绘制文字
const text = ref("您好呀")
const onUpdate = () => {
	drawText(text.value, 600)
}


onMounted(() => {
	initStage()
	drawText()
	addToStage()
})
</script>

<template>
	<div class="home w-full h-100vh flex flex-col relative">
		<div class="box w-full flex items-center justify-center absolute top-0" style="height: calc(100vh - 60px);"
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
				<n-gi :span="3">
					<n-button class="w-full" type="info">上传图片</n-button>
				</n-gi>
				<n-gi :span="2" class="flex items-center">
					<img class="w-full h-8 object-contain bg-#ddd"
						src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"></img>
				</n-gi>
			</n-grid>
		</div>
	</div>
</template>