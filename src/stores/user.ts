import { defineStore } from 'pinia'
import type { User } from '../types/user.d.ts'
import { ref } from 'vue'
export const useUserStore = defineStore(
  'user',
  () => {
    // 用户信息
    const user = ref<User>()
    // 修改用户信息
    const setUser = (data: User) => {
      user.value = data
    }
    const delUser = () => {
      user.value = undefined
    }
    // 返回
    return { user, setUser, delUser }
  },
  {
    persist: true
  }
)
