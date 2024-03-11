<script setup>
import video from "@/assets/video/ningbo.mp4";
import ShotDrawing from "./component/ShotDrawing.vue";
import { ref } from "vue";

const videoRef = ref(null);
const isShow = ref(false);
</script>
<template>
  <div class="canvas-drawing w-full h-full overflow-y-auto p-10">
    <video
      class="block w-60% mx-auto"
      ref="videoRef"
      :src="video"
      controls
    ></video>
    <div class="flex justify-center mt-4">
      <n-button
        class="w-40 mx-4"
        strong
        secondary
        type="tertiary"
        @click="isShow = false"
      >
        关闭截图
      </n-button>
      <n-button class="w-40 mx-4" type="info" @click="isShow = true">
        截图
      </n-button>
    </div>

    <div class="my-10 w-60% min-w-180 mx-auto" v-if="isShow">
      <shot-drawing :videoElement="videoRef"></shot-drawing>
    </div>
    <div>
      <!-- 截图展示 -->
    </div>
  </div>
</template>
