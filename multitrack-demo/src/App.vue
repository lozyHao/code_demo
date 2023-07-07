<template>
  <nav>
    <router-link to="/">首页</router-link> |
    <router-link to="/canvas-track">视屏轨道Demo</router-link> |
    <router-link to="/canvas-track-optimize-one"
      >视屏轨道Demo优化版1</router-link
    >
  </nav>
  <router-view />
</template>

<style lang="less">
* {
  padding: 0;
  margin: 0;
  list-style: none;
  text-decoration: none;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 30px;
  text-align: center;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
