<script setup>
import RotateChatRoom from "./component/RotateChatRoom.vue";
import ScrollChatRoom from "./component/ScrollChatRoom.vue";
import { ref } from "vue";

const type = ref(1);
</script>

<template>
  <div class="chat-room overflow-hidden">
    <n-space class="w-full my-3" justify="center">
      <n-button :type="type === 1 ? 'info' : ''" @click="type = 1"
        >模拟聊天一</n-button
      >
      <n-button :type="type === 2 ? 'info' : ''" @click="type = 2"
        >模拟聊天二</n-button
      >
    </n-space>
    <rotate-chat-room v-if="type === 1"></rotate-chat-room>
    <scroll-chat-room v-if="type === 2"></scroll-chat-room>
  </div>
</template>
