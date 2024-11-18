// worker.ts
self.onmessage = async (event) => {
	const { font, fontBuffer, callbackId } = event.data;
	const result = await draw(font, fontBuffer);
	postMessage({ result, callbackId });
};

const draw = async (font: string, fontBuffer: string) => {
	const canvas = new OffscreenCanvas(500, 500);
	const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
	console.log(fontBuffer)
	console.log(font)
	const f = new FontFace('F', `url(${fontBuffer})`);
	return await new Promise((resolve) => {
		f.load().then(async (result) => {
			console.log(result);
			ctx.font = `20px ${font}`;
			ctx.font = `20px F`;
			ctx.textAlign = 'center';
			ctx.fillStyle = "#000000";
			ctx.fillText("Hello World", canvas.width / 2, canvas.height / 2);

			const blob = await canvas.convertToBlob({ type: 'image/png' });
			// return URL.createObjectURL(blob);

			resolve(URL.createObjectURL(blob));
		})
	})
}