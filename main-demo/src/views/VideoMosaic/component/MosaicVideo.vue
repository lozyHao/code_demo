<script setup>
import { ref, onMounted, nextTick, computed, onBeforeUnmount, onUnmounted } from 'vue'

const props = defineProps({
  currentTime: {
    type: Number,
    default: 0
  },
  videoElement: {
    type: Object,
    default: null
  },
  imgElement: {
    type: Object,
    default: null
  },
  width: {
    type: String,
    default: 100,
  },
  height: {
    type: String,
    default: 100,
  },
  size: {
    type: String,
    default: 'medium', // 20-small、30-medium、50-large
  },
})
const width = computed(() => props.width)
const height = computed(() => props.height)
const size = computed(() => {
  switch (props.size) {
    case 'small':
      return 15;
    case 'medium':
      return 20;
    case 'large':
      return 30;
    default:
      return 20;
  }
})
const videoElement = computed(() => props.videoElement)
const currentTime = computed(() => props.currentTime)
const imgUrl = ref('')
const canvas = ref(null)
const ctx = ref(null)

const videoFrameCaputure = () => {
  ctx.value = canvas.value.getContext('2d')
  canvas.value.width = width.value
  canvas.value.height = height.value
  const video = videoElement.value
  ctx.value.drawImage(video, 0, 0, width.value, height.value)
  const data = canvas.value.toDataURL()
  const img = dataURLtoFile(data, 'consultation' + Date.now() + '.png')
  // 生成图片标签 DOM 对象
  let currentImage = new Image();
  const reader = new FileReader();
  reader.onload = () => {
    currentImage.src = reader.result;
    imgUrl.value = reader.result
  };
  reader.readAsDataURL(img);
  currentImage.width = width.value
  currentImage.height = height.value
  // 图片打码
  draw(currentImage);
}
const dataURLtoFile = (dataurl, filename) => {
  const base64Code = dataurl.split(',') // 获取到base64编码
  const base64Str = window.atob(base64Code[1]) // 将base64编码转为字符串
  let base64Len = base64Str.length
  const u8arr = new Uint8Array(base64Len) // 创建初始化为0的，包含length个元素的无符号整型数组
  while (base64Len--) {
    u8arr[base64Len] = base64Str.charCodeAt(base64Len)
  }
  return new File([u8arr], filename, {
    type: 'image/png'
  })
}

// 初始化
const init = async () => {
  await nextTick()
  try {
    videoFrameCaputure()
  } catch (error) {
    console.log('出错了：：：', error)
  }
}


//画图
const draw = (img) => {
  ctx.value.drawImage(img, 0, 0);
  var imgData = ctx.value.getImageData(0, 0, img.width, img.height);
  mskDraw(imgData);
  ctx.value.putImageData(imgData, 0, 0)
}
//马赛克
const mskDraw = (imgData) => {
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  var currentSize = size.value;
  for (var i = 0; i < imgData.width / currentSize; i++) {
    for (var j = 0; j < imgData.height / currentSize; j++) {
      var color = getPxInfo(imgData, Math.floor(i * currentSize + Math.random() * currentSize), Math.floor(j * currentSize + Math.random() * currentSize))
      for (var a = 0; a < currentSize; a++) {
        for (var b = 0; b < currentSize; b++) {
          setPxInfo(imgData, i * currentSize + a, j * currentSize + b, color);
        }
      }
    }
  }
}
//获取像素点
const getPxInfo = (imgData, x, y) => {
  let width = imgData.width
  var color = [];
  color[0] = imgData.data[(y * width + x) * 4];
  color[1] = imgData.data[(y * width + x) * 4 + 1];
  color[2] = imgData.data[(y * width + x) * 4 + 2];
  color[3] = imgData.data[(y * width + x) * 4 + 3];
  return color;
}
//修改像素点
const setPxInfo = (imgData, x, y, color) => {
  var width = imgData.width;
  imgData.data[(y * width + x) * 4] = color[0];
  imgData.data[(y * width + x) * 4 + 1] = color[1];
  imgData.data[(y * width + x) * 4 + 2] = color[2];
  imgData.data[(y * width + x) * 4 + 3] = color[3];
}


// watch(() => currentTime.value, async (newVal) => {
//   await init()
// })
const timer = setInterval(async () => {
  await init()
}, 16)

onUnmounted(() => {
  clearInterval(timer)
})

onMounted(async () => {
  await init()
})
</script>

<template>
  <div class="mosaic-videoflex flex-wrap justify-center">
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>