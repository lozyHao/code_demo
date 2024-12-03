<script setup lang="ts">
import testImg from "@/assets/images/test.jpg";

import { nextTick, onMounted, ref } from 'vue';

import Konva from 'konva';

let width = window.innerWidth;
let height = window.innerHeight - 40;
let GUIDELINE_OFFSET = 5;

const stage = ref<Konva.Stage | null>(null)
const layer = ref<Konva.Layer | null>(null)
const tr = ref<Konva.Transformer | null>(null)

const init = () => {
	stage.value = new Konva.Stage({
		container: 'container',
		width: width,
		height: height,
	});

	layer.value = new Konva.Layer();
	stage.value.add(layer.value as Konva.Layer);

	// 生成随机矩形
	for (let i = 0; i < 5; i++) {
		layer.value.add(
			new Konva.Rect({
				x: Math.random() * stage.value!.width(),
				y: Math.random() * stage.value!.height(),
				width: 50 + Math.random() * 50,
				height: 50 + Math.random() * 50,
				fill: Konva.Util.getRandomColor(),
				draggable: true,
				name: 'object',
			})
		);
	}

	// 绘制主图
	drawMainImage()

	// 添加 transformer缩放/旋转
	tr.value = new Konva.Transformer({
		keepRatio: true,
		rotationSnaps: [0, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345],
		rotateAnchorCursor: 'grab',
		flipEnabled: false,
		anchorFill: 'rgb(0, 161, 255)',
		boundBoxFunc: (oldBox, newBox) => {
			if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
				return oldBox;
			}
			return newBox;
		},
	});
	layer.value.add(tr.value as Konva.Transformer);

	// 监听拖拽
	layer.value.on('dragmove', (e) => {
		if (!layer.value) return


		document.body.style.cursor = 'grabbing';
		// 清除屏幕上之前的所有 行
		layer.value.find('.guid-line').forEach((l) => l.destroy());

		// 找到可能的断裂线
		let lineGuideStops = getLineGuideStops(e.target as Konva.Shape);

		// 查找当前对象的断点
		let itemBounds = getObjectSnappingEdges(e.target as Konva.Shape);

		// 现在找到我们可以捕捉当前对象的位置
		let guides = getGuides(lineGuideStops, itemBounds);

		// 什么都不做
		if (!guides.length) {
			return;
		}

		// 绘制参考线
		drawGuides(guides);

		let absPos = e.target.absolutePosition();
		// 现在强制物体位置
		guides.forEach((lg) => {
			switch (lg.orientation) {
				case 'V': {
					absPos.x = lg.lineGuide + lg.offset;
					break;
				}
				case 'H': {
					absPos.y = lg.lineGuide + lg.offset;
					break;
				}
			}
		});
		e.target.absolutePosition(absPos);
	});

	layer.value.on('dragend', (e) => {
		if (!layer.value) return

		document.body.style.cursor = 'grab';
		// 清除屏幕上之前的所有 行
		layer.value.find('.guid-line').forEach((l) => l.destroy());
	});

	// 鼠标点击，缩放
	stage.value.on('click', function (e) {
		if (!stage.value) return

		if (e.target._id === stage.value._id) {
			// 点击对象外部，取消缩放
			tr.value?.nodes([]);
			return
		}

		// 点击对象，缩放
		tr.value?.nodes([e.target as Konva.Shape]);
		e.target.moveToTop();
		tr.value?.moveToTop();
	})

	// 鼠标悬浮，边框样式
	layer.value.on('mouseover', function (e) {
		let shape: Konva.Shape = e.target as Konva.Shape;
		document.body.style.cursor = 'grab';
		// 添加边框
		shape.stroke('rgb(0, 161, 255)');
		shape.strokeWidth(2);
		shape.strokeEnabled(true);
	});
	layer.value.on('mouseout', function (e) {
		let shape: Konva.Shape = e.target as Konva.Shape;
		document.body.style.cursor = 'default';
		// 移除边框
		shape.strokeWidth(0);
		shape.strokeEnabled(false);
	});
}


