<script setup>
import video from "@/assets/video/ningbo.mp4";
import treeScenery01 from "@/assets/img/tree_scenery01.jpg";
import treeScenery02 from "@/assets/img/tree_scenery02.jpg";
import treeScenery03 from "@/assets/img/tree_scenery03.jpg";
import MosaicDom from "./component/MosaicDom.vue";
import MosaicImage from "./component/MosaicImage.vue";
import MosaicVideo from "./component/MosaicVideo.vue";
import { computed, onMounted, watch } from "vue";

const list = [treeScenery01, treeScenery02, treeScenery03];
const currentImageIndex = ref(0);

// 视频播放获取每一帧
const videoRef = ref(null);
const isMosaic = ref(false);
const currentTime = ref(0);

const startMosaic = () => {
  isMosaic.value = !isMosaic.value;
};

onMounted(() => {
  videoRef.value?.addEventListener("timeupdate", (event) => {
    currentTime.value = videoRef.value?.currentTime;
  });
});
</script>
<template>
  <div class="video-mosaic w-full h-full overflow-y-scroll">
    <div class="video-box w-200 mx-auto aspect-video relative">
      <video class="video w-full h-full" :src="video" controls></video>
      <mosaic-dom
        class="absolute top-0"
        width="800"
        height="380"
        size="large"
      />
    </div>
    <div class="h-10"></div>
    <div class="image-box">
      <img
        :src="list[currentImageIndex]"
        class="block mx-auto"
        style="width: 280px; height: 210px"
      />
      <mosaic-image size="small" :image="list[currentImageIndex]" />
      <div class="w-full my-10 flex justify-center">
        <n-button
          type="info"
          @click="
            currentImageIndex < list.length - 1
              ? currentImageIndex++
              : (currentImageIndex = 0)
          "
        >
          下一个
        </n-button>
      </div>
    </div>
    <div class="h-10"></div>
    <div class="video-box max-w-200 mx-auto aspect-video relative">
      <video
        ref="videoRef"
        class="video w-full h-full"
        :src="video"
        controls
        crossorigin="anonymous"
        @timeupdate="onTimeUpdate"
      ></video>
    </div>
    <n-button type="info" @click="startMosaic" class="block mx-auto my-10">{{
      isMosaic ? "关闭打码" : "开启打码"
    }}</n-button>
    <div
      v-if="isMosaic"
      class="video-box max-w-200 mx-auto aspect-video relative"
    >
      <mosaic-video
        size="small"
        :video-element="videoRef"
        :currentTime="currentTime"
        class="flex justify-center"
      />
    </div>
    <div class="h-10"></div>
  </div>
</template>
