<script setup lang="ts">
import { ConsultType } from '@/enum'
import { getConsultOrderList } from '@/services/consult'
import type { ConsultOrderItem, ConsultOrderListParams } from '@/types/consult'
import { ref } from 'vue'
import ConsultItem from './ConsultItem.vue'
const props = defineProps<{ type: ConsultType }>()
const params = ref<ConsultOrderListParams>({
  type: props.type,
  current: 1,
  pageSize: 5
})
const list = ref<ConsultOrderItem[]>([])
const loading = ref(false)
const finished = ref(false)
const onLoad = async () => {
  const res = await getConsultOrderList(params.value)
  list.value.push(...res.data.rows)
  if (params.value.current < res.data.pageTotal) {
    params.value.current++
  } else {
    finished.value = true
  }
  loading.value = false
}
const onDelete = (id: string) => {
  list.value = list.value.filter((item) => item.id !== id)
}
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <consult-item
        @delete="onDelete"
        v-for="i in list"
        :key="i.id"
        :item="i"
      />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
