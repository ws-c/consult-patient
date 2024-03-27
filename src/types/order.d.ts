import type { Medical } from './room'

export type OrderPre = {
  // 处方ID
  id: string
  // 优惠券ID
  couponId: string
  // 积分抵扣
  pointDeduction: number
  // 优惠券抵扣
  couponDeduction: number
  // 应付款
  payment: number
  // 邮费
  expressFee: number
  // 实付款
  actualPayment: number
  // 药品订单
  medicines: Medical[]
}
export type Address = {
  // 地址ID
  id: string
  // 联系方式
  mobile: string
  // 收件人
  receiver: string
  // 省
  province: string
  // 市
  city: string
  // 区
  county: string
  // 详细地址
  addressDetail: string
}

// 订单列表
export type AddressItem = Address & {
  // 是否默认地址，0 不是 1 是
  isDefault: 0 | 1
  // 邮政编码
  postalCode: string
}
export type OrderDetail = {
  id: string
  orderNo: string
  type: 4
  createTime: string
  prescriptionId: string
  status: OrderType
  statusValue: string
  medicines: Medical[]
  countDown: number
  addressInfo: Address
  expressInfo: {
    content: string
    time: string
  }
  payTime: string
  paymentMethod?: 0 | 1
  payment: number
  pointDeduction: number
  couponDeduction: number
  payment: number
  expressFee: number
  actualPayment: number
  roomId: string
}
export type Express = {
  // 物流信息ID
  id: string
  // 物流内容
  content: string
  // 创建时间
  createTime: string
  // 物流状态
  status: ExpressStatus
  // 状态文章
  statusValue: string
}

export type Location = {
  // 经度
  longitude: string
  // 纬度
  latitude: string
}

export type Logistics = {
  // 预计送达时间
  estimatedTime: string
  // 物流公司名称
  name: string
  // 物流编号
  awbNo: string
  // 最新物流状态
  status: ExpressStatus
  // 最新物流状态文字
  statusValue: string
  // 物流信息数组
  list: Express[]
  // 轨迹信息数组
  logisticsInfo: Location[]
  // 当前运输位置
  currentLocationInfo: Location
}
