<script setup>
import { ref, computed, onMounted, nextTick } from "vue";

const messageList = ref([]);
const isNow = ref(true);
const loading = ref("");
const messageValue = ref("");
const historyLoaded = ref(false);

// 检测发送消息是否为空
const checkMessage = computed(
  () =>
    messageValue.value == null ||
    messageValue.value == "" ||
    messageValue.value.match(/^ *$/)
);

const getHistoryMessage = () => {
  for (let i = 0; i < 10; i++) {
    const id = generateRandomID();
    messageList.value.unshift({
      id: `message-${id}`,
      name: `用户-${id}`,
      isMy: Math.random() < 0.5,
      message: generateRandomString(Math.random() * 10 + 4),
    });
  }
};

// 发送聊天
const sendMessage = () => {
  const id = generateRandomID();
  messageList.value.push({
    id: `message-${id}`,
    name: `用户-${id}`,
    isMy: true,
    message: messageValue.value,
  });
  nextTick(() => {
    goNow();
  });
};

// 滚动加载更多
const onScroll = () => {
  const messageDom = document.getElementById("message-box");
  if (!historyLoaded.value) {
    if (messageDom?.scrollTop === 0) {
      if (!loading.value) {
        loading.value = true;
        setTimeout(() => {
          // 滚动到顶部，加载历史数据
          getHistoryMessage();
          loading.value = false;
          if (messageList.value.length > 30) {
            historyLoaded.value = true;
          }
        }, 1000);
      }
    }
  }
};

// 回到最新
const goNow = () => {
  const messageDom = document.getElementById("message-box");
  if (
    messageDom?.scrollTop <
    messageDom?.scrollHeight - messageDom?.clientHeight
  ) {
    messageDom?.scrollTo({
      top: messageDom?.scrollHeight - messageDom?.clientHeight,
    });
  }
  messageValue.value = "";
  isNow.value = true;
};

const messageBox = ref(null);
onMounted(() => {
  getHistoryMessage();
  nextTick(() => {
    // 更改滚动方向
    messageBox.value?.addEventListener("wheel", onMouseScroll);
  });
});

onBeforeUnmount(() => {
  messageBox.value?.removeEventListener("wheel", onMouseScroll);
});

function onMouseScroll(event) {
  const messageDom = document.getElementById("message-box");
  isNow.value =
    messageDom?.scrollTop < messageDom?.scrollHeight - messageDom?.clientHeight
      ? true
      : false;
  if (event.deltaY < 0) {
    onScroll();
  }
}

// 随机字符串
const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
function generateRandomID() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const idLength = Math.random() * 15 + 2;
  let result = "";
  // 生成随机字符串部分
  for (let i = 0; i < idLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  // 添加时间戳部分
  const timestamp = new Date().getTime().toString(16);
  const padding = idLength - timestamp.length;
  if (padding > 0) {
    result = result.slice(0, padding) + timestamp + result.slice(padding);
  } else {
    result = timestamp;
  }
  return result;
}
</script>
<template>
  <div class="rotate-chat-room w-full flex justify-center items-center">
    <div
      class="w-120 h-200 border border-solid border-#eee relative flex flex-col justify-between"
    >
      <div
        class="message-head h-12 w-full bg-#eee flex items-center justify-center text-xl"
      >
        模拟聊天-滚动
      </div>
      <div
        class="message-box flex-1 px-3 overflow-y-auto"
        id="message-box"
        ref="messageBox"
      >
        <div v-if="historyLoaded" class="text-center py-4 text-#999">
          历史数据加载完成
        </div>
        <n-spin
          v-if="loading"
          class="w-full text-center py-4 text-#999"
          size="small"
        />
        <div v-for="message in messageList" :key="message.id" class="my-4">
          <div
            class="flex flex-wrap"
            :class="message.isMy ? 'justify-right' : 'justify-left'"
          >
            <div
              class="text-4 font-bold w-full"
              :class="
                message.isMy ? 'text-right text-#3f84f7' : 'text-left text-#666'
              "
            >
              {{ message.name }}
            </div>
            <div
              class="bg-#eee p-2 rounded-md text-left max-w-full overflow-hidden"
              style="word-wrap: break-word"
            >
              {{ message.message }}
            </div>
          </div>
        </div>
      </div>
      <n-button
        v-if="isNow"
        strong
        secondary
        type="info"
        size="tiny"
        class="absolute bottom-12 right-0 text-xs"
        @click="goNow"
      >
        回到最新
      </n-button>
      <div
        class="message-input h-12 w-full bg-#eee flex items-center justify-between px-2"
      >
        <n-input-group>
          <n-input
            v-model:value="messageValue"
            placeholder="请输入消息"
          ></n-input>
          <n-button type="info" :disabled="checkMessage" @click="sendMessage">
            发送
          </n-button>
        </n-input-group>
      </div>
    </div>
  </div>
</template>
