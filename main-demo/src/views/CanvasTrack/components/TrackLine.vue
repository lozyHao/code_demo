<script setup>
import {
  ReturnUpBackOutline,
  ReturnUpForward,
  Contract,
  HelpCircleSharp,
} from "@vicons/ionicons5";
import reviewVideoStore from "@/store/modules/reviewVideo.js";
import { computed, onMounted, watch } from "vue";

const emits = defineEmits(["sendFold", "setPlay", "setPause"]);

const duration = computed(() => reviewVideoStore().getDuration()); // 视频时长
const currentTime = computed(() => reviewVideoStore().getCurrentTime()); // 当前时间
let videoCanvas = ref(null); // canvas盒子
let ctx = ref(null); // canvas画板
let canvasContentWidth = ref(0); // canvas内容宽度
let gridNum = ref(0); // 绘制的格数
let pxPerGrid = ref(0); // 每格宽度
let gridToTime = ref(0); // 每格代表时间
let ratio = ref(1); // 缩放比
let zoomPX = ref(0); // 当前像素/每秒
let minPX = 0.03; // 最小像素/每秒
let maxPX = 300; // 最大像素/每秒

// 放大、缩小状态
let isMagnify = ref(false); // 放大
let isLessen = ref(true); // 缩小

// 左右滚动条
let scrollbarWidth = ref("100%");
// 左右移动距离
let moveLeft = ref(0);

// 绘制canvas
const initCanvas = () => {
  // canvas宽度
  const width = videoCanvas.value?.clientWidth;
  if (width >= canvasContentWidth.value || canvasContentWidth.value <= 0) {
    canvasContentWidth.value = width;
  }
  // 计算每一秒对应的像素
  const pxToSeconds = (canvasContentWidth.value * ratio.value) / duration.value;
  zoomPX.value = pxToSeconds <= minPX ? minPX : pxToSeconds;
  const { gridTime, grid, gridWidth } = countNumberOfScales();
  gridToTime.value = gridTime; // 每格时间
  gridNum.value = grid; // 格数
  pxPerGrid.value = gridWidth; // 每格宽度
  videoCanvas.value.width = width;
  if (pxToSeconds <= minPX) {
    canvasContentWidth.value = gridWidth * grid;
  } else {
    zoomPX.value = pxToSeconds;
  }
  videoCanvas.value.height = 32;
  ctx.value = videoCanvas.value.getContext("2d");
  // 生成刻度
  generatingScale();

  // 重绘轨道长度
  initTrackLength();
  // 重绘进度条
  initProgressBar();
  // 重新计算竖轴位置
  initGrabbing();
};

// 初始化轨道长度
const initTrackLength = () => {
  let TrackItemsContentDom = document.querySelector(".track_items_content");
  let trackItemContentFoldDom = document.querySelector(
    ".track_item_content_fold"
  );
  let TrackItemContentDom = document.querySelectorAll(".track_item_content");
  TrackItemsContentDom.scrollLeft = moveLeft.value;
  trackItemContentFoldDom.style.width =
    canvasContentWidth.value * ratio.value + 100 + "px";
  TrackItemContentDom.forEach((item) => {
    item.style.width = canvasContentWidth.value * ratio.value + 100 + "px";
  });
};

// 初始化进度条
const initProgressBar = () => {
  scrollbarWidth.value =
    videoCanvas.value?.clientWidth /
      ((canvasContentWidth.value + +200) * ratio.value) >
      0.1
      ? (videoCanvas.value?.clientWidth /
        ((canvasContentWidth.value + +200) * ratio.value)) *
      100
      : 1;
  const webkitScrollbarThumbDom = document.querySelector(
    ".webkit_scrollbar_thumb"
  );
  webkitScrollbarThumbDom.style.left = moveLeft.value;
};

// 竖直线处理
// 竖直线位置定位
let grabbingLeft = ref(160);
let grabbingStatus = ref(true);
const initGrabbing = () => {
  const left = currentTime.value * zoomPX.value - moveLeft.value;
  if (left < -8 || left > videoCanvas.value.clientWidth) {
    grabbingStatus.value = false;
  } else {
    grabbingStatus.value = true;
  }
  grabbingLeft.value =
    currentTime.value * zoomPX.value - moveLeft.value + 160 + "px";
};

