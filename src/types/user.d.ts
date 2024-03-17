/* 用户信息 */
export type User = {
  /* token令牌 */
  token: string
  /* 用户ID */
  id: string
  /* 用户名称 */
  account: string
  /* 手机号 */
  mobile: string
  /* 头像 */
  avatar: string
}
// 个人信息
type OmitUser = Omit<User, 'token'>
export type UserInfo = OmitUser & {
  likeNumber: number
  collectionNumber: number
  score: number
  couponNumber: number
  orderInfo: {
    paidNumber: number
    receivedNumber: number
    shippedNumber: number
    finishedNumber: number
  }
}
// 短信验证码类型，登录|注册|修改手机号|忘记密码|绑定手机号
export type CodeType =
  | 'login'
  | 'register'
  | 'changeMobile'
  | 'forgetPassword'
  | 'bindMobile'
// 家庭档案-患者信息
export type Patient = {
  // 患者ID
  id: string
  // 患者名称
  name: string
  // 身份证号
  idCard: string
  // 0不默认  1默认
  defaultFlag: 0 | 1
  // 0 女  1 男
  gender: 0 | 1
  // 性别文字
  genderValue: string
  // 年龄
  age: number
}

// 家庭档案-患者信息列表
export type PatientList = Patient[]
