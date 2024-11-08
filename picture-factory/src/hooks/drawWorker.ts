// worker.ts
self.onmessage = async (event) => {
	const { img, width, height, callbackId } = event.data;
	console.log(img, width, height)
	const result = await draw(img, width, height);
	postMessage({ result, callbackId });
};

const draw = async (img: ImageBitmap, width: number, height: number) => {
	const OffscreenCanvasDraw = await import('../util/offscreenCanvasDraw.ts')
	const canvasDraw = new OffscreenCanvasDraw.default(width, height);
	// 绘制背景图
	await canvasDraw.drawBlurImage(img, width, height)
	// 绘制主图
	await canvasDraw.drawMainImage(img, width, height)

	// 绘制文字
	await canvasDraw.drawText("Nikon", 'Arial', width * 0.05, height * 1.1, "#ffffff", height * 0.06, 'bold', 'left')
	const imageDataURL = await canvasDraw.drawText("135mm f/1.8 200s ISO200", 'Arial', width * 0.95, height * 1.1, "#ffffff", height * 0.04, 'normal', 'right')

	// 添加到页面
	return imageDataURL
}