<script setup>
import { zhCN, dateZhCN } from "naive-ui";
</script>

<template>
	<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
		<n-dialog-provider>
			<n-message-provider>
				<div class="nav h-10 w-full flex justify-center ">
					<router-link to="/">Home</router-link> |
					<router-link to="/objects-snapping">对象捕捉(参考线)</router-link>
				</div>
				<router-view />
			</n-message-provider>
		</n-dialog-provider>
	</n-config-provider>
</template>
