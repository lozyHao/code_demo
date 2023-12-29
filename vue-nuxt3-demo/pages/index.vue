<script setup>
import hero from "@/assets/images/hero.png";
import iphoneDevice from "@/assets/images/iphone_device.png";
</script>

<template>
  <NuxtLayout name="home">
    <template #header>
      <AppHeader class="fixed top-0"></AppHeader>
    </template>
    <div
      class="w-full flex flex-col justify-end items-center align-bottom aspect-video min-h-200 max-h-270 px-4 bg-gradient-to-b from-#004453 to-#000000"
    >
      <div class="flex-1 flex justify-center items-end">
        <img class="w-90% max-w-200" :src="hero" alt="" />
      </div>
      <div class="iphone-box h-80 overflow-hidden">
        <img class="iphone w-90% max-w-200" :src="iphoneDevice" alt="" />
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped lang="less">
.iphone {
  animation: move 1s ease-in-out;
}

@keyframes move {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0%);
  }
}
</style>
