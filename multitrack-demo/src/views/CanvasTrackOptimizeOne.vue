<template>
  <div class="canvas_line_optimize_one">
    <div class="video">
      <span @click="goStart">回到开始</span>
      <!-- <span @click="backTime">后退15s</span> -->
      <span @click="play">{{ playStatus ? "暂停" : "开始" }}</span>
      <!-- <span @click="forwardTime">前进15s</span> -->
      <span @click="goEnd">回到最后</span>
    </div>
    <div class="canvas_container">
      <div class="left_information">
        <div class="left_information_time">
          {{ getTimeHour(currentTime) }} / {{ getTimeHour(videoTimes) }}
        </div>
        <div class="left_information_stage">手术阶段</div>
        <div class="left_information_instrument">
          <span>器械使用</span>
          <ul>
            <li v-for="item in intrumentList" :key="item.type">
              <i :style="{ background: item.color }"></i>{{ item.name }}
            </li>
          </ul>
        </div>
      </div>
      <div
        class="right_mark"
        ref="rightMark"
        @wheel="zoomRoller"
        @mouseenter="enterRightMark"
        @mouseleave="leaveRightMark"
      >
        <div class="time_line_container" ref="timeLineContainer">
          <canvas class="timeline" ref="canvas" @click="clickTimeLine"></canvas>
        </div>
        <!-- 遮罩 -->
        <div class="mask"></div>
        <!-- 跟踪虚线 -->
        <div class="tracking_line"></div>
        <!-- 移动轴 -->
        <div class="grabbing" @mousedown="onMousedownGrabbing">
          <div class="grabbing_line"></div>
          <svg
            id="grabbing_head"
            data-name="grabbing_head"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 18"
          >
            <title>grabbing_head</title>
            <path
              class="cls-1"
              d="M11.72635,11.77325,6.84792,17.59939a1.09764,1.09764,0,0,1-1.69584,0L.27365,11.77325A1.18309,1.18309,0,0,1,0,11.01416V1.1597A1.14111,1.14111,0,0,1,1.12157,0h9.75686A1.14111,1.14111,0,0,1,12,1.1597v9.85446A1.18309,1.18309,0,0,1,11.72635,11.77325Z"
            />
          </svg>
        </div>
        <!-- 手术阶段 -->
        <div class="stage_trank"></div>
        <!-- 器械使用 -->
        <div class="mark_trank">
          <div class="occupy_space"></div>
          <div
            class="trank_item"
            v-for="(item, index) in intrumentList"
            :key-item="item.type"
            :key="item.type"
            @mousedown.left.stop="createPoint($event, index, item.type)"
          >
            <component
              v-for="(e, indexSon) in item.list"
              :key="e.point || e.point_stard"
              :is="createMark(e, e.type)"
              @mousedown.left.stop="mouseDownPoint($event, indexSon, item.type)"
              @mousedown.right="clearPoint($event, indexSon, item.type)"
            ></component>
          </div>
        </div>
        <!-- 自定义滚动条 -->
        <div class="progress-bar" v-show="progressStatus">
          <div class="progress"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";
import renders from "@/hook/canvasTrack/render";

let rightMark = ref(null);
let timeLineContainer = ref(null); // canvas外层
let canvas = ref(null); // canvas
let canvasWidth = ref(rightMark.value?.getBoundingClientRect().width || 0); // canvas的宽
let canvasHeight = ref(40); // canvas的高
let ctx = ref(null); // 图画上下文对象

let videoTimes = ref(65137); //视频时长（ms）
let showTimes = ref(0); //视窗内可见的时间长度
let start_time = ref(0); //左侧开始时间
let end_time = ref(0); //右侧结束时间
let sweep_time = ref(0); //左侧滚过的时间
let currentTime = ref(0); // 当前时间
let currentZoomIndex = ref(3); // 当前所在时间分辨率的类型索引
const ZOOM = [1, 2, 3, 5, 10, 15, 20, 30, 60, 120, 180, 300, 600]; // 时间分辨率
const ZOOM_HOUR_GRID = [
  400, 300, 200, 150, 100, 90, 80, 60, 50, 50, 40, 30, 20,
]; // 每格长度分配
let gridNum = ref(0); // 绘制的格数
let pxPerGrid = ref(0); // 每格宽度
let timerPlay = null; // 播放定时器
let playStatus = ref(false); // 播放状态

