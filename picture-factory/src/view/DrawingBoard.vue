<script setup>
import { ref, onMounted } from 'vue';

// 引用Canvas元素
const canvas = ref(null);
// 画笔颜色
const penColor = ref('#000000');
// 画笔粗细
const penSize = ref(6);

const isDraw = ref(true)

// 存储鼠标按下时的坐标
let startX = 0;
let startY = 0;

// 存储上一次鼠标移动的坐标
let prevX = 0;
let prevY = 0;

// 用于判断鼠标是否按下
let isDrawing = false;

// 存储绘制上下文
let ctx = null;

// 画笔是否展示
const isShowPen = ref(false)
const eraseX = ref(0)
const eraseY = ref(0)

// 存储Canvas的边界信息
const canvasRect = ref({ left: 0, top: 0 });

// 在组件挂载时初始化Canvas
onMounted(() => {
	ctx = canvas.value.getContext('2d');
	const rect = canvas.value.getBoundingClientRect();
	canvasRect.value = { left: rect.left, top: rect.top };
	canvas.value.addEventListener('mousedown', (e) => {
		isDrawing = true;
		if (isDraw.value) {
			startDrawing(e)
			draw(e)
		} else {
			erase(e)
		}
	});
	canvas.value.addEventListener('mousemove', (e) => {
		if (isDraw.value) {
			draw(e)
		} else {
			erase(e)
		}
	});
	canvas.value.addEventListener('mouseup', stopDrawing);

	// 鼠标进入和离开事件
	canvas.value.addEventListener('mouseenter', () => {
		isShowPen.value = true
	});
	canvas.value.addEventListener('mouseleave', () => {
		isShowPen.value = false
		stopDrawing();
	});
});

// 鼠标按下事件处理函数
const startDrawing = (e) => {
	const startX = e.clientX - canvasRect.value.left;
	const startY = e.clientY - canvasRect.value.top;
	prevX = startX;
	prevY = startY;

	ctx.strokeStyle = penColor.value;
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
};

// 绘制
const draw = (e) => {
	const currentX = e.clientX - canvasRect.value.left;
	const currentY = e.clientY - canvasRect.value.top;

	// 根据鼠标移动的距离计算速度，这里简单地通过两点间的距离来估算
	const distance = Math.sqrt((currentX - prevX) ** 2 + (currentY - prevY) ** 2);
	const dynamicPenSize = Math.max(1, penSize.value - distance / 6);

	eraseX.value = currentX - penSize.value / 2
	eraseY.value = currentY - penSize.value / 2

	if (!isDrawing) return;

	ctx.beginPath();
	ctx.lineWidth = dynamicPenSize < ctx.lineWidth ? ctx.lineWidth - 0.6 : ctx.lineWidth + 0.6;
	ctx.strokeStyle = penColor.value;

	const centerX = (prevX + currentX) / 2;
	const centerY = (prevY + currentY) / 2;

	ctx.moveTo(prevX, prevY);
	// ctx.lineTo(currentX, currentY);
	ctx.quadraticCurveTo(centerX, centerY, currentX, currentY);
	ctx.stroke();

	prevX = currentX;
	prevY = currentY;
}


// 擦除函数
const erase = (e) => {
	const currentX = e.clientX - canvasRect.value.left;
	const currentY = e.clientY - canvasRect.value.top;


	eraseX.value = currentX - penSize.value / 2
	eraseY.value = currentY - penSize.value / 2

	if (!isDrawing) return;

	ctx.clearRect(eraseX.value, eraseY.value, penSize.value, penSize.value);
};

// 鼠标抬起事件处理函数
const stopDrawing = () => {
	isDrawing = false;
};

// 清空画布
const clearCanvas = () => {
	ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
}

// 导出绘制内容为图片的函数
const exportDrawing = () => {
	// 获取绘制内容的边界矩形
	const { left, top, width, height } = getDrawingBounds();

	// 创建一个新的Canvas，大小为绘制内容的边界矩形大小
	const exportCanvas = document.createElement('canvas');
	exportCanvas.width = width;
	exportCanvas.height = height;
	const exportCtx = exportCanvas.getContext('2d');

	// 将原Canvas中的绘制内容复制到新的Canvas中
	exportCtx.drawImage(canvas.value, left, top, width, height, 0, 0, width, height);

	// 将新Canvas转换为图片数据（这里以PNG格式为例）
	const dataURL = exportCanvas.toDataURL('image/png');

	// 创建一个临时的 <a> 标签，用于下载图片
	const a = document.createElement('a');
	a.href = dataURL;
	a.download = `drawing-${Date.now()}.png`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};

// 获取绘制内容边界矩形的函数
const getDrawingBounds = () => {
	const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height);
	const pixels = imageData.data;
	let minX = canvas.value.width;
	let minY = canvas.value.height;
	let maxX = 0;
	let maxY = 0;

	for (let i = 0; i < pixels.length; i += 4) {
		if (pixels[i + 3] > 0) { // 只考虑透明度不为0的像素
			const x = (i / 4) % canvas.value.width;
			const y = Math.floor((i / 4) / canvas.value.width);

			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (x > maxX) maxX = x;
			if (y > maxY) maxY = y;
		}
	}

	return {
		left: minX,
		top: minY,
		width: maxX - minX + 1,
		height: maxY - minY + 1
	};
};
</script>

<template>
	<div>
		<div class="relative w-350 h-180 mx-auto overflow-hidden border-1 border-solid border-#ccc">
			<canvas id="canvas" class="bg-transparent relative z-1" ref="canvas" width="1400" height="720"></canvas>
			<div v-show="isShowPen" class="erase bg-#00000040 border border-#00000080 border-solid absolute z-0"
				ref="eraseRef" :class="isDraw ? 'rounded-full' : ''" :style="{
					width: `${penSize}px`,
					height: `${penSize}px`,
					left: `${eraseX}px`,
					top: `${eraseY}px`,
				}"></div>
		</div>

		<div class="w-350 mx-auto mt-10">
			<n-grid x-gap="32" y-gap="24" :cols="12">
				<n-gi class="flex-left" :span="3">
					<span class="pr-4">画笔颜色</span>
					<n-color-picker class="flex-1" v-model:value="penColor"></n-color-picker>
				</n-gi>
				<n-gi class="flex-left" :span="4">
					<span class="pr-4">画笔粗细</span>
					<n-slider class="flex-1" :min="1" :max="20" v-model:value="penSize"></n-slider>
				</n-gi>
				<n-gi class="flex-left" :span="2">
					<span>橡皮擦</span>
					<n-switch class="mx-2" v-model:value="isDraw"></n-switch>
					<span>画笔</span>
				</n-gi>
				<n-gi class="flex-left" :span="1">
					<n-button class="w-full" type="warning" @click="clearCanvas">
						清除
					</n-button>
				</n-gi>
				<n-gi class="flex-left" :span="2">
					<n-button class="w-full" type="info" @click="exportDrawing">
						导出
					</n-button>
				</n-gi>

			</n-grid>
		</div>
	</div>
</template>

<style scoped lang="less">
#canvas {
	will-change: transform;
}

.flex-left {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}
</style>