<script setup>
import { zhCN, dateZhCN } from "naive-ui";
</script>

<template>
	<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
		<n-dialog-provider>
			<n-message-provider>
				<router-view />
			</n-message-provider>
		</n-dialog-provider>
	</n-config-provider>
</template>
