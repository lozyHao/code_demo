<script setup>
const props = defineProps({
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "100%",
  },
  opacity: {
    type: Number,
    default: 0.5,
  },
  px: {},
});
</script>

<template>
  <div class="mosaic-dom"></div>
</template>