// 绘制刻度线
const drawLine = (x, y1, y2, lineWidth = 1, color = "#555") => {
  ctx.value.beginPath();
  ctx.value.strokeStyle = color;
  ctx.value.lineWidth = lineWidth;
  ctx.value.moveTo(x, y1);
  ctx.value.lineTo(x, y2);
  ctx.value.stroke();
};
// 产生时间线刻度
const generatingScale = () => {
  for (let i = 0; i <= gridNum.value + 1; i++) {
    const timeText = graduationTimeText(i);
    const x = i * pxPerGrid.value - moveLeft.value;
    const y = 4;
    ctx.value.fillStyle = "rgb(0,0,0,0.6)";
    ctx.value.fillText(timeText, x + 2, y + 6);
    // 绘制有时间标识的主刻度
    drawLine(x, 0, 20);
    // 绘制小刻度
    const x1 = x + 0.5 * pxPerGrid.value;
    drawLine(x1, 2, 14);
  }
};

// 判断刻度格数
const countNumberOfScales = () => {
  let grid = 0;
  if (zoomPX.value < 1 / 18) {
    grid = 3600;
  } else if (zoomPX.value >= 1 / 18 && zoomPX.value <= 1 / 9) {
    grid = 1800;
  } else if (zoomPX.value >= 1 / 9 && zoomPX.value <= 1 / 6) {
    grid = 1200;
  } else if (zoomPX.value >= 1 / 6 && zoomPX.value <= 1 / 4) {
    grid = 600;
  } else if (zoomPX.value >= 1 / 4 && zoomPX.value <= 1 / 2) {
    grid = 300;
  } else if (zoomPX.value >= 1 / 2 && zoomPX.value <= 1) {
    grid = 200;
  } else if (zoomPX.value >= 1 && zoomPX.value <= 2) {
    grid = 100;
  } else if (zoomPX.value >= 2 && zoomPX.value <= 4) {
    grid = 90;
  } else if (zoomPX.value >= 4 && zoomPX.value <= 6) {
    grid = 60;
  } else if (zoomPX.value >= 6 && zoomPX.value <= 8) {
    grid = 50;
  } else if (zoomPX.value >= 8 && zoomPX.value <= 10) {
    grid = 40;
  } else if (zoomPX.value >= 10 && zoomPX.value <= 12) {
    grid = 30;
  } else if (zoomPX.value >= 12 && zoomPX.value <= 14) {
    grid = 20;
  } else if (zoomPX.value >= 14 && zoomPX.value <= 20) {
    grid = 10;
  } else if (zoomPX.value >= 20 && zoomPX.value <= 30) {
    grid = 5;
  } else if (zoomPX.value >= 30 && zoomPX.value <= 50) {
    grid = 4;
  } else if (zoomPX.value >= 50 && zoomPX.value <= 80) {
    grid = 2;
  } else if (zoomPX.value >= 80) {
    grid = 1;
  }
  return {
    gridTime: grid,
    grid: parseInt(duration.value / grid),
    gridWidth: grid * zoomPX.value,
  };
};
// 判断视频时长
const countVideoTime = () => {
  let videoTimeZoom = 0;
  if (duration.value <= 3600) {
    videoTimeZoom = 1;
  } else if (duration.value > 3600 && duration.value <= 3600 * 5) {
    videoTimeZoom = 10;
  } else if (duration.value > 3600 * 5 && duration.value <= 3600 * 10) {
    videoTimeZoom = 20;
  } else {
    videoTimeZoom = 30;
  }
  return videoTimeZoom;
};

