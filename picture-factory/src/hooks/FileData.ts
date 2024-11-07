
import ExifFactory from "../util/exifFactory"
class FileData {
	name: string
	size: number
	type: string
	file: File
	pre: string
	exif: any

	constructor(file: File) {
		this.file = file
		this.name = file.name
		this.size = file.size
		this.type = file.type
		this.exif = new ExifFactory(file)
		this.pre = URL.createObjectURL(file)
	}
}

export default FileData