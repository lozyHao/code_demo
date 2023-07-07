<script setup></script>

<template>
  <div class="lay_out">
    <nav class="nav">
      <strong>LM</strong>
      <router-link to="/home">首页</router-link>
      <router-link to="/canvas-track">轨道<br />标记</router-link>
    </nav>
    <router-view class="router-view"></router-view>
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
    overflow: hidden;
  }
}
</style>
