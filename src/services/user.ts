import type { CodeType, PatientList, User, UserInfo } from '@/types/user'
import { request } from '@/utils/request'

// 密码登录
export const loginByPassword = (mobile: string, password: string) =>
  request<User>('/login/password', 'POST', { mobile, password })

// 发送验证码
export const sendMobileCode = (mobile: string, type: CodeType) =>
  request<any>('/code', 'GET', { mobile, type })
// 验证码登录
export const loginByCode = (mobile: string, code: string) =>
  request<User>('/login', 'POST', { mobile, code })
// 获取个人信息
export const getUserInfo = () => request<UserInfo>('/patient/myUser')
// 获患者信息列表
export const getPatientList = () => request<PatientList>('/patient/mylist')
