<script setup>
import { onMounted } from "vue";
import SquareProgress from "./component/SquareProgress.vue";
const progress = ref(40);

const timer = ref(null);
const loading = () => {
  timer.value = setInterval(() => {
    progress.value += Math.floor(Math.random() * 5 + 2);
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer.value);
      timer.value = null;
    }
  }, 1000);
};

onMounted(() => {
  loading();
});
</script>
<template>
  <div class="canvas-case bg-#000000">
    <h3 class="text-center mt-10 text-#fff">方形进度条</h3>
    <div class="w-40% h-40% mx-auto">
      <square-progress :progress="progress" :lineWidth="10"></square-progress>
    </div>
  </div>
</template>
