<script setup>
import {
  Play,
  Pause,
  PlayBackOutline,
  PlayForwardOutline,
  ScanOutline,
} from "@vicons/ionicons5";
import { computed, nextTick, onMounted, watch } from "vue";
import reviewVideoStore from "@/store/modules/reviewVideo.js";

const videoUrl = computed(() => reviewVideoStore().getVideoData().url);
const currentTime = computed(() => reviewVideoStore().getCurrentTime()); // 当前时间

const mainVideo = ref(null); // video
const playStatus = ref(false); // 播放状态
const play = computed(() => reviewVideoStore().getPlayStatus()); // 获取全局播放状态
// 播放与暂停
const playToPause = () => {
  playStatus.value = !playStatus.value;
  if (playStatus.value) {
    mainVideo.value.play();
  } else {
    mainVideo.value.pause();
  }
};
// 前进/后退5s
const backToForward = (type) => {
  if (type == 1) {
    mainVideo.value.currentTime += 15;
  } else {
    mainVideo.value.currentTime -= 15;
  }
  setCurrentTime();
};

// 全屏
const fullScreen = () => {
  mainVideo.value.requestFullscreen();
};

// 设置当前时间
const setCurrentTime = () => {
  reviewVideoStore().setCurrentTime(mainVideo.value?.currentTime);
};

let timerGabbing = null; // 当前视频播放状态下的时间跟踪定时器
let currentStatus = ""; // 当前视频播放状态
// 监听时间，更改视频事件
watch(
  () => play.value,
  () => {
    if (play.value === "pause") {
      // 保留当前视频播放状态
      currentStatus = mainVideo.value.paused;
      timerGabbing = setInterval(() => {
        mainVideo.value.currentTime = currentTime.value;
      }, 16);
      mainVideo.value.pause();
    } else if (play.value === "play") {
      clearInterval(timerGabbing);
      if (currentStatus) {
        mainVideo.value.pause();
      } else {
        mainVideo.value.play();
      }
    }
  }
);

let timerPlay = null;
onMounted(() => {
  nextTick(() => {
    // 监听视频播放时间改变
    mainVideo.value.addEventListener("play", () => {
      timerPlay = setInterval(() => {
        setCurrentTime();
      }, 16);
      playStatus.value = true;
    });
    mainVideo.value.addEventListener("pause", () => {
      clearInterval(timerPlay);
      timerPlay = null;
      playStatus.value = false;
    });
  });
});

// 倍速选择
const options = [
  {
    label: "0.25X",
    key: "0.25",
  },
  {
    label: "0.5X",
    key: "0.5",
  },
  {
    label: "0.75X",
    key: "0.75",
  },
  {
    label: "1X",
    key: "1",
  },
  {
    label: "1.5X",
    key: "1.5",
  },
  {
    label: "2X",
    key: "2",
  },
];
let thisSpeed = ref(1); // 当前播放的倍速
const handleSelect = (key) => {
  thisSpeed.value = key;
  mainVideo.value.playbackRate = key;
};
</script>

<template>
  <div class="video_view">
    <div class="video_view_box">
      <div class="video">
        <video :src="videoUrl" ref="mainVideo" v-show="videoUrl"></video>
        <n-spin size="large" stroke="#fff" v-show="!videoUrl">
          <template #description>
            <span style="color: #fff">视频加载中...</span>
          </template>
        </n-spin>
      </div>
      <div class="button_list" style="position: relative">
        <n-icon class="backout" @click="backToForward(0)"
          ><PlayBackOutline
        /></n-icon>
        <n-icon class="play" v-if="!playStatus" @click="playToPause"
          ><Play
        /></n-icon>
        <n-icon class="pause" v-if="playStatus" @click="playToPause"
          ><Pause
        /></n-icon>
        <n-icon class="forward" @click="backToForward(1)"
          ><PlayForwardOutline
        /></n-icon>
        <n-icon class="scan" @click="fullScreen"><ScanOutline /></n-icon>
        <n-dropdown
          trigger="hover"
          placement="bottom-start"
          :options="options"
          @select="handleSelect"
        >
          <span class="speed">{{ thisSpeed }}x</span>
        </n-dropdown>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.video_view {
  width: 100%;
  height: 100%;
  padding: 50px;

  .video_view_box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    .video {
      display: block;
      height: 100%;
      width: 100%;
      max-width: 1020px;
      max-height: 576px;
      min-width: 200px;
      margin: auto;
      video {
        display: block;
        height: 100%;
        width: 100%;
        max-width: 1020px;
        min-width: 200px;
        margin: auto;
      }
      .n-spin-body {
        width: 100%;
        height: 100%;
        max-width: 1020px;
        min-width: 200px;
        margin: auto;
        background: #111;
      }
    }
    .button_list {
      width: 100%;
      max-width: 1020px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 10px auto;
      .n-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #555;
        background: #eee;
        cursor: pointer;
        transition: 0.2s;
        &:hover {
          color: #111;
        }
        &.backout,
        &.forward {
          font-size: 22px;
          width: 38px;
          height: 24px;
          border-radius: 12px;
        }
        &.play,
        &.pause {
          font-size: 22px;
          width: 36px;
          height: 36px;
          margin: 0 15px;
          border-radius: 50%;
        }
        &.scan {
          position: absolute;
          right: 16px;
          font-size: 16px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
      }
      .speed {
        font-size: 12px;
        min-width: 38px;
        height: 24px;
        border-radius: 12px;
        margin-left: 10px;
        padding: 0 5px;
        color: #999;
        background: #eee;
        text-align: center;
        line-height: 24px;
        cursor: pointer;
        transition: 0.2s;
        &:hover {
          color: #111;
        }
      }
    }
  }
}
</style>