let moveStatus = ref(false); // 抓手竖轴移动状态
let moveMouseX = ref(0);
let trackingLine = ref(false); // 鼠标是否进入视频轨道区域

const intrumentList = ref([
  {
    name: "电勾",
    type: "instrument_electrichook",
    color: "#3d7ef8",
    list: [
      {
        type: "line",
        point_stard: 1.5,
        point_end: 3,
      },
      {
        type: "point",
        point: 1,
      },
    ],
  },
  {
    name: "穿刺鞘",
    type: "instrument_puncturesheath",
    color: "#43f83d",
    list: [
      {
        type: "point",
        point: 10,
      },
      {
        type: "point",
        point: 65,
      },
    ],
  },
  {
    name: "分离钳",
    type: "instrument_separationforceps",
    color: "#f8dc3d",
    list: [
      {
        type: "line",
        point_stard: 5,
        point_end: 12,
      },
      {
        type: "line",
        point_stard: 20,
        point_end: 70,
      },
    ],
  },
]);

// 初始化canvas
const init = () => {
  // 动态设置canvas的宽度
  canvasWidth.value = rightMark.value.getBoundingClientRect().width;
  // let timeLineContainerDom = document.querySelector(".time_line_container");
  // let stageTrankDom = document.querySelector(".stage_trank");
  // let markTrankDom = document.querySelector(".mark_trank");
  // timeLineContainerDom.style.width = canvasWidth.value + "px";
  // stageTrankDom.style.width = canvasWidth.value + "px";
  // markTrankDom.style.width = canvasWidth.value + "px";
  canvas.value.width = canvasWidth.value;
  canvas.value.height = canvasHeight.value;
  // 获取是窗内的时间长度
  showTimes.value =
    canvasWidth.value *
    (ZOOM[currentZoomIndex.value] / ZOOM_HOUR_GRID[currentZoomIndex.value]) *
    1000;
  // 设置开始时间和结束时间段
  start_time.value = sweep_time.value;
  end_time.value =
    showTimes.value >= videoTimes.value
      ? videoTimes.value
      : start_time.value + showTimes.value;
  // 绘制参数
  // 生成格数
  gridNum.value =
    (end_time.value - start_time.value) / 1000 / ZOOM[currentZoomIndex.value]; //修改绘制格数
  pxPerGrid.value = ZOOM_HOUR_GRID[currentZoomIndex.value]; // 修改每格宽度
  // 获取画图上下文
  ctx.value = canvas.value.getContext("2d");
  // 生成刻度
  generatingScale();
  // 绘制已有标记
  intrumentList.value.forEach((e) => {
    e.list.forEach((item) => {
      createMark(item, e.type);
    });
  });
  // 生成滚动条
  createScrollBar();
};

/**
 * canvas时间轴生成
 */
// 画线段方法
const drawLine = (x1, y1, x2, y2, lineWidth = 1, color = "#fff") => {
  // 开始一段新路径
  ctx.value.beginPath();
  // 设置线段颜色
  ctx.value.strokeStyle = "#fff";
  // 设置线段宽度
  ctx.value.lineWidth = lineWidth;
  // 将路径起点移到x1,y1
  ctx.value.moveTo(x1, y1);
  // 将路径移动到x2,y2
  ctx.value.lineTo(x2, y2);
  // 把路径画出来
  ctx.value.stroke();
};
// 生成刻度
const generatingScale = () => {
  // 通过开始时间判断坐标距离
  const startSpace =
    sweep_time.value %
    (ZOOM[currentZoomIndex.value] / ZOOM_HOUR_GRID[currentZoomIndex.value]);
  for (let i = 0; i < gridNum.value; i++) {
    // 横坐标就是当前索引乘每格宽度
    let x = i * pxPerGrid.value;
    // 刻度高度为时间轴高度的20%
    let h = canvasHeight.value * 0.1;
    // 刻度线颜色
    ctx.value.fillStyle = "rgba(151,158,167,1)";
    // 显示时间
    if (currentZoomIndex.value < 3) {
      ctx.value.fillText(graduationTitle(i), x, h + 25);
      drawLine(x, 0, x, h + 15, 1, "#fff");
      // for (let j = 1; j < 5; j++) {
      //   let x1 = (i + j * 0.2) * pxPerGrid.value;
      //   drawLine(x1, 0, x1, h, 1, "#fff");
      // }
    } else if (
      (currentZoomIndex.value >= 3 && currentZoomIndex.value < 5) ||
      currentZoomIndex.value >= 8
    ) {
      if (i % 3 == 0 || i == gridNum.value - 1) {
        ctx.value.fillText(graduationTitle(i), x, h + 25);
        drawLine(x, 0, x, h + 15, 1, "#fff");
      } else {
        drawLine(x, 0, x, h, 1, "#fff");
      }
    } else {
      if (i % 5 == 0 || i == gridNum.value - 1) {
        ctx.value.fillText(graduationTitle(i), x, h + 25);
        drawLine(x, 0, x, h + 15, 1, "#fff");
      } else {
        drawLine(x, 0, x, h, 1, "#fff");
      }
    }
  }
};
// 换算时间
const graduationTitle = (item) => {
  const times = item * ZOOM[currentZoomIndex.value] + start_time.value;
  const minutes = Math.floor(times / 60);
  const seconds = times % 60;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
  return formattedMinutes + ":" + formattedSeconds;
};

