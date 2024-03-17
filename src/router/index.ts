import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
// /login	1	登录
// /	1	布局容器
// /user	②	个人中心
// /user/patient	1	家庭档案
// /user/address	1	地址管理
// /home	②	首页
// /consult/fast	1	快速问诊
// /consult/dep	1	选择科室
// /consult/illness	1	病情描述
// /consult/pay	1	问诊支付
// /room	1	问诊室
// /user/consult	1	我的问诊
// /user/consult/:id	1	问诊详情
// /order/pay	1	药品订单支付
// /order/pay/result	1	药品订单支付结果
// /order	1	药品订单列表
// /order/:id	1	药品订单详情
// /order/logistics/:id	1	药品订单物流
// /login/callback	1	QQ登录回跳
// /article	②	健康百科
// /notify	②	消息通知
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: { title: '首页' }
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: { title: '健康百科' }
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: { title: '消息通知' }
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: { title: '个人中心' }
        }
      ]
    }
  ]
})

// 访问权限控制
router.beforeEach((to) => {
  document.title = `${to.meta.title} | 医疗平台`
  const store = useUserStore()
  const whiteList = ['/login']
  // 如果没有登录且不在白名单内，去登录
  if (!store.user?.token && !whiteList.includes(to.path)) return '/login'
  // 否则不做任何处理
})

export default router
