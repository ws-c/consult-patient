import CpNavBar from '@/components/CpNavBar.vue'
import CpIcon from '@/components/CpIcon.vue'
import CpRadioBtn from '@/components/CpRadioBtn.vue'
import CpConsultMore from '@/components/CpConsultMore.vue'
import CpPaySheet from '@/components/CpPaySheet.vue'
declare module 'vue' {
  interface GlobalComponents {
    // 指定组件类型，typeof 从组件对象得到类型，设置给全局组件：CpNavBar
    CpNavBar: typeof CpNavBar
    CpIcon: typeof CpIcon
    CpRadioBtn: typeof CpRadioBtn
    CpConsultMore: typeof CpConsultMore
    CpPaySheet: typeof CpPaySheet
  }
}
