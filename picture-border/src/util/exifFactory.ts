import * as Exifreader from "exifreader";

interface ExifData {
  [key: string]: any;
}

class ExifFactory {
  // 获取图片的exif信息
  static async load(file: File) {
    const exif = await Exifreader.load(file);
    return exif;
  }

  // exif解析需要的数据
  static getExifData(exif: any): ExifData[] {
    // TODO: 数据解析
    return exif;
  }
}

export default ExifFactory;
