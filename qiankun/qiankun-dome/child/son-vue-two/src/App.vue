<script setup>
import page from "../package.json"
</script>

<template>
	<div>
		<nav>
			<h2>{{ page.name }}</h2>
			<router-link to="/">首页</router-link> |
			<router-link to="/about">关于</router-link>
		</nav>
		<router-view></router-view>
	</div>
</template>
