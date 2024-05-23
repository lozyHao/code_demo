<script setup>
import SlideVerify from "vue-monoplasty-slide-verify/src/lib/slide-verify.vue";
import treeScenery01 from "@/assets/img/tree_scenery01.jpg";
import treeScenery02 from "@/assets/img/tree_scenery02.jpg";
import treeScenery03 from "@/assets/img/tree_scenery03.jpg";
import { ref } from "vue";
import { useMessage } from "naive-ui";

const message = useMessage();
const images = [treeScenery01, treeScenery02, treeScenery03];
const slideRef = ref(null);

// 成功回调
const onSuccess = () => {
  message.success("恭喜您，验证成功啦！");
};
// 失败回调
const onFail = () => {
  message.error("很遗憾，验证失败，请重试哦！");
};
// 点击刷新回调
const onRefresh = () => {
  message.success("开始刷新");
};
// 刷新成功后回调
const onRefreshComplete = () => {
  message.success("刷新成功，请继续操作~");
};
// 检测到非人为操作
const onAgain = () => {
  message.warning("再试一次吧～");
  slideRef.value.reset();
};
</script>
<template>
  <div class="">
    <div class="content-box">
      <div class="verify-box">
        <slide-verify
          ref="slideRef"
          :l="42"
          :r="10"
          :w="280"
          :h="200"
          :imgs="images"
          slider-text="向右滑动"
          @success="onSuccess"
          @fail="onFail"
          @refresh="onRefresh"
          @fulfilled="onRefreshComplete"
          @again="onAgain"
        >
        </slide-verify>
      </div>
    </div>
  </div>
</template>
