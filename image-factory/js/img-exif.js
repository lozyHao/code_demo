const path = require("path");
const {
  Jimp,
  loadFont,
  HorizontalAlign,
  VerticalAlign,
  BlendMode,
} = require("jimp");
const ExifReader = require("exifreader");
const { SANS_32_WHITE } = require("jimp/fonts");

async function readExif(image) {
  const exif = await Jimp.read(image);
  console.log("1--", exif._exif);

  return exif._exif;
}

async function writeExif(image) {
  let exif = await Jimp.read(image);
  const result = await exif
    .resize({ w: 100, h: 200 })
    .write("../assets/images/test-end.jpg");
  return result;
}

// 图片上增加exif文字信息(ISO，拍摄时间)
async function addExif(path) {
  const image = await Jimp.read(path);
  const image2 = await Jimp.read(path);
  console.log("2--", image._exif);
  // 创建一个带有边框的新图像
  const borderSize = 60;
  const h = image.bitmap.height;
  const w = image.bitmap.width;
  let borderedImage = null;
  try {
    borderedImage = new Jimp({ width: w, height: h, color: "#000000" });
  } catch (err) {
    console.log("创建-", err);
  }

  image.blur(40); // 高斯模糊 建议 30-60

  // 将原图像复合到新图像上（带边框）
  image2.scale(0.9);
  borderedImage.composite(image, 0, 0);
  borderedImage.composite(image2, w * 0.05, h * 0.05);

  const cameraMake = image._exif.tags.LensMake;
  const cameraModel = image._exif.tags.LensModel;
  const iso = image._exif.tags.ISO;
  const infoText = `厂商:${cameraMake} \n 镜头：${cameraModel}\n ISO:${iso}`;
  const font = await loadFont(SANS_32_WHITE);
  borderedImage.print({
    font,
    x: 10, // 文字的 x 位置
    y: h * 0.9 + borderSize * 2 + 10, // 文字的 y 位置
    text: {
      text: infoText,
      alignmentX: HorizontalAlign.CENTER,
      alignmentY: VerticalAlign.TOP,
    },
    maxWidth: w + borderSize * 2 - 20,
  });
  //   console.log("添加文字后：:", borderedImage);
  // 第五步: 保存最终的图像
  const outputImagePath = "../assets/images/test-end.jpg";
  console.log("正在保存带边框的图像至:", outputImagePath);
  await borderedImage.write(outputImagePath);

  console.log("图像已保存，带有边框和 EXIF 信息，保存路径为:", outputImagePath);
}

// ExifReader
const getExif = async (path) => {
  const tags = await ExifReader.load(path);
  console.log("getExif", tags);
  console.log(tags.LensSpecification);
};

const img = "../assets/images/test.jpg";
// readExif(img);
// writeExif(img);
addExif(img);
// getExif(img);
