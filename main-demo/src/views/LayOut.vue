<script setup>
import logo from "@/assets/img/lozyhao_avatar.jpg";
import { NIcon } from "naive-ui";
import {
  HomeOutline,
  Analytics,
  ContrastOutline,
  CropOutline,
} from "@vicons/ionicons5";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import router from "@/router/index.js";

const route = useRoute();
const activeKey = ref(route.name);

const renderIcon = (icon) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};
const menuOptions = [
  {
    label: "首页",
    key: "home",
    icon: renderIcon(HomeOutline),
  },
  {
    label: "轨道标记",
    key: "canvas-track",
    icon: renderIcon(Analytics),
  },
  {
    label: "canvas仿马赛克-视频",
    key: "video-mosaic",
    icon: renderIcon(ContrastOutline),
  },
  {
    label: "视频截图绘制",
    key: "video-snapshot",
    icon: renderIcon(CropOutline),
  },
  {
    label: "canvas 小案例",
    key: "canvas-case",
    icon: renderIcon(CropOutline),
  },
  {
    label: "canvas 烟花",
    key: "canvas-fireworks",
    icon: renderIcon(CropOutline),
  },
];

const navigatorTo = (key) => {
  router.push({
    name: key,
  });
};

watch(
  () => route.name,
  () => {
    activeKey.value = route.name;
  }
);

const screenWidth = ref(0);
const collapsed = ref(true);
const collapsedHide = ref(false);
const MOBILE_WIDTH = 935;
// 移动端适配
// 监听窗口宽度变化
let getScreenWidth = function () {
  screenWidth.value = document.documentElement.clientWidth || window.innerWidth;
  if (screenWidth.value < MOBILE_WIDTH) {
    collapsedHide.value = true;
  } else {
    collapsedHide.value = false;
  }
};

onMounted(() => {
  getScreenWidth();
  window.onresize = function () {
    getScreenWidth();
  };
});
</script>

<template>
  <div class="lay_out">
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
        :style="{
          position: collapsedHide ? 'fixed' : '',
          zIndex: '1000',
          height: '100vh',
        }"
        :collapsed-width="collapsedHide ? 0 : 64"
        content-style="padding: 8px 0px;"
        :collapsed-trigger-style="`right:${collapsedHide ? -15 : 0}px;`"
      >
        <div
          class="w-full py-2 flex justify-center items-center overflow-hidden"
        >
          <img
            class="block w-10 h-10 shadow rounded-2"
            :src="logo"
            alt=""
            srcset=""
          />
          <span class="ml-2 text-5 font-bold" v-if="!collapsed">lozyhao</span>
        </div>
        <n-menu
          v-model:value="activeKey"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          @update:value="(key) => navigatorTo(key)"
        />
      </n-layout-sider>
      <n-layout-content content-style="padding: 0;">
        <router-view class="router-view"></router-view>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<style lang="less">
.lay_out {
  display: flex;
  justify-content: space-between;

  .nav {
    width: 60px;
    height: 100vh;
    padding: 10px 0;
    border-right: 1px solid #eee;

    & > strong {
      display: block;
      width: 40px;
      text-align: center;
      border-radius: 4px;
      color: #4bb82e;
      box-shadow: #ddd 0 0 10px 0;
      margin: 0 auto;
    }

    a {
      display: block;
      width: 100%;
      text-align: center;
      padding: 10px 0;
      margin: 5px 0;
      font-size: 12px;
      border-radius: 4px;
      transition: 0.2s;

      &:hover {
        background: #eee;
      }

      &.router-link-active {
        color: #1773eb;
        background: #eee;
      }
    }
  }

  .router-view {
    flex: 1;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
