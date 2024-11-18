<script setup>
import { zhCN, dateZhCN } from "naive-ui";
</script>

<template>
	<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
		<n-dialog-provider>
			<n-message-provider>
				<nav class="flex justify-center items-center py-4">
					<router-link to="/">图片处理</router-link> |
					<router-link to="/import-image">大图片大数量导入</router-link> |
					<router-link to="/canvas-font">canvas自定义字体绘制</router-link> |
					<router-link to="/canvas-sign">生成签名图片</router-link>
				</nav>
				<router-view />
			</n-message-provider>
		</n-dialog-provider>
	</n-config-provider>
</template>
