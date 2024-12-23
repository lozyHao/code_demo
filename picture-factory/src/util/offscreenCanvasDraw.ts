/** canvas 绘制相关 */
class OffscreenCanvasDraw {
	canvas: OffscreenCanvas;
	ctx: OffscreenCanvasRenderingContext2D;
	width: number = 400;
	height: number = 600;
	fontRotate: number = 0.2

	constructor(width: number, height: number, borderRotate: number = 0.15) {
		this.canvas = new OffscreenCanvas(256, 256);
		this.ctx = this.canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;

		this.width = width;
		this.height = height * (1 + borderRotate);
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		if (!this.ctx) {
			throw new Error("获取画布上下文失败");
		}
	}

	/**
	 * 清屏
	 */
	clear() {
		this.ctx?.clearRect(0, 0, this.width, this.height);
	}

	/**
	 * 图片获取到DataURL
	 * @param image 文件
	 */

	async getImageURL(
		image: File | string
	): Promise<{ width: number; height: number; url: string }> {
		const img = new Image();
		img.src = typeof image === "string" ? image : URL.createObjectURL(image as File);
		return await new Promise((resolve) => {
			img.onload = () => {
				resolve({
					width: img.width,
					height: img.height,
					url: img.src,
				});
			};
		});
	}

	/**
	 * 绘制纯色背景
	 * @param color 颜色
	 * @param width 宽度
	 * @param height 高度
	 * @param x x坐标
	 * @param y y坐标
	 */
	drawColorBackground(
		color: string = "#ffffff",
		x: number = 0,
		y: number = 0,
		width: number = this.width,
		height: number = this.height
	) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x, y, width, height);
	}

	/**
	 * 绘制文字
	 * @param text 文字
	 * @param font 字体
	 * @param x x坐标
	 * @param y y坐标
	 * @param color 颜色
	 * @param fontSize 字体大小
	 * @param fontWeight 字体粗细
	 * @param textAlign 对齐方式
	 */

	async drawText(
		text: string,
		font: string,
		x: number,
		y: number,
		color: string,
		fontSize: number,
		fontWeight: string,
		textAlign: CanvasTextAlign
	) {
		this.ctx.save();
		console.log(text, x, y, color, fontSize, fontWeight, textAlign);
		this.ctx.fillStyle = color;
		this.ctx.font = `italic ${fontWeight} ${fontSize}px ${font}`;
		this.ctx.textAlign = textAlign;
		this.ctx.textBaseline = "middle";

		console.log("绘制文本宽度/高度", this.ctx.measureText(text).width, fontSize * 1.2)
		this.ctx.fillText(text, x, y);

		this.ctx.restore();

		const blob = await this.canvas.convertToBlob()
		// blob 转 地址
		return URL.createObjectURL(blob)
	}

	/**
	 * 绘制图片
	 * @param image 文件
	 * @param width 图片宽度
	 * @param height 图片高度
	 * @param x x坐标
	 * @param y y坐标
	 */

	async drawImage(
		image: string,
		width: number = this.width,
		height: number = this.height,
		x: number = 0,
		y: number = 0,
	) {
		const img = new Image();
		img.src = image;
		return await new Promise((resolve) => {
			img.onload = () => {
				const bx = x;
				const by = y;
				this.ctx.drawImage(img, bx, by, width, height);

				// resolve(this.canvas.toDataURL());
			};
		});
	}

	/**
	 * 绘制高斯模糊图片，返回背景的DataURL
	 * @param image 文件
	 * @param width 图片宽度
	 * @param height 图片高度
	 * @param blur 模糊度
	 */
	async drawBlurImage(
		image: ImageBitmap,
		width: number = 400,
		height: number = 600,
		blur: number = 20
	) {
		return await new Promise(async (resolve) => {
			this.ctx.filter = `blur(${blur}px)`;
			this.ctx.drawImage(
				image,
				width * -0.3,
				height * -0.3,
				width * 1.6,
				height * 1.6
			);
			this.ctx.filter = "none";
			const blob = await this.canvas.convertToBlob()
			// blob 转 地址
			resolve(URL.createObjectURL(blob))
		});
	}

	/**
	 * 绘制主图
	 * @param image 文件
	 * @param x x坐标
	 * @param y y坐标
	 * @param width 图片宽度
	 * @param height 图片高度
	 * @param shadow 阴影大小
	 */
	async drawMainImage(
		image: ImageBitmap,
		width: number,
		height: number,
		rotate: number = 0.9,
		shadow: number = 100,
		rounded: number = Math.min(width * rotate, height * rotate) * 0.1
	) {
		return await new Promise(async (resolve) => {
			const bx = (width * (1 - rotate)) / 2;
			const by = (height * (1 - rotate)) / 2;
			const imgWidth = width * rotate;
			const imgHeight = height * rotate;
			// const rounded = Math.min(imgWidth, imgHeight) * 0.1

			this.ctx.save();

			// 绘制投影
			this.ctx.shadowColor = "#333333";
			this.ctx.shadowBlur = shadow;
			this.ctx.shadowOffsetX = 0;
			this.ctx.shadowOffsetY = 0;

			this.ctx.beginPath();
			this.ctx.moveTo(bx + rounded, by);
			this.ctx.arcTo(bx + imgWidth, by, bx + imgWidth, by + rounded, rounded);
			this.ctx.arcTo(
				bx + imgWidth,
				by + imgHeight,
				bx + imgWidth - rounded,
				by + imgHeight,
				rounded
			);
			this.ctx.arcTo(
				bx,
				by + imgHeight,
				bx,
				by + imgHeight - rounded,
				rounded
			);
			this.ctx.arcTo(bx, by, bx + rounded, by, rounded);
			this.ctx.closePath();
			this.ctx.fillStyle = "rgb(0, 0, 0)";
			this.ctx.fill();

			if (rounded) {

				// 主图圆角裁切
				this.ctx.beginPath();
				this.ctx.moveTo(bx + rounded, by);
				this.ctx.arcTo(
					bx + imgWidth,
					by,
					bx + imgWidth,
					by + rounded,
					rounded
				);
				this.ctx.arcTo(
					bx + imgWidth,
					by + imgHeight,
					bx + imgWidth - rounded,
					by + imgHeight,
					rounded
				);
				this.ctx.arcTo(
					bx,
					by + imgHeight,
					bx,
					by + imgHeight - rounded,
					rounded
				);
				this.ctx.arcTo(bx, by, bx + rounded, by, rounded);
				this.ctx.closePath();
				this.ctx.clip();

				this.ctx.drawImage(image, bx, by, width * rotate, height * rotate);

				// 恢复之前的绘图状态
				this.ctx.restore();
			}

			const blob = await this.canvas.convertToBlob()
			// blob 转 地址
			resolve(URL.createObjectURL(blob))
		});
	}

	/**
	 * 获取Canvas的DataURL（Base64格式）
	 * @returns string
	 */
	getDataURLBase64() {
		// return this.canvas.toDataURL("image/png");
	}

	/**
	 * 获取Canvas的Blob数据
	 * @param type 图片类型
	 * @param quality 质量（对于JPEG等格式）
	 * @returns Promise<Blob>
	 */
	async getBlobData(
		type: string = "image/png",
		quality: number = 1
	): Promise<Blob> {
		return new Promise((resolve) => {
			// this.canvas.toBlob(
			// 	(blob) => {
			// 		resolve(blob as Blob);
			// 	},
			// 	type,
			// 	quality
			// );
		});
	}

	/**
	 * 获取Canvas的DataURL（用于<img>标签）
	 * @returns string
	 */
	getDataURL() {
		// return this.canvas.toDataURL();
	}
}

export default OffscreenCanvasDraw;