/**
 * 模拟视屏播放控制
 */
// 模拟视频播放
const playVideo = () => {
  timerPlay = setInterval(() => {
    if (currentTime.value < videoTimes.value) {
      currentTime.value += 1;
    } else {
      // 播放结束，从头开始，并暂停
      currentTime.value = 0;
      clearInterval(timerPlay);
      play();
    }
    moveX();
  }, 1);
};
// 点击开始
const play = () => {
  playStatus.value = !playStatus.value;
  if (playStatus.value) {
    playVideo();
  } else {
    clearInterval(timerPlay);
  }
};
// 回到开始
const goStart = () => {
  currentTime.value = 0;
  moveX();
};
// 回到最后
const goEnd = () => {
  currentTime.value = videoTimes.value;
  moveX();
};
// 后退15s
const backTime = () => {
  if (currentTime.value >= 15) {
    currentTime.value -= 15;
  } else {
    currentTime.value = 0;
  }
  moveX();
};
// 前进15s
const forwardTime = () => {
  if (currentTime.value + 15 <= videoTimes.value) {
    currentTime.value += 15;
  } else {
    currentTime.value = videoTimes.value;
  }
  moveX();
};

/**
 * 抓手处理
 */
// 抓手竖轴移动距离
const moveX = () => {
  let grabbingDom = document.querySelector(".grabbing");
  let maskDom = document.querySelector(".mask");
  // 更新竖轴在视窗中的位置，开始时间，结束时间
  if (currentTime.value - sweep_time.value >= showTimes.value) {
    grabbingDom.style.left = "0px";
    maskDom.style.width = "0px";
    sweep_time.value = currentTime.value;
    init();
  } else {
    const left =
      ((currentTime.value - sweep_time.value) *
        (ZOOM_HOUR_GRID[currentZoomIndex.value] /
          ZOOM[currentZoomIndex.value])) /
        1000 +
      "px";
    grabbingDom.style.left = left;
    maskDom.style.width = left;
  }
};
// 时间显示
const getTimeHour = (item) => {
  const times = item;
  const hour = Math.floor(times / (1000 * 60 * 60));
  const minutes = Math.floor(times / (1000 * 60)) % 60;
  const seconds = Math.floor(times / 1000) % 60;
  const millisecond = Math.floor(times % 1000);
  const formattedhour = hour < 10 ? "0" + hour : hour;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
  const formattedMillisecond =
    millisecond < 100 ? "0" + millisecond : millisecond;
  return (
    formattedhour +
    ":" +
    formattedMinutes +
    ":" +
    formattedSeconds +
    " " +
    formattedMillisecond
  );
};

