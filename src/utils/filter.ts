import type { IllnessTime } from '@/enum'
import { timeOptions, flagOptions } from '@/services/constants'

export const getIllnessTimeText = (time?: IllnessTime) => {
  return timeOptions.find((item) => item.value === time)?.label
}
export const getConsultFlagText = (flag?: 0 | 1) => {
  return flagOptions.find((item) => item.value === flag)?.label
}
