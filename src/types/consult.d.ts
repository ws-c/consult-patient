// 文章类型，关注医生的文章|推荐的文章|减脂|饮食
export type KnowledgeType = 'like' | 'recommend' | 'fatReduction' | 'food'
// 文章信息类型
export type Knowledge = {
  id: string
  title: string
  coverUrl: string[]
  topics: string[]
  collectionNumber: number
  commentNumber: number
  creatorName: string
  creatorAvatar: string
  creatorHospatalName: string
  likeFlag: 0 | 1
  content: string
  creatorDep: string
  creatorTitles: string
  creatorId: string
}

// 文章列表
export type KnowledgeList = Knowledge[]

// 文章列表带分页
export type KnowledgePage = {
  pageTotal: number
  total: number
  rows: KnowledgeList
}

// 文章列表查询参数
export type KnowledgeParams = {
  type: KnowledgeType
  current: number
  pageSize: number
}
// 通用的分页查询参数
export type PageParams = {
  // 当前页码
  current: number
  // 每页条数
  pageSize: number
}

// 文章列表查询参数
export type KnowledgeParams = PageParams & {
  // 文章类型
  type: KnowledgeType
}

// 医生卡片对象
export type Doctor = {
  // 医生ID
  id: string
  // 医生名称
  name: string
  // 头像
  avatar: string
  // 医院名称
  hospitalName: string
  // 医院等级
  gradeName: string
  // 科室
  depName: string
  // 职称
  positionalTitles: string
  // 是否关注，0 未关注 1 已关注
  likeFlag: 0 | 1
  // 接诊服务费
  serviceFee: number
  // 接诊人数
  consultationNum: number
  // 评分
  score: number
  // 主攻方向
  major: string
}

// 医生列表
export type DoctorList = Doctor[]

// 医生分页
export type DoctorPage = {
  pageTotal: number
  total: number
  rows: DoctorList
}
// 关注的类型，医生|文章|百科话题|疾病
export type FollowType = 'doc' | 'knowledge' | 'topic' | 'disease'
