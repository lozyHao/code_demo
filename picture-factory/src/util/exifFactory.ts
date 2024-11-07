import * as Exifreader from "exifreader";

interface ExifData {
	[key: string]: any;
}

class ExifFactory {
	exif: any
	file: File
	constructor(file: File) {
		this.exif = null
		this.file = file

		this.load(file)
	}

	// 获取图片的exif信息
	async load(file: File) {
		const exif = await Exifreader.load(file);
		this.exif = exif

		// console.log(exif)
		return exif;
	}

	// exif解析需要的数据
	getExifData(exif: any): ExifData[] {
		// TODO: 数据解析
		return exif;
	}
}

export default ExifFactory;
