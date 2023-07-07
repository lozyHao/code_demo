import { defineStore } from "pinia";
import { ref } from "vue";

const reviewVideoStore = defineStore(
  "reviewVideo",
  () => {
    const videoData = ref({}); // 视频播放地址
    const duration = ref(0); // 总时长
    const currentTime = ref(0); // 当前时间
    const playStatus = ref(""); // 播放状态
    /**
     * Set
     */
    const setVideoData = (data) => {
      videoData.value = data;
    };
    const setDuration = (time) => {
      duration.value = time;
    };
    const setCurrentTime = (time) => {
      currentTime.value = time;
    };
    const setPlayStatus = (status) => {
      playStatus.value = status;
    };
    /**
     * Get
     */
    const getVideoData = () => {
      return videoData.value;
    };
    const getDuration = () => {
      return duration.value;
    };
    const getCurrentTime = () => {
      return currentTime.value;
    };
    const getPlayStatus = () => {
      return playStatus.value;
    };

    return {
      setVideoData,
      setDuration,
      setCurrentTime,
      setPlayStatus,
      getVideoData,
      getDuration,
      getCurrentTime,
      getPlayStatus,
    };
  },
  {
    persist: true,
  }
);

export default reviewVideoStore;
