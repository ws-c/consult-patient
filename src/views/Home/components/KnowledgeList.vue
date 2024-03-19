<script setup lang="ts">
import { getKnowledgePage } from '@/services/consult'
import type {
  KnowledgeList,
  KnowledgeParams,
  KnowledgeType
} from '@/types/consult'
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
const list = ref<KnowledgeList>([])
const loading = ref(false)
const finished = ref(false)
const onLoad = async () => {
  const res = await getKnowledgePage(params.value)
  list.value.push(...res.data.rows)
  if (params.value.current >= res.data.pageTotal) {
    finished.value = true
  } else {
    params.value.current++
  }
  loading.value = false
}
const props = defineProps<{
  type: KnowledgeType
}>()
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10
})
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>
