<template>
	<nav>
		<router-link to="/">首页</router-link> |
		<router-link to="/son-vue-one">sonVueOne</router-link> |
		<router-link to="/son-vue-two">sonVueTwo</router-link>
	</nav>
	<div id="container"></div>
	<router-view></router-view>
</template>

<style>
nav {
	height: 60px !important;
}

nav>a {
	font-size: 24px;
}
</style>
