<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const id = computed(() => route.params.id);

definePageMeta({
  layout: "custom",
});
</script>

<template>
  <NuxtLayout name="custom">
    <div>{{ id }}</div>
    <div>
      <NuxtLink to="/">返回</NuxtLink>
    </div>
  </NuxtLayout>
</template>