// 缩放
// 放大
const magnifyXZoom = () => {
  moveLeft.value = 0;
  historyLeft.value = 0;
  if (zoomPX.value >= maxPX) {
    isMagnify.value = true;
    return;
  } else {
    isLessen.value = false;
    if (zoomPX.value >= 1 && zoomPX.value < 20) {
      ratio.value += 2 * countVideoTime();
    } else if (zoomPX.value >= 20 && zoomPX.value < 60) {
      ratio.value += 3 * countVideoTime();
    } else if (zoomPX.value >= 60 && zoomPX.value < 150) {
      ratio.value += 10 * countVideoTime();
    } else if (zoomPX.value >= 150) {
      ratio.value += 15 * countVideoTime();
    } else {
      ratio.value += 1;
    }
    initCanvas();
  }
};
// 缩小
const lessenXZoom = () => {
  moveLeft.value = 0;
  historyLeft.value = 0;
  if (ratio.value <= 1) {
    ratio.value = 1;
    isLessen.value = true;
  } else {
    isMagnify.value = false;
    if (zoomPX.value > 2 && zoomPX.value <= 20 + 3 * countVideoTime()) {
      ratio.value -= 2 * countVideoTime();
    } else if (
      zoomPX.value > 20 + 3 * countVideoTime() &&
      zoomPX.value <= 60 + 10 * countVideoTime()
    ) {
      ratio.value -= 3 * countVideoTime();
    } else if (
      zoomPX.value >= 60 &&
      zoomPX.value < 150 + 15 * countVideoTime()
    ) {
      ratio.value -= 10 * countVideoTime();
    } else if (zoomPX.value >= 150 + 15 * countVideoTime()) {
      ratio.value -= 15 * countVideoTime();
    } else {
      ratio.value -= 1;
    }
    if (ratio.value <= 1) {
      ratio.value = 1;
      isLessen.value = true;
    }
  }
  initCanvas();
};
// 恢复
const resetXZoom = () => {
  ratio.value = 1;
  moveLeft.value = 0;
  historyLeft.value = 0;
  isMagnify.value = false;
  isLessen.value = true;
  initCanvas();
};
// 处理 Ctrl + 鼠标滚轮事件
const handleWheelCtrl = (event) => {
  event.preventDefault();
  if (event.deltaY < 0) {
    magnifyXZoom();
  } else {
    lessenXZoom();
  }
};
// 折叠手术日志
let logFoldStatus = ref(false);
const clickFold = () => {
  logFoldStatus.value = !logFoldStatus.value;
  let trackItemsTitle = document.querySelector(".track_items_title");
  let trackTtemsContent = document.querySelector(".track_items_content");
  if (logFoldStatus.value) {
    emits("sendFold", 252);
    trackItemsTitle.style.height = "156px";
    trackTtemsContent.style.height = "156px";
  } else {
    emits("sendFold", 348);
    trackItemsTitle.style.height = "253px";
    trackTtemsContent.style.height = "253px";
  }
};

// 监听时间，更改竖直轴位置
watch(currentTime, () => {
  initGrabbing();
});

const setPlayStatus = (item) => {
  reviewVideoStore().setPlayStatus(item);
};

// 拖动滚动条
let isScrollBar = ref(false); // 移动状态
let clientX = ref(0); // 鼠标位置
let scrollXLeft = ref(0); // 当前水平移动距离
let historyLeft = ref(0); // 鼠标松开，保留移动位置历史
const dragScrollBar = (event) => {
  isScrollBar.value = true;
  clientX.value = event.clientX;
  // 绑定鼠标移动事件
  document.addEventListener("mousemove", onMouseMoveScrollBar);
  // 绑定鼠标抬起事件
  document.addEventListener("mouseup", onMouseUpScrollBar);
};
const onMouseMoveScrollBar = (event) => {
  if (isScrollBar.value) {
    const trackItemContent = document.querySelector(".track_item_content"); // 轨道长度
    const scrollbarTrackDom = document.querySelector(".scrollbar_track"); // 滚动条滚动槽
    const webkitScrollbarThumbDom = document.querySelector(
      ".webkit_scrollbar_thumb"
    ); // 滚动条拖动条
    scrollXLeft.value = event.clientX - clientX.value + historyLeft.value;
    if (
      scrollXLeft.value >= 0 &&
      scrollXLeft.value <=
      scrollbarTrackDom.clientWidth - webkitScrollbarThumbDom.clientWidth
    ) {
      moveLeft.value =
        (scrollXLeft.value *
          (trackItemContent.clientWidth - videoCanvas.value.clientWidth)) /
        (scrollbarTrackDom.clientWidth - webkitScrollbarThumbDom.clientWidth);
      webkitScrollbarThumbDom.style.left = scrollXLeft.value + "px";
      initCanvas();
    }
    initGrabbing();
  }
};
const onMouseUpScrollBar = (event) => {
  isScrollBar.value = false;
  if (scrollXLeft.value > 0) {
    historyLeft.value = scrollXLeft.value;
  } else {
    historyLeft.value = 0;
  }
};