// 生成主图
const drawMainImage = () => {
	if (!layer.value) return

	// 生成图片
	const image = new Image();
	image.src = testImg;
	const mainImage = new Konva.Image({
		x: (width - 600) / 2,
		y: (height - 400) / 2,
		image: image,
		width: 600,
		height: 400,
		draggable: true,
		name: 'image',
	})
	layer.value.add(mainImage);

	mainImage.on('transform', () => {
		// reset scale on transform
		mainImage.setAttrs({
			scaleX: 1,
			scaleY: 1,
			width: mainImage.width() * mainImage.scaleX(),
			height: mainImage.height() * mainImage.scaleY(),
		});
		applyCrop(mainImage.getAttr('lastCropUsed'));
	});
}

function getCrop(image: any, size: { width: number; height: number }, clipPosition = 'center-middle') {
	const width = size.width;
	const height = size.height;
	const aspectRatio = width / height;

	let newWidth;
	let newHeight;

	const imageRatio = image.width / image.height;

	if (aspectRatio >= imageRatio) {
		newWidth = image.width;
		newHeight = image.width / aspectRatio;
	} else {
		newWidth = image.height * aspectRatio;
		newHeight = image.height;
	}

	let x = 0;
	let y = 0;
	if (clipPosition === 'left-top') {
		x = 0;
		y = 0;
	} else if (clipPosition === 'left-middle') {
		x = 0;
		y = (image.height - newHeight) / 2;
	} else if (clipPosition === 'left-bottom') {
		x = 0;
		y = image.height - newHeight;
	} else if (clipPosition === 'center-top') {
		x = (image.width - newWidth) / 2;
		y = 0;
	} else if (clipPosition === 'center-middle') {
		x = (image.width - newWidth) / 2;
		y = (image.height - newHeight) / 2;
	} else if (clipPosition === 'center-bottom') {
		x = (image.width - newWidth) / 2;
		y = image.height - newHeight;
	} else if (clipPosition === 'right-top') {
		x = image.width - newWidth;
		y = 0;
	} else if (clipPosition === 'right-middle') {
		x = image.width - newWidth;
		y = (image.height - newHeight) / 2;
	} else if (clipPosition === 'right-bottom') {
		x = image.width - newWidth;
		y = image.height - newHeight;
	} else if (clipPosition === 'scale') {
		x = 0;
		y = 0;
		newWidth = width;
		newHeight = height;
	} else {
		console.error(
			new Error('Unknown clip position property - ' + clipPosition)
		);
	}

	return {
		cropX: x,
		cropY: y,
		cropWidth: newWidth,
		cropHeight: newHeight,
	};
}

function applyCrop(pos: any) {
	if (!layer.value) return

	const img = layer.value.findOne('.image');
	img?.setAttr('lastCropUsed', pos);
	const crop = getCrop(
		img?.image(),
		{ width: img?.width() || 0, height: img?.height() || 0 },
		pos
	);
	img?.setAttrs(crop);
}

onMounted(() => {
	nextTick(() => {
		init()
	})
})


// 我们可以在哪里捕捉我们的物体？
const getLineGuideStops = (skipShape: Konva.Shape) => {
	if (!stage.value) return

	// 我们可以跳上台来。值的边界和stage.value的中心
	let vertical: any = [0, stage.value.width() / 2, stage.value.width()];
	let horizontal: any = [0, stage.value.height() / 2, stage.value.height()];

	// 我们在画布上截取每个对象的边缘和中心
	stage.value.find('.object').forEach((guideItem) => {
		if (guideItem._id === skipShape._id) {
			return;
		}
		let box = guideItem.getClientRect();

		// 我们可以捕捉其他图形的所有边缘
		vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
		horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
	});
	return {
		vertical: vertical.flat(),
		horizontal: horizontal.flat(),
	};
}

