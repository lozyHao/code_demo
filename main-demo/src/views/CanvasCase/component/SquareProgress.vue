<script setup>
import { computed, nextTick, onMounted, watch } from "vue";

const props = defineProps({
  lineWidth: {
    type: Number,
    default: 1,
  },
  color: {
    type: String,
    default: "#fff",
  },
  textColor: {
    type: String,
    default: "#fff",
  },
  progress: {
    type: Number,
    default: 0,
  },
});

const lineWidth = computed(() => props.lineWidth);
const color = computed(() => props.color);
const textColor = computed(() => props.textColor);
const progress = computed(() => props.progress);

const canvasBox = ref(null);
const canvas = ref(null);
const width = ref(0);
const height = ref(0);

const dotList = ref([{ x: 0, y: 0 }]);

const init = () => {
  const canvasBoxDom = canvasBox.value;
  width.value = canvasBoxDom?.clientWidth ?? 0;
  height.value = canvasBoxDom?.clientHeight ?? 0;
  canvas.value.width = width.value;
  canvas.value.height = height.value;
  drawCanvas();
};

const addDot = async () => {
  const currentProgress = progress.value;
  const allProgressLong = 2 * width.value + 2 * height.value;
  const currentProgressLong = (allProgressLong * currentProgress) / 100;
  if (currentProgress <= 25) {
    dotList.value.push({
      x: currentProgressLong,
      y: 0,
    });
  } else if (currentProgress <= 50) {
    if (dotList.value[dotList.value.length - 1].x < width.value) {
      dotList.value.push({
        x: width.value,
        y: 0,
      });
    }
    dotList.value.push({
      x: width.value,
      y: currentProgressLong - width.value,
    });
  } else if (currentProgress <= 75) {
    const isRT = dotList.value.findIndex(
      (e) => e.x === width.value && e.y === 0
    );
    if (isRT === -1) {
      dotList.value.push({
        x: width.value,
        y: 0,
      });
    }
    if (dotList.value[dotList.value.length - 1].y < height.value) {
      dotList.value.push({
        x: width.value,
        y: height.value,
      });
    }
    dotList.value.push({
      x: allProgressLong - currentProgressLong - height.value,
      y: height.value,
    });
  } else if (currentProgress <= 100) {
    const isRT = dotList.value.findIndex(
      (e) => e.x === width.value && e.y === 0
    );
    if (isRT === -1) {
      dotList.value.push({
        x: width.value,
        y: 0,
      });
    }
    const isRB = dotList.value.findIndex(
      (e) => e.x === width.value && e.y === 0
    );
    if (isRB === -1) {
      dotList.value.push({
        x: width.value,
        y: height.value,
      });
    }
    if (dotList.value[dotList.value.length - 1].x > 0) {
      dotList.value.push({
        x: 0,
        y: height.value,
      });
    }
    dotList.value.push({
      x: 0,
      y: allProgressLong - currentProgressLong,
    });
  }
  return;
};

const drawCanvas = () => {
  let ctx = canvas.value.getContext("2d");
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(dotList.value[0].x, dotList.value[0].y);
  if (dotList.value.length > 1) {
    for (let i = 1; i < dotList.value.length; i++) {
      ctx.lineTo(dotList.value[i].x, dotList.value[i].y);
    }
  }
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = lineWidth.value;
  ctx.stroke();
};

watch(
  () => progress.value,
  async (newVal, oldVal) => {
    // 添加点
    await addDot();
    // 绘制
    drawCanvas();
  }
);

onMounted(() => {
  nextTick(async () => {
    init();
    // 添加点
    await addDot();
    // 绘制
    drawCanvas();
  });
});
</script>

<template>
  <div class="square-progress w-full h-full" ref="canvasBox">
    <canvas class="canvas bg-#000000" ref="canvas"></canvas>
  </div>
</template>
