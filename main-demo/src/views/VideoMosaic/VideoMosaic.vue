<script setup>
import video from "@/assets/video/ningbo.mp4";
import treeScenery01 from "@/assets/img/tree_scenery01.jpg";
import treeScenery02 from "@/assets/img/tree_scenery02.jpg";
import treeScenery03 from "@/assets/img/tree_scenery03.jpg";
import MosaicDom from "./component/MosaicDom.vue";
import MosaicImage from "./component/MosaicImage.vue";

const list = [
  treeScenery01,
  treeScenery02,
  treeScenery03
]
const currentImageIndex = ref(0)


// 视频播放获取每一帧
// const current = VideoImage = ref()

</script>
<template>
  <div class="video-mosaic w-full h-full overflow-y-scroll">
    <div class="video-box w-200 mx-auto aspect-video relative">
      <video class="video w-full h-full" :src="video" controls></video>
      <mosaic-dom class="absolute top-0" width="800" height="380" size="large" />
    </div>
    <div class="h-10"></div>
    <div class="image-box">
      <img :src="list[currentImageIndex]" class="block mx-auto" style="width:280px; height: 210px;">
      <mosaic-image size="small" :image="list[currentImageIndex]" />
      <div class="w-full my-10 flex justify-center">
        <n-button type="info" @click="currentImageIndex < list.length - 1 ? currentImageIndex++ : currentImageIndex = 0">
          下一个
        </n-button>
      </div>
    </div>
    <div class="h-10"></div>
    <!-- <div class="video-box w-200 mx-auto aspect-video relative">
      <video class="video w-full h-full" :src="video" controls></video>
      <mosaic-image size="small" :image="list[currentImageIndex]" />
    </div>
    <div class="h-10"></div> -->
  </div>
</template>
