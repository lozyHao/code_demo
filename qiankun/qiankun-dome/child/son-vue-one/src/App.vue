<script setup>
import page from "../package.json"
</script>

<template>
	<div>
		<nav>
			<h2>{{ page.name }}</h2>
			<router-link to="/">Home</router-link> |
			<router-link to="/about">About</router-link>
		</nav>
		<router-view></router-view>
	</div>
</template>