// 抓手拖动处理
const onMousedownGrabbing = (event) => {
  moveStatus.value = true;
  moveMouseX.value = event.clientX;
};
window.addEventListener("mousemove", (event) => {
  let grabbingDom = document.querySelector(".grabbing");
  let maskDom = document.querySelector(".mask");
  let trackingLineDom = document.querySelector(".tracking_line");

  let rightMarkDom = document.querySelector(".right_mark");
  const trackLeft = rightMarkDom.scrollLeft;
  if (moveStatus.value) {
    if (
      event.clientX - 205 >= 0 &&
      event.clientX - 205 < canvasWidth.value + 5
    ) {
      // 更新时间
      currentTime.value =
        (event.clientX - 205) /
        (ZOOM_HOUR_GRID[currentZoomIndex.value] / ZOOM[currentZoomIndex.value]);
      // 移动位置
      grabbingDom.style.left = trackLeft + event.clientX - 205 + "px";
      maskDom.style.width = trackLeft + event.clientX - 205 + "px";
    }
  }
  if (trackingLine.value) {
    trackingLineDom.style.left = trackLeft + event.clientX - 201 + "px";
  } else {
    trackingLineDom.style.left = "5px";
  }
});
window.addEventListener("mouseup", (event) => {
  moveStatus.value = false;
});
window.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});
// 监听窗口宽度变化
window.onresize = function () {
  init();
};
// 进入时间轴区域
const enterRightMark = () => {
  trackingLine.value = true;
};
// 离开时间轴区域
const leaveRightMark = () => {
  trackingLine.value = false;
};
// 点击时间轴，移动竖轴
const clickTimeLine = (event) => {
  console.log("点击了时间轴");
  // 更新时间
  currentTime.value =
    event.layerX /
    (ZOOM_HOUR_GRID[currentZoomIndex.value] / ZOOM[currentZoomIndex.value]);
  moveX();
};
// 缩放 ctrl+滚轮
const zoomRoller = (event) => {
  if (event.ctrlKey) {
    event.preventDefault();
    if (event.deltaY > 0) {
      // 放大
      if (currentZoomIndex.value < ZOOM.length - 1) {
        currentZoomIndex.value += 1;
      } else {
        currentZoomIndex.value = ZOOM.length - 1;
      }
    } else {
      // 缩小
      if (currentZoomIndex.value > 0) {
        currentZoomIndex.value -= 1;
      } else {
        currentZoomIndex.value = 0;
      }
    }
    init();
    moveX();
  }
};

/**
 * 器械使用轨道操作
 */
// 创建点和线段
// 渲染点或先列表
const createMark = (param, type) => {
  // console.log("点击标点或连线");
  if (param.type == "point") {
    // 计算点出现的位置比例
    const left =
      param.point *
      (ZOOM_HOUR_GRID[currentZoomIndex.value] / ZOOM[currentZoomIndex.value]);
    return renders.createPoint("9", left);
  } else if (param.type == "line") {
    // 计算点出现的位置比例
    const left1 =
      param.point_stard *
      (ZOOM_HOUR_GRID[currentZoomIndex.value] / ZOOM[currentZoomIndex.value]);
    const left2 =
      param.point_end *
      (ZOOM_HOUR_GRID[currentZoomIndex.value] / ZOOM[currentZoomIndex.value]);
    return renders.createLine("9", left1, left2);
  }
};
// 左键标点
const createPoint = (event, index, type) => {
  console.log("点击标点");
  // const layerX = event.layerX; //点击处距离该dom左边距离
  // // 换算成时间
  // const pointTime = parseInt(
  //   layerX *
  //     (ZOOM[currentZoomIndex.value] / ZOOM_HOUR_GRID[currentZoomIndex.value])
  // );
  // // 添加点
  // /**
  //  * 判断上一次的标记是否是点，进而确认是否连线
  //  */
  // const nextPoint = intrumentList.value.findIndex(
  //   (item) =>
  //     item.type === type && item.list[item.list.length - 1]?.type == "point"
  // );
  // if (nextPoint > -1) {
  //   if (confirm("是否与上个标点相连接？")) {
  //     // 向该点中加入坐标
  //     const item = intrumentList.value.find((item) => item.type === type);
  //     if (item) {
  //       // 将新的对象插入到list数组中
  //       item.list[item.list.length - 1] = {
  //         type: "line",
  //         point_stard:
  //           item.list[item.list.length - 1].point < pointTime
  //             ? item.list[item.list.length - 1].point
  //             : pointTime,
  //         point_end:
  //           item.list[item.list.length - 1].point > pointTime
  //             ? item.list[item.list.length - 1].point
  //             : pointTime,
  //       };
  //     }
  //   } else {
  //     const item = intrumentList.value.find((item) => item.type === type);
  //     if (item) {
  //       // 将新的对象插入到list数组中
  //       item.list.push({
  //         type: "point",
  //         point: pointTime,
  //       });
  //     }
  //   }
  // } else {
  //   const item = intrumentList.value.find((item) => item.type === type);
  //   if (item) {
  //     // 将新的对象插入到list数组中
  //     item.list.push({
  //       type: "point",
  //       point: pointTime,
  //     });
  //   }
  // }
};
// 点击标点
let mouseDownPoint = (event, indexSon, type) => {
  console.log("点击了该点");
  // console.log(event, indexSon, type);
};
// 右键删除
const clearPoint = (event, index, type) => {
  console.log("右击了该点");
  event.preventDefault();
  if (confirm("是否删除该标记？")) {
    const fatherIndex = intrumentList.value.findIndex(
      (item) => item.type === type
    );
    if (fatherIndex > -1) {
      intrumentList.value[fatherIndex].list.splice(index, 1);
    }
  }
};

