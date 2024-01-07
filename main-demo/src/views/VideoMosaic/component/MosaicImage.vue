<script setup>
import { computed, onMounted, ref, watch } from "vue"
const props = defineProps({
    size: {
        type: String,
        default: 'medium', // 20-small、30-medium、50-large
    },
    image: {
        type: String,
        default: '', // 图片地址
    }
});
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
const image = computed(() => props.image)

const canvas = ref(null)
const ctx = ref(null)

const init = () => {
    if (canvas.value?.getContext) {
        ctx.value = canvas.value?.getContext("2d");
        var img = new Image();
        img.src = image.value;
        img.onload = function () {
            canvas.value.width = img.width;
            canvas.value.height = img.height;
            draw(img);
        }
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

watch(() => image.value, () => {
    init();
})

onMounted(() => {
    init();
})
</script>

<template>
    <canvas ref="canvas" id="myCanvas" class="block mx-auto"></canvas>
</template>