// 拖拽竖直轴
let isGrabbing = ref(false);
let historyLeftGrabbing = ref(0);
const onMousedownGrabbing = (event) => {
  isGrabbing.value = true;
  // 拖动开始，暂停视频
  setPlayStatus("pause");
  // 绑定鼠标移动事件
  document.addEventListener("mousemove", onMouseMoveGrabbing);
  // 绑定鼠标抬起事件
  document.addEventListener("mouseup", onMouseUpGrabbing);
};
const onMouseMoveGrabbing = (event) => {
  let grabbingDom = document.querySelector(".grabbing");
  let trackItemsContentDom = document.querySelector(".track_items_content");
  if (isGrabbing.value) {
    const left =
      event.clientX - trackItemsContentDom.getBoundingClientRect().left;
    if (left >= 0 && left <= videoCanvas.value.clientWidth) {
      // 更新时间
      const time = (left + trackItemsContentDom.scrollLeft) / zoomPX.value;
      reviewVideoStore().setCurrentTime(time);
    }
  }
};
const onMouseUpGrabbing = (event) => {
  isGrabbing.value = false;
  let trackItemsContentDom = document.querySelector(".track_items_content");
  historyLeftGrabbing.value =
    event.clientX - trackItemsContentDom.getBoundingClientRect().left;
  // 拖动结束，开启视频
  setPlayStatus("play");
};

window.addEventListener("resize", (event) => {
  // 重绘canvas
  initCanvas();
});
window.addEventListener("keydown", (event) => {
  event.preventDefault();
});

onMounted(() => {
  setTimeout(() => {
    // 初始化canvas
    initCanvas();
  }, 1000);
});

// 换算时间
const convertTimeText = (times) => {
  const hours = Math.floor(times / 3600);
  const minutes = Math.floor((times - hours * 3600) / 60);
  const seconds = Math.floor(times % 60);
  const formatHours = hours < 10 ? "0" + hours : hours;
  const formatMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formatSeconds = seconds < 10 ? "0" + seconds : seconds;
  return `${formatHours}:${formatMinutes}:${formatSeconds}`;
};
// 刻度时间显示
const graduationTimeText = (item) => {
  const times = item * gridToTime.value;
  const hours = Math.floor(times / 3600);
  const minutes = Math.floor((times - hours * 3600) / 60);
  const seconds = Math.floor(times % 60);
  const formatHours = hours < 10 ? "0" + hours : hours;
  const formatMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formatSeconds = seconds < 10 ? "0" + seconds : seconds;
  if (hours <= 0) {
    return `${formatMinutes}:${formatSeconds}`;
  } else {
    return `${formatHours}:${formatMinutes}:${formatSeconds}`;
  }
};
</script>