// 对象的哪些点会触发捕捉？
// 它可以只是对象的中心
// 但我们将启用所有边缘和中心
const getObjectSnappingEdges = (node: Konva.Shape) => {
	let box = node.getClientRect();
	let absPos = node.absolutePosition();

	return {
		vertical: [
			{
				guide: Math.round(box.x),
				offset: Math.round(absPos.x - box.x),
				snap: 'start',
			},
			{
				guide: Math.round(box.x + box.width / 2),
				offset: Math.round(absPos.x - box.x - box.width / 2),
				snap: 'center',
			},
			{
				guide: Math.round(box.x + box.width),
				offset: Math.round(absPos.x - box.x - box.width),
				snap: 'end',
			},
		],
		horizontal: [
			{
				guide: Math.round(box.y),
				offset: Math.round(absPos.y - box.y),
				snap: 'start',
			},
			{
				guide: Math.round(box.y + box.height / 2),
				offset: Math.round(absPos.y - box.y - box.height / 2),
				snap: 'center',
			},
			{
				guide: Math.round(box.y + box.height),
				offset: Math.round(absPos.y - box.y - box.height),
				snap: 'end',
			},
		],
	};
}

// 找到所有的 参考线
const getGuides = (lineGuideStops: any, itemBounds: any) => {
	let resultV: any = [];
	let resultH: any = [];

	lineGuideStops.vertical.forEach((lineGuide: number) => {
		itemBounds.vertical.forEach((itemBound: any) => {
			let diff = Math.abs(lineGuide - itemBound.guide);
			if (diff < GUIDELINE_OFFSET) {
				resultV.push({
					lineGuide: lineGuide,
					diff: diff,
					snap: itemBound.snap,
					offset: itemBound.offset,
				});
			}
		});
	});

	lineGuideStops.horizontal.forEach((lineGuide: any) => {
		itemBounds.horizontal.forEach((itemBound: any) => {
			let diff = Math.abs(lineGuide - itemBound.guide);
			if (diff < GUIDELINE_OFFSET) {
				resultH.push({
					lineGuide: lineGuide,
					diff: diff,
					snap: itemBound.snap,
					offset: itemBound.offset,
				});
			}
		});
	});

	let guides = [];

	let minV = resultV.sort((a: any, b: any) => a.diff - b.diff)[0];
	let minH = resultH.sort((a: any, b: any) => a.diff - b.diff)[0];
	if (minV) {
		guides.push({
			lineGuide: minV.lineGuide,
			offset: minV.offset,
			orientation: 'V',
			snap: minV.snap,
		});
	}
	if (minH) {
		guides.push({
			lineGuide: minH.lineGuide,
			offset: minH.offset,
			orientation: 'H',
			snap: minH.snap,
		});
	}
	return guides;
}

// 绘制参考线
const drawGuides = (guides: any) => {
	guides.forEach((lg: any) => {
		if (lg.orientation === 'H') {
			let line = new Konva.Line({
				points: [-6000, 0, 6000, 0],
				stroke: 'rgb(0, 161, 255)',
				strokeWidth: 1,
				name: 'guid-line',
				dash: [4, 6],
			});
			layer.value?.add(line);
			line.absolutePosition({
				x: 0,
				y: lg.lineGuide,
			});
		} else if (lg.orientation === 'V') {
			let line = new Konva.Line({
				points: [0, -6000, 0, 6000],
				stroke: 'rgb(0, 161, 255)',
				strokeWidth: 1,
				name: 'guid-line',
				dash: [4, 6],
			});
			layer.value?.add(line);
			line.absolutePosition({
				x: lg.lineGuide,
				y: 0,
			});
		}
	});
}
</script>

<template>
	<div class="home w-full flex flex-col relative overflow-hidden bg-#eee" style="height: calc(100vh - 40px);">
		<div id="container"></div>
	</div>
</template>