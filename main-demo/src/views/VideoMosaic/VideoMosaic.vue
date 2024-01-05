<script setup>
import video from "@/assets/video/ningbo.mp4";
import MosaicDom from "./component/MosaicDom.vue";
</script>
<template>
  <div class="video-mosaic w-full h-full overflow-hidden">
    <div class="video-box w-200 mx-auto aspect-video">
      <video class="video w-full h-full" :src="video" controls></video>
      <mosaic-dom />
    </div>
  </div>
</template>
