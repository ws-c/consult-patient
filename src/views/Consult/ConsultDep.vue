<script setup lang="ts">
import { getAllDep } from '@/services/consult'
import type { TopDep } from '@/types/consult'
import { computed, onMounted, ref } from 'vue'
import { useConsultStore } from '@/stores'
const active = ref(0)
const allDep = ref<TopDep[]>([])
onMounted(async () => {
  const res = await getAllDep()
  allDep.value = res.data
})
const subDep = computed(() => {
  return allDep.value?.[active.value]?.child || []
})
const store = useConsultStore()
</script>

<template>
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室" />
    <div class="wrapper">
      <van-sidebar v-model="active">
        <van-sidebar-item
          :title="top.name"
          v-for="top in allDep"
          :key="top.id"
        />
      </van-sidebar>
      <div class="sub-dep">
        <router-link
          @click="store.setDep(sub.id)"
          to="/consult/illness"
          v-for="sub in subDep"
          :key="sub.id"
        >
          {{ sub.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
.consult-dep-page {
  padding-top: 46px;
}
.wrapper {
  height: calc(100vh - 46px);
  overflow: hidden;
  display: flex;
  .sub-dep {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    > a {
      display: block;
      padding: 14px 30px;
      color: var(--cp-dark);
    }
  }
}
</style>
