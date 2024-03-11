<script setup>
import { ref, onMounted, nextTick } from "vue";
import { usePainter } from "@/util/drawPainter.js";

import {
  CalligraphyPen24Regular,
  TextT48Filled,
  ArrowHookUpLeft16Regular,
  ArrowHookUpRight16Regular,
  Delete16Regular,
} from "@vicons/fluent";
import { RefreshOutline } from "@vicons/ionicons5";

const props = defineProps({
  videoElement: {
    type: Object,
    default: null,
  },
  imgElement: {
    type: Object,
    default: null,
  },
  dataTransType: {
    type: String,
    default: "png",
  },
});

const emit = defineEmits(["submit", "close"]);

const canvas = ref(null);
const currentColorIndex = ref(0);
const currentLineWidthIndex = ref(0);
const type = ref("pen"); // pen、text

const colorOption = [
  "#F43920FF",
  "#1981F7FF",
  "#5819F7FF",
  "#13B7B2FF",
  "#F5CF06FF",
  "#333333FF",
  "#ffffff",
];
const lineWidthOption = [2, 4, 6, 8];
const option = ref({
  lineWidth: lineWidthOption[currentLineWidthIndex.value],
  lineColor: colorOption[currentColorIndex.value],
  type: type.value,
});

// 画笔和文字转变
const onUpdateType = (t) => {
  type.value = t;
  option.value.lineWidth = t;
  onUpdateOption(option.value);
};
const handleCanvasClick = (event) => {
  onStartWrite(event);
};

const onChangeLineWidth = (index) => {
  currentLineWidthIndex.value = index;
  option.value.lineWidth = lineWidthOption[index];
  onUpdateOption(option.value);
};
const onChangeColor = (index) => {
  currentColorIndex.value = index;
  option.value.lineColor = colorOption[index];
  onUpdateOption(option.value);
};

// 初始化
let onRevocation = () => {};
let onRenewal = () => {};
let onClear = () => {};
let onRenewalAll = () => {};
let onUpdateOption = () => {};
let onStartWrite = () => {};
const initPainter = () => {
  const { revocation, renewal, clear, renewalAll, updateOption, startWrite } =
    usePainter({
      canvasRef: canvas,
      options: option.value,
    });
  onRevocation = revocation;
  onRenewal = renewal;
  onClear = clear;
  onRenewalAll = renewalAll;
  onUpdateOption = updateOption;
  onStartWrite = startWrite;
};

const videoFrameCaputure = () => {
  canvas.value.width = canvas.value.clientWidth;
  canvas.value.height = canvas.value.clientHeight;
  const video = props.videoElement;
  canvas.value
    .getContext("2d")
    .drawImage(
      video,
      0,
      0,
      canvas.value.clientWidth,
      canvas.value.clientHeight
    );
};

const sendImage = () => {
  if (props.dataTransType === "png") {
    const data = canvas.value.toDataURL();
    const img = dataURLtoFile(data, "consultation" + Date.now() + ".png");
    emit("submit", img);
  } else if (props.dataTransType === "blob") {
    canvas.value.toBlob((blob) => {
      emit("submit", blob);
    });
  } else if (props.dataTransType === "base64") {
    emit("submit", {
      width: canvas.value.clientWidth,
      height: canvas.value.clientHeight,
      url: canvas.value.toDataURL(),
    });
  }
};
const dataURLtoFile = (dataurl, filename) => {
  const base64Code = dataurl.split(","); // 获取到base64编码
  const base64Str = window.atob(base64Code[1]); // 将base64编码转为字符串
  let base64Len = base64Str.length;
  const u8arr = new Uint8Array(base64Len); // 创建初始化为0的，包含length个元素的无符号整型数组
  while (base64Len--) {
    u8arr[base64Len] = base64Str.charCodeAt(base64Len);
  }
  return new File([u8arr], filename, {
    type: "image/png",
  });
};
const imgFrameCapture = async () => {
  const layer = canvas.value.getContext("2d");
  canvas.value.width = canvas.value.clientWidth;
  canvas.value.height = canvas.value.clientHeight;
  let imgElemetData = null;
  if (
    props.imgElement &&
    Object.prototype.toString.call(props.imgElement) === "[object Promise]"
  ) {
    imgElemetData = await props.imgElement;
  } else {
    imgElemetData = props.imgElement;
  }
  layer.drawImage(
    imgElemetData,
    0,
    0,
    canvas.value.clientWidth,
    canvas.value.clientHeight
  );
};

