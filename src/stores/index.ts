import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
const pinia = createPinia()

pinia.use(persist)

export default pinia

// 导入所有的成员，再全部导出去
export * from './user'
export * from './consult'
