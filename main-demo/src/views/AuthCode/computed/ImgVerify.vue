<script setup>
const emits = defineEmits(["setImgCode"]);

const verify = ref(null);
const state = reactive({
  pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
  width: 120,
  height: 40,
  imgCode: "",
});

// 点击图片重新绘制
const handleDraw = () => {
  state.imgCode = draw();
};

// 随机数
const randomNum = (min, max) => {
  return parseInt(Math.random() * (max - min) + min);
};
// 随机颜色
const randomColor = (min, max) => {
  const r = randomNum(min, max);
  const g = randomNum(min, max);
  const b = randomNum(min, max);
  return `rgb(${r},${g},${b})`;
};

// 绘制图片
const draw = () => {
  const ctx = verify.value.getContext("2d");
  ctx.fillStyle = randomColor(180, 230);
  ctx.fillRect(0, 0, state.width, state.height);
  let imgCode = "";
  for (let i = 0; i < 4; i++) {
    const text = state.pool[randomNum(0, state.pool.length)];
    imgCode += text;
    const fontSize = randomNum(20, 40);
    const deg = randomNum(-45, 45);
    ctx.font = fontSize + "px Simhei";
    ctx.textBaseline = "top";
    ctx.fillStyle = randomColor(80, 150);
    ctx.save();
    ctx.translate(30 * i + 15, 15);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillText(text, -15 + 5, -15);
    ctx.restore();
  }
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo(randomNum(0, state.width), randomNum(0, state.height));
    ctx.lineTo(randomNum(0, state.width), randomNum(0, state.height));
    ctx.strokeStyle = randomColor(180, 230);
    ctx.closePath();
    ctx.stroke();
  }
  for (let i = 0; i < 100; i++) {
    ctx.beginPath();
    ctx.arc(
      randomNum(0, state.width),
      randomNum(0, state.height),
      randomNum(1, 3),
      0,
      2 * Math.PI
    );
    ctx.closePath();
    ctx.fillStyle = randomColor(100, 200);
    ctx.fill();
  }
  emits("setImgCode", imgCode);
  return imgCode;
};

onMounted(() => {
  // 初始化绘制图片验证码
  state.imgCode = draw();
});
</script>
<template>
  <div class="img-verify w-30 h-10 cursor-pointer overflow-hidden">
    <canvas
      ref="verify"
      :width="width"
      :height="height"
      @click="handleDraw"
    ></canvas>
  </div>
</template>