onMounted(async () => {
  if (props.videoElement) {
    await nextTick();
    try {
      videoFrameCaputure();
    } catch {
      // eslint-disable-next-line
    }
  } else if (props.imgElement) {
    await nextTick();
    try {
      imgFrameCapture();
    } catch {
      // eslint-disable-next-line
    }
  }
  nextTick(() => {
    initPainter();
  });
});
</script>

<template>
  <div
    class="w-full h-full bg-#eee flex flex-col justify-between rounded-xl overflow-hidden"
  >
    <div class="canvas-wrap w-full aspect-video relative">
      <canvas
        ref="canvas"
        class="w-full h-full rounded-xl bg-#fff"
        @click="handleCanvasClick"
      ></canvas>
    </div>
    <div class="w-full flex justify-between items-center pb-5 pt-2 px-4">
      <div class="flex items-center space-x-2">
        <n-popover trigger="click">
          <template #trigger>
            <div
              class="flex items-center justify-center flex-col px-4 py-1 rounded-md transition-all cursor-pointer hover:bg-#2a69e9 hover:text-#fff"
              @click="onUpdateType('pen')"
              :class="type === 'pen' ? 'bg-#2a69e9 text-#fff' : ''"
            >
              <n-icon size="24">
                <CalligraphyPen24Regular />
              </n-icon>
              <span class="block w-full text-center text-xs">画笔</span>
            </div>
          </template>
          <div>
            <div
              class="h-10 pb-2 mb-2 flex justify-center space-x-7 border-b-2 border-b-dashed border-b-#ddd"
            >
              <div
                v-for="(item, index) in lineWidthOption"
                :key="item"
                class="w-7 h-7 flex justify-center items-center cursor-pointer"
                :class="
                  currentLineWidthIndex === index
                    ? 'border border-solid border-#1981F7FF'
                    : ''
                "
                @click="onChangeLineWidth(index)"
              >
                <div
                  class="w-6 bg-#aaa rotate-45"
                  :style="{ height: item + 'px' }"
                ></div>
              </div>
            </div>
            <div class="flex space-x-2">
              <div
                v-for="(item, index) in colorOption"
                :key="item"
                :style="{ backgroundColor: item }"
                class="h-7 w-7 cursor-pointer"
                :class="
                  currentColorIndex === index
                    ? 'border-2 border-solid border-#6a96f0 '
                    : ''
                "
                @click="onChangeColor(index)"
              ></div>
            </div>
          </div>
        </n-popover>
        <div
          class="flex items-center justify-center flex-col px-4 py-1 rounded-md transition-all cursor-pointer hover:bg-#2a69e9 hover:text-#fff"
          @click="onUpdateType('text')"
          :class="type === 'text' ? 'bg-#2a69e9 text-#fff' : ''"
        >
          <n-icon size="24">
            <TextT48Filled />
          </n-icon>
          <span class="block w-full text-center text-xs">文字</span>
        </div>
        <div class="w-[2px] h-6 bg-#aaa"></div>
        <div
          class="flex items-center justify-center flex-col px-4 py-1 rounded-md transition-all cursor-pointer hover:bg-#2a69e9 hover:text-#fff"
          @click="onRevocation"
        >
          <n-icon size="24">
            <ArrowHookUpLeft16Regular />
          </n-icon>
          <span class="block w-full text-center text-xs">撤回</span>
        </div>
        <div
          class="flex items-center justify-center flex-col px-4 py-1 rounded-md transition-all cursor-pointer hover:bg-#2a69e9 hover:text-#fff"
          @click="onRenewal"
        >
          <n-icon size="24">
            <ArrowHookUpRight16Regular />
          </n-icon>
          <span class="block w-full text-center text-xs">重做</span>
        </div>
        <div class="w-[2px] h-6 bg-#aaa"></div>
        <div
          class="flex items-center justify-center flex-col px-4 py-1 rounded-md transition-all cursor-pointer hover:bg-#2a69e9 hover:text-#fff"
          @click="onClear"
        >
          <n-icon size="24">
            <Delete16Regular />
          </n-icon>
          <span class="block w-full text-center text-xs">清空全部</span>
        </div>
        <div
          class="flex items-center justify-center flex-col px-4 py-1 rounded-md transition-all cursor-pointer hover:bg-#2a69e9 hover:text-#fff"
          @click="onRenewalAll"
        >
          <n-icon size="24">
            <RefreshOutline />
          </n-icon>
          <span class="block w-full text-center text-xs">恢复全部</span>
        </div>
      </div>
      <div class="px-3 flex justify-between space-x-4">
        <n-button @click="emit('close')" type="tertiary" strong secondary>
          取消
        </n-button>
        <n-button class="w-30" @click="sendImage" type="info">完成</n-button>
      </div>
    </div>
  </div>
</template>
