import { defineStore } from "pinia";
import { ref } from "vue";

const pageStore = defineStore('page', () => {
    let scrollTop = ref(0);
    let screenWidth = ref(0)
    // 设置滚动高度
    const setScrollTop = (info) => {
        scrollTop.value = info
    }
    // 设置屏幕宽度
    const setScreenWidth = (info) => {
        screenWidth.value = info
    }
    // 获取滚动高度
    const getScrollTop = () => {
        return scrollTop.value
    }
    // 获取屏幕宽度
    const getScreenWidth = () => {
        return screenWidth.value
    }

    return {
        scrollTop,
        screenWidth,
        setScrollTop,
        setScreenWidth,
        getScrollTop,
        getScreenWidth,
    }
}, {
    persist: true
})

export default pageStore;