<template>
  <div class="track_line">
    <div class="track_menu">
      <div class="track_menu_item track_menu_item_record">
        <n-icon>
          <ReturnUpBackOutline />
        </n-icon>
        <n-icon>
          <ReturnUpForward />
        </n-icon>
      </div>
      <div class="track_menu_item track_menu_item_time">
        <span class="times">
          <span>
            {{ convertTimeText(currentTime) }}
          </span>
          /
          <span style="color: #777; font-weight: 300">
            {{ convertTimeText(duration) }}
          </span>
        </span>
      </div>
      <div class="track_menu_item track_menu_item_zoom">
        <n-button class="zoom_add" @click="magnifyXZoom" quaternary circle round :disabled="isMagnify">
          +
        </n-button>
        <span class="zoom_ratio">{{ ratio * 100 }}%</span>
        <n-button class="zoom_sub" @click="lessenXZoom" quaternary circle round :disabled="isLessen">
          -
        </n-button>
        <n-icon class="zoom_adaptation" @click="resetXZoom">
          <Contract />
        </n-icon>
      </div>
    </div>
    <div class="track_box">
      <!-- 移动轴 -->
      <div class="grabbing" @mousedown="onMousedownGrabbing" v-show="grabbingStatus" :style="{ left: grabbingLeft }">
        <div class="grabbing_line"></div>
        <svg id="grabbing_head" data-name="grabbing_head" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 18">
          <title>grabbing_head</title>
          <path class="cls-1"
            d="M11.72635,11.77325,6.84792,17.59939a1.09764,1.09764,0,0,1-1.69584,0L.27365,11.77325A1.18309,1.18309,0,0,1,0,11.01416V1.1597A1.14111,1.14111,0,0,1,1.12157,0h9.75686A1.14111,1.14111,0,0,1,12,1.1597v9.85446A1.18309,1.18309,0,0,1,11.72635,11.77325Z" />
        </svg>
      </div>
      <!-- canvas时间轴 -->
      <div class="track_canvas">
        <div class="track_canvas_title">
          <span>标记类型</span>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-icon>
                <HelpCircleSharp />
              </n-icon>
            </template>
            标记类型包含手术过程标注，手术日志标点
          </n-tooltip>
        </div>
        <canvas id="video_canvas" ref="videoCanvas" @wheel.ctrl="handleWheelCtrl"></canvas>
      </div>
      <!-- 轨道 -->
      <div class="track_items">
        <div class="track_items_title">
          <div class="track_item process">手术过程</div>
          <div class="track_item log" :class="!logFoldStatus ? 'log_after' : ''">
            <span @click="clickFold">-</span>
            <span>手术日志</span>
          </div>
          <div class="track_item_fold" :style="{ height: logFoldStatus ? '0' : '96px' }">
            <div class="track_item">出血</div>
            <div class="track_item">缝合/吻合</div>
            <div class="track_item">离断</div>
          </div>
          <div class="track_item customize">自定义</div>
          <div class="track_item discuss" style="background-color: #c1dcfb">
            手术讨论
          </div>
        </div>
        <div class="track_items_content" @wheel.ctrl="handleWheelCtrl">
          <div class="track_item_content process">1</div>
          <div class="track_item_content log">2</div>
          <div class="track_item_content_fold" :style="{ height: logFoldStatus ? '0' : '96px' }">
            <div class="track_item_content">3</div>
            <div class="track_item_content">4</div>
            <div class="track_item_content">5</div>
          </div>
          <div class="track_item_content customize">6</div>
          <div class="track_item_content discuss" style="background-color: #c1dcfb">
            7
          </div>
        </div>
      </div>
      <div class="scrollbar_track">
        <div v-show="scrollbarWidth < 100" class="webkit_scrollbar_thumb" :style="{ width: scrollbarWidth + '%' }"
          @mousedown="(event) => dragScrollBar(event)"></div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.track_line {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  // 轨道菜单
  .track_menu {
    width: 100%;
    height: 44px;
    border-bottom: 1px solid #ddd;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;

    .track_menu_item_record {
      display: flex;

      .n-icon {
        font-size: 22px;
        color: #777;
        cursor: pointer;
        transition: 0.2s;

        &:hover {
          color: #111;
        }

        &:nth-of-type(1) {
          margin-right: 22px;
        }
      }
    }

    .track_menu_item_time {
      flex: 1;
      font-size: 16px;
      padding: 0 24px;
      display: flex;
      justify-content: center;
    }

    .track_menu_item_zoom {
      display: flex;
      align-items: center;

      span.zoom_ratio {
        display: block;
        margin: 0 24px;
        padding: 6px 16px;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
      }

      .n-button {

        &.zoom_add,
        &.zoom_sub {
          height: 20px;
          width: 20px;
          border: 2px solid #555;
          font-size: 20px;
          color: #555;
          box-sizing: content-box;
          text-align: center;
          cursor: pointer;
          transition: 0.2s;

          &:hover {
            color: #111;
            border-color: #111;
          }

          .n-icon {
            font-size: 20px;
            color: #777;
          }
        }
      }

      .zoom_adaptation {
        width: 32px;
        height: 32px;
        background: #055ada1a;
        border-radius: 4px;
        margin-left: 16px;
        font-size: 20px;
        color: #777;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: 0.2s;

        &:hover {
          color: #111;
        }
      }
    }
  }

  .track_box {
    height: calc(100% - 44px);
    width: 100%;
    background: #eee;
    position: relative;
    overflow: hidden;

    // 移动轴
    .grabbing {
      position: absolute;
      top: 0px;
      left: 160px;
      z-index: 2;
      height: calc(100% - 12px);
      width: 12px;

      &:hover {
        cursor: grab;
      }

      .grabbing_line {
        position: absolute;
        left: 5px;
        width: 2px;
        height: 100%;
        background: #e94f4e;
        border-radius: 2px;
      }

      #grabbing_head {
        position: absolute;
        top: 0;
        width: 12px;
        height: 18px;

        .cls-1 {
          fill: #e94f4e;
        }
      }
    }

    // canvas时间轴
    .track_canvas {
      height: 32px;
      width: 100%;
      margin-bottom: 4px;
      display: flex;

      .track_canvas_title {
        height: 100%;
        width: 165px;
        background: #ebf3fa;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #555;

        .n-icon {
          color: #1b45d899;
          font-size: 20px;
          margin-left: 10px;
          cursor: pointer;
        }
      }

      #video_canvas {
        width: calc(100% - 165px);
        height: 32px;
        background: #f4f9fd;
      }
    }

    // 轨道
    .track_items {
      height: calc(100% - 50px);
      width: 100%;
      overflow-y: scroll;
      display: flex;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 100px;
        border: 1px solid transparent;
        background-clip: content-box; //内容区裁剪

        &:hover {
          border: 1px solid transparent;
          background: rgba(0, 0, 0, 0.8);
          background-clip: content-box;
        }
      }

      // 轨道标题
      .track_items_title {
        width: 165px;
        height: 252px;

        .track_item {
          width: 100%;
          height: 32px;
          display: flex;
          align-items: center;
          background: #f1f5f9;
          border-bottom: 1px solid #eee;

          &.process {
            width: 100%;
            height: 44px;
            justify-content: center;
            margin-bottom: 4px;
          }

          &.log {
            height: 44px;
            padding-left: 20px;

            span:nth-of-type(1) {
              height: 10px;
              width: 10px;
              border: 1px solid #555;
              font-size: 12px;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-right: 2px;
              position: relative;
              cursor: pointer;
              transition: 0.2s;
            }

            span:nth-of-type(2) {
              position: relative;
              padding-left: 30px;

              &::after {
                position: absolute;
                bottom: 10px;
                left: 0;
                content: "";
                height: 1px;
                width: 26px;
                border-bottom: 1px dashed #777;
              }
            }
          }

          &.log_after {
            span:nth-of-type(1) {
              &::after {
                position: absolute;
                top: 6px;
                left: 20px;
                content: "";
                height: 18px;
                width: 1px;
                border-right: 1px dashed #777;
              }
            }
          }

          &.customize,
          &.discuss {
            justify-content: center;
          }
        }

        .track_item_fold {
          background: #f1f5f9;
          overflow: hidden;
          transition: 0.2s;

          .track_item {
            padding-left: 62px;
            position: relative;

            &::before {
              position: absolute;
              top: 14px;
              left: 43px;
              content: "";
              height: 1px;
              width: 14px;
              border-bottom: 1px dashed #777;
            }

            &::after {
              position: absolute;
              top: 0;
              left: 41px;
              content: "";
              height: 32px;
              width: 1px;
              border-right: 1px dashed #777;
            }

            &:nth-last-of-type(1) {
              &::after {
                position: absolute;
                top: 0;
                left: 41px;
                content: "";
                height: 16px;
                width: 1px;
                border-right: 1px dashed #777;
              }
            }
          }
        }
      }

      // 轨道长轴内容
      .track_items_content {
        width: calc(100% - 165px);
        height: 252px;
        overflow-y: hidden;
        overflow-x: auto;
        top: 0;

        &::-webkit-scrollbar {
          display: none;
        }

        .track_item_content {
          position: relative;
          width: 100%;
          height: 32px;
          border-bottom: 1px solid #f8f8f8;
          background: #fff;

          &.process {
            height: 44px;
            margin-bottom: 4px;
          }

          &.log {
            height: 44px;
          }
        }

        .track_item_content_fold {
          overflow: hidden;
          transition: 0.2s;
        }
      }
    }

    // 滚动条
    .scrollbar_track {
      position: absolute;
      bottom: 3px;
      right: 0;
      width: calc(100% - 165px);
      height: 10px;

      .webkit_scrollbar_thumb {
        position: absolute;
        bottom: 2px;
        width: 50%;
        height: 6px;
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.5);

        &:hover {
          background: rgba(0, 0, 0, 0.8);
        }
      }
    }
  }
}
</style>
