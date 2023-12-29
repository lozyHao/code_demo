<script setup>
import iPhone from "@/assets/images/iphone.png";
import search from "@/assets/images/search.png";
</script>

<template>
  <div
    class="app-header h-20 w-full border-b border-b-solid border-b-#ffffff16 bg-#004453 px-4"
  >
    <div
      class="w-full max-w-300 h-full mx-auto flex justify-between items-center"
    >
      <img class="w-8 h-8" :src="iPhone" alt="" />
      <div
        class="flex-1 px-10 mr-5% flex justify-end gap-x-10 text-#fff font-300"
      >
        <span>Mac</span>
        <span>iPad</span>
        <span>iPhone</span>
        <span>Store</span>
      </div>
      <img class="w-6 h-6" :src="search" alt="" />
    </div>
  </div>
</template>
