const { Jimp } = require("jimp");

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

// 图片路径
const imageUrl = "../assets/images/test.jpg"; // 替换为你的图片路径
const shadowColor = "rgba(0, 0, 0, 0.6)"; // 阴影颜色
const text = "Nikon ℤ 30"; // 底部文字
const len = "24-70mm f/2.8";
const borderHeight = 60;
const tBorder = 20;
const xBorder = 20;
const borderRadius = 20;

let imgWidth = 600;
let imgHeight = 600;

const img = new Image();
img.src = imageUrl;

img.onload = () => {
  // 设置canvas大小
  imgWidth = 600;
  imgHeight = (600 * img.height) / img.width;

  canvas.width = imgWidth + xBorder * 2;
  canvas.height = imgHeight + borderHeight;

  // 绘制高斯模糊背景
  drawBlurredBackground(img);

  // 绘制主图
  drawMainImage(img);

  // 绘制底部文字
  drawText();

  // 导出为图片
  const dataURL = canvas.toDataURL("image/png");
  console.log(dataURL);
  Jimp.read(dataURL).then((image) => {
    image.write("../assets/images/test-image.png");
  });
  // const link = document.createElement("a");
  // link.download = "image.png";
  // link.href = dataURL;
  // link.click();
  // link.remove();
};

function drawBlurredBackground(image) {
  // 创建一个离屏canvas用于高斯模糊
  const offscreenCanvas = document.createElement("canvas");
  const offscreenCtx = offscreenCanvas.getContext("2d");
  offscreenCanvas.width = canvas.width;
  offscreenCanvas.height = canvas.height;

  offscreenCtx.drawImage(
    image,
    0,
    0,
    offscreenCanvas.width,
    offscreenCanvas.height
  );

  // 应用高斯模糊
  offscreenCtx.filter = "blur(20px)";
  offscreenCtx.drawImage(offscreenCanvas, 0, 0);

  // 将模糊的背景绘制到主canvas上
  ctx.drawImage(
    offscreenCanvas,
    -offscreenCanvas.width * 0.25,
    -offscreenCanvas.height * 0.25,
    offscreenCanvas.width * 1.5,
    offscreenCanvas.height * 1.5
  );
  // 导出为图片
  // const dataURL = canvas.toDataURL("image/png");
  // const link = document.createElement("a");
  // link.download = "image.png";
  // link.href = dataURL;
  // link.click();
  // link.remove();
}

function drawMainImage(image) {
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // 绘制投影
  ctx.beginPath();
  ctx.moveTo(xBorder + borderRadius, tBorder);
  ctx.arcTo(
    xBorder + imgWidth,
    tBorder,
    xBorder + imgWidth,
    tBorder + borderRadius,
    borderRadius
  );
  ctx.arcTo(
    xBorder + imgWidth,
    tBorder + imgHeight,
    xBorder + imgWidth - borderRadius,
    tBorder + imgHeight,
    borderRadius
  );
  ctx.arcTo(
    xBorder,
    tBorder + imgHeight,
    xBorder,
    tBorder + imgHeight - borderRadius,
    borderRadius
  );
  ctx.arcTo(xBorder, tBorder, xBorder + borderRadius, tBorder, borderRadius);
  ctx.closePath();
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fill();

  ctx.save(); // 保存当前状态

  // 主图圆角裁切
  ctx.beginPath();
  ctx.moveTo(xBorder + borderRadius, tBorder);
  ctx.arcTo(
    xBorder + imgWidth,
    tBorder,
    xBorder + imgWidth,
    tBorder + borderRadius,
    borderRadius
  );
  ctx.arcTo(
    xBorder + imgWidth,
    tBorder + imgHeight,
    xBorder + imgWidth - borderRadius,
    tBorder + imgHeight,
    borderRadius
  );
  ctx.arcTo(
    xBorder,
    tBorder + imgHeight,
    xBorder,
    tBorder + imgHeight - borderRadius,
    borderRadius
  );
  ctx.arcTo(xBorder, tBorder, xBorder + borderRadius, tBorder, borderRadius);
  ctx.closePath();
  ctx.clip();

  // 重新绘制图片，这次应用圆角裁切
  ctx.drawImage(image, xBorder, tBorder, imgWidth, imgHeight);

  // 恢复之前的绘图状态
  ctx.restore();

  // 清除阴影
  ctx.shadowColor = "transparent";
}

function drawText() {
  ctx.fillStyle = "#FFFFFF"; // 文字颜色
  ctx.textAlign = "center";
  ctx.font = "16px Arial Bold"; // 字体大小
  ctx.fillText(text, canvas.width / 2, canvas.height - 30 + 10); // 底部中心绘制文字
  ctx.textAlign = "left";
  ctx.font = "12px Arial Bold"; // 字体大小
  ctx.fillText(len, xBorder, canvas.height - 30 + 8);
}
