<script setup>
import SliderVerify from "./computed/SliderVerify.vue";
import ImgVerify from "./computed/ImgVerify.vue";
import TextVerify from "./computed/TextVerify.vue";
</script>
<template>
  <div
    class="auth-code w-full h-full p-10 grid grid-cols-2 gap-10 overflow-y-scroll"
  >
    <div class="flex justify-center content-start flex-wrap">
      <h1 class="block w-full text-center">滑块图形验证</h1>
      <slider-verify></slider-verify>
    </div>
    <div class="flex justify-center content-start flex-wrap">
      <h1 class="block w-full text-center">图形验证</h1>
      <img-verify></img-verify>
    </div>
    <div class="flex justify-center content-start flex-wrap">
      <h1 class="block w-full text-center">文字点选验证</h1>
      <text-verify></text-verify>
    </div>
  </div>
</template>