/**
 * 滚动条处理
 */
let progressStatus = ref(false);
// 生成滚动条长度
const createScrollBar = () => {
  let progressDom = document.querySelector(".progress");
  if (showTimes.value <= videoTimes.value) {
    progressStatus.value = true;
    nextTick(() => {
      const progressBarDom = document.querySelector(".progress-bar");
      progressDom.style.width =
        progressBarDom.offsetWidth * (showTimes.value / videoTimes.value) < 100
          ? "100px"
          : progressBarDom.offsetWidth * (showTimes.value / videoTimes.value) +
            "px";
    });
  } else {
    progressStatus.value = false;
  }
};

// 拖动滚动条

onMounted(() => {
  init();
});
</script>

<style lang="less">
.canvas_line_optimize_one {
  user-select: none;
  width: 100%;
  background: rgb(0, 0, 0);
  .video {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      display: block;
      height: 20px;
      font-size: 12px;
      color: #aaa;
      margin: 0 5px;
      padding: 0 8px;
      border: 1px solid #aaa;
      border-radius: 5px;
      transition: 0.2s;
      cursor: pointer;
      &:hover {
        color: #fff;
        border-color: #fff;
      }
    }
  }

  .canvas_container {
    display: flex;
    // 左侧提示
    .left_information {
      width: 200px;
      margin-top: 5px;
      .left_information_time {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        background: #0e1728;
      }
      .left_information_stage {
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        font-size: 18px;
        margin: 5px 0;
        background: #182742;
      }
      .left_information_instrument {
        width: 100%;
        padding-bottom: 10px;
        background: #182742;
        font-size: 12px;
        color: #ddd;
        padding-left: 50px;
        span {
          line-height: 40px;
        }
        ul {
          margin-left: 10px;
          border-left: 1px dashed #ddd;
          padding-left: 10px;
          li {
            line-height: 30px;
            display: flex;
            align-items: center;
            i {
              display: block;
              width: 20px;
              height: 10px;
              margin-right: 10px;
            }
          }
        }
      }
    }
    // 右侧轨道
    .right_mark {
      position: relative;
      flex: 1;
      overflow: hidden;
      // 时间线
      .time_line_container {
        position: absolute;
        top: 5px;
        z-index: 1;
        width: 100%;
        height: 50px;
        background: #0e1728;
        cursor: pointer;
        overflow: hidden;
        padding-left: 5px;
        .timeline {
          // width: 100%;
        }
      }
      // 遮罩
      .mask {
        position: absolute;
        left: 5px;
        top: 5px;
        z-index: 0;
        height: 100%;
        width: 0;
        background: rgba(255, 255, 255, 0.2);
      }
      // 跟踪线
      .tracking_line {
        position: absolute;
        left: 5px;
        top: 5px;
        z-index: 1;
        height: 100%;
        border-left: 1px dashed rgba(255, 255, 255, 0.3);
      }
      // 移动轴
      .grabbing {
        position: absolute;
        top: 0px;
        left: 0;
        z-index: 2;
        height: 100%;
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

      // 手术阶段
      .stage_trank {
        height: 40px;
        width: 100%;
        background: #182742;
        margin-top: 60px;
        margin-bottom: 5px;
      }
      // 标点轨道
      .mark_trank {
        width: 100%;
        padding-bottom: 10px;
        background: #182742;
        overflow: hidden;
        .occupy_space {
          height: 40px;
          width: 100%;
        }
        .trank_item {
          position: relative;
          z-index: 1;
          height: 28px;
          width: 100%;
          margin: 2px 0;
          background: rgba(14, 24, 43, 0.4);
        }
      }
      // 自定义滚动条
      .progress-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 2;
        width: 100%;
        height: 6px;
        background-color: transparent;
        .progress {
          width: 30%;
          height: 100%;
          background-color: #888;
          border-radius: 3px;
        }
      }
    }
  }
}
</style>
