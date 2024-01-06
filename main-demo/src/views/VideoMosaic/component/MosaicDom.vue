<script setup>
import { computed, onMounted, ref } from "vue"
const props = defineProps({
  theme: {
    type: String,
    default: "light", // light/dart
  },
  width: {
    type: String,
    default: 100,
  },
  height: {
    type: String,
    default: 100,
  },
  opacity: {
    type: Number,
    default: 0.2,
  },
  size: {
    type: String,
    default: 'medium', // 20-small、30-medium、50-large
  }
});
const width = computed(() => props.width)
const height = computed(() => props.height)
const opacity = computed(() => props.opacity)
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
const backgroundColor = computed(() => props.theme === 'light' ? `rgba(255,255,255,${opacity.value})` : `rgba(0,0,0,${opacity.value})`)

const colorList = ["#ffffff40", "#00000040"];
const filterList = ["blur(1px)", "blur(2px)", "blur(4px)"];
const canvas = ref(null)
const ctx = ref(null)

const init = () => {
  // 获取画布和上下文
  canvas.value = document.getElementById("myCanvas");
  ctx.value = canvas.value.getContext("2d");
  const px = size.value;
  const wNumber = Math.floor(canvas.value.width / px) + 1;
  const hNumber = Math.floor(canvas.value.height / px) + 1;
  draw(wNumber, hNumber);
}

// 绘制
function draw(wNumber, hNumber) {
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
  for (let i = 0; i < wNumber; i++) {
    for (let j = 0; j < hNumber; j++) {
      if (i % 2 === 0) {
        ctx.value.fillStyle = colorList[j % 2 === 0 ? 1 : 0];
      } else {
        ctx.value.fillStyle = colorList[j % 2 === 0 ? 0 : 1];
      }
      ctx.value.filter = filterList[Math.floor(Math.random() * 3)];
      ctx.value.fillRect(i * size.value, j * size.value, size.value, size.value);
    }
  }

}
onMounted(() => {
  init();
})
</script>

<template>
  <div class="mosaic-dom" :style="{ width: width + 'px', height: height + 'px' }">
    <canvas id="myCanvas" :width="width" :height="height" :style="{ backgroundColor: backgroundColor, }"></canvas>
  </div>
</template>

<style scoped lang="less">
#myCanvas {
  display: block;
  backdrop-filter: blur(4px);
}
</style>
