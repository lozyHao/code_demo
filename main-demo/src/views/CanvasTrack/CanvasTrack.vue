<script setup>
import VideoView from "./components/VideoView.vue";
import TrackLine from "./components/TrackLine.vue";
import MarkList from "./components/MarkList.vue";

import videoItem from "@/assets/video/ningbo.mp4";
import reviewVideoStore from "@/store/modules/reviewVideo.js";
import { onMounted, ref } from "vue";

// 获取视频数据设置属性
const getVideo = () => {
  reviewVideoStore().setVideoData({ url: videoItem });
  reviewVideoStore().setDuration(34199);
};

// 拖拽
const isDivider = ref(false);
const dividerLineCross = ref(null);
const minHeight = ref(46);
const maxHeihgt = ref(348);
const onmousedown = (event) => {
  isDivider.value = true;
  // 绑定鼠标移动事件
  document.addEventListener("mousemove", onMouseMove);
  // 绑定鼠标抬起事件
  document.addEventListener("mouseup", onMouseUp);
};
const onMouseMove = (event) => {
  if (isDivider.value) {
    const leftBox = document.querySelector(".left_box");
    const boxTopVideo = document.querySelector(".box_top_video");
    const boxBottomTrack = document.querySelector(".box_bottom_track");
    const videoHeight = event.layerY;
    const trackeHeight = leftBox.clientHeight - event.layerY;
    if (trackeHeight >= minHeight.value && trackeHeight < maxHeihgt.value) {
      boxTopVideo.style.height = videoHeight + "px";
      boxBottomTrack.style.height =
        (trackeHeight >= maxHeihgt.value
          ? maxHeihgt.value
          : trackeHeight <= minHeight.value
          ? minHeight.value
          : trackeHeight) + "px";
    }
  }
};
const onMouseUp = (event) => {
  isDivider.value = false;
};

window.addEventListener("resize", (event) => {
  const leftBox = document.querySelector(".left_box");
  const boxTopVideo = document.querySelector(".box_top_video");
  const boxBottomTrack = document.querySelector(".box_bottom_track");
  boxTopVideo.style.height =
    leftBox.clientHeight - boxBottomTrack.clientHeight + "px";
});

// 接收折叠事件，更改高度
const getFold = (item) => {
  const leftBox = document.querySelector(".left_box");
  const boxTopVideo = document.querySelector(".box_top_video");
  const boxBottomTrack = document.querySelector(".box_bottom_track");
  boxBottomTrack.style.height = item + "px";
  boxTopVideo.style.height = leftBox.clientHeight - item + "px";
  maxHeihgt.value = item;
};

onMounted(() => {
  getVideo();
});
</script>

<template>
  <div class="canvas_track">
    <div class="left_box">
      <!-- 左侧 -->
      <div class="box_top_video">
        <video-view></video-view>
      </div>
      <div
        class="divider_line_cross"
        ref="dividerLineCross"
        @mousedown="(event) => onmousedown(event)"
      ></div>
      <div class="box_bottom_track">
        <track-line @sendFold="getFold"></track-line>
      </div>
    </div>
    <div class="divider_line_vertical"></div>
    <!-- 右侧复盘标注 -->
    <div class="right_mark">
      <mark-list></mark-list>
    </div>
  </div>
</template>

<style lang="less">
.canvas_track {
  width: 100%;
  height: 100%;
  min-height: 460px;
  display: flex;
  .left_box {
    width: calc(100% - 360px);
    height: 100%;
    .box_top_video {
      width: 100%;
      height: calc(100% - 200px);
    }
    .divider_line_cross {
      box-sizing: inherit;
      height: 2px;
      background: #ddd;
      cursor: ns-resize;
      transition: 0.2s;
      &:hover {
        background: #1773eb;
      }
    }
    .box_bottom_track {
      height: 200px;
    }
  }
  .right_mark {
    width: 360px;
    border-left: 2px solid #ddd;
  }
}
</style>
