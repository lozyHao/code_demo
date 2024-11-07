<script setup lang="ts">
import { ref, computed, watch } from "vue";
import useFileStore from "../store/file.ts";
import { FileData } from "../hooks/FileData.ts";
import { useMessage } from 'naive-ui'

const message = useMessage()

const loading = computed<boolean>(() => store.loading)
const images = computed<FileData[]>(() => store.files)
const currentIndex = computed<number>(() => store.index)

const store = useFileStore()

const handleChange = async (event: Event) => {

	const t = event.target
	const data = await store.addFiles(t.files)
	message.info(data)
	// 清空
	event.target.value = ''
}

</script>

<template>
	<div class="import-image">
		<div class="text-center">{{ loading ? '正在加载中...' : '加载完成' }}</div>
		<div class="w-100 h-40 flex justify-center items-center bg-#ddd mx-auto rounded-xl relative">
			<input class="opacity-0 w-full h-full cursor-pointer absolute" type="file" multiple
				accept="image/jpg,image/jpeg,image/png" @change="handleChange" />
			<div class="w-full h-full flex justify-center items-center text-xl text-red">选择图片</div>
		</div>

		<!-- 预览图片 -->
		<div v-if="images.length > 0" class="w-full h-40 object-contain">
			<img class="w-full h-full object-contain" :src="images[currentIndex]?.pre" alt="">
		</div>
		<div class="w-full grid grid-cols-10">
			<div class="w-full h-30 object-contain" v-for="(item, index) in images" :key="item.name"
				@click="store.setIndex(index)">
				<img :src="item.pre" class="w-full h-full object-contain" />
			</div>
		</div>
	</div>
</template>