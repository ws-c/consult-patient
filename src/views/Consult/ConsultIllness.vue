<script setup lang="ts">
import type { ConsultIllness, Image } from '@/types/consult'
import { ref, computed, onMounted } from 'vue'
import { IllnessTime } from '@/enum'
import type {
  UploaderAfterRead,
  UploaderFileListItem
} from 'vant/lib/uploader/types'
import { uploadImage } from '@/services/consult'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { useConsultStore } from '@/stores'
const timeOptions = [
  { label: '一周内', value: IllnessTime.Week },
  { label: '一月内', value: IllnessTime.Month },
  { label: '半年内', value: IllnessTime.HalfYear },
  { label: '大于半年', value: IllnessTime.More }
]
const flagOptions = [
  { label: '就诊过', value: 0 },
  { label: '没就诊过', value: 1 }
]
const form = ref<ConsultIllness>({
  illnessDesc: '',
  illnessTime: undefined,
  consultFlag: undefined,
  pictures: []
})
const fileList = ref<Image[]>([])
const onAfterRead: UploaderAfterRead = (item) => {
  // TODO 上传图片
  // 选择一个图就是item，选择多个图就是item[]
  if (Array.isArray(item)) return
  if (!item.file) return
  uploadImage(item.file)
    .then((res) => {
      item.status = 'done'
      item.message = undefined
      item.url = res.data.url
      form.value.pictures?.push(res.data)
    })
    .catch(() => {
      item.status = 'failed'
      item.message = '上传失败'
    })
}
const onDeleteImg = (item: UploaderFileListItem) => {
  form.value.pictures = form.value.pictures?.filter(
    (pic) => pic.url !== item.url
  )
}
const disabled = computed(() => {
  return (
    !form.value.illnessDesc ||
    !form.value.pictures?.length ||
    !form.value.illnessTime ||
    form.value.consultFlag === undefined
  )
})
const store = useConsultStore()
const router = useRouter()
const next = () => {
  // TODO 下一步
  if (!form.value.illnessDesc) return showToast('请输入病情描述')
  if (form.value.illnessTime === undefined)
    return showToast('请选择症状持续时间')
  if (form.value.consultFlag === undefined)
    return showToast('请选择是否已经就诊')
  store.setIllness(form.value)
  // 跳转档案管理，需要根据 isChange 实现选择功能
  router.push('/user/patient?isChange=1')
}

onMounted(() => {
  // 获取问诊信息
  if (store.consult.illnessDesc) {
    showConfirmDialog({
      title: '温馨提示',
      message: '是否恢复您之前填写的病情信息呢？',
      confirmButtonColor: 'var(--cp-primary)'
    }).then(() => {
      // 确认
      const { illnessDesc, illnessTime, consultFlag, pictures } = store.consult
      form.value = { illnessDesc, illnessTime, consultFlag, pictures }
      fileList.value = pictures || []
    })
  }
})
</script>

<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="图文问诊" />
    <!-- 医生提示 -->
    <div class="illness-tip van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">
          请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助
        </p>
        <p class="safe">
          <cp-icon name="consult-safe" /><span>内容仅医生可见</span>
        </p>
      </div>
    </div>
    <!-- 表单 -->
    <div class="illness-form">
      <van-field
        type="textarea"
        rows="3"
        placeholder="请详细描述您的病情，病情描述不能为空"
        v-model="form.illnessDesc"
      ></van-field>
      <div class="item">
        <p>本次患病多久了？</p>
        <cp-radio-btn :options="timeOptions" v-model="form.illnessTime" />
      </div>
      <div class="item">
        <p>此次病情是否去医院就诊过？</p>
        <cp-radio-btn :options="flagOptions" v-model="form.consultFlag" />
      </div>
    </div>
    <div class="illness-img">
      <van-uploader
        :after-read="onAfterRead"
        @delete="onDeleteImg"
        v-model="fileList"
        max-count="9"
        :max-size="5 * 1024 * 1024"
        upload-icon="photo-o"
        upload-text="上传图片"
      ></van-uploader>
      <p class="tip" v-if="!fileList.length">
        上传内容仅医生可见,最多9张图,最大5MB
      </p>
    </div>
    <van-button :class="{ disabled }" @click="next" type="primary" block round
      >下一步
    </van-button>
  </div>
</template>

<style lang="scss" scoped>
.consult-illness-page {
  padding-top: 46px;
  .illness-tip {
    display: flex;
    padding: 15px;
    .img {
      width: 52px;
      height: 52px;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 10px;
    }
    .info {
      flex: 1;
      padding-left: 12px;
      .tit {
        font-size: 16px;
        margin-bottom: 5px;
      }
      .tip {
        padding: 12px;
        background: var(--cp-bg);
        color: var(--cp-text3);
        font-size: 13px;
        margin-bottom: 10px;
      }
      .safe {
        font-size: 10px;
        color: var(--cp-text3);
        display: flex;
        align-items: center;
        .cp-icon {
          font-size: 12px;
          margin-right: 2px;
        }
      }
    }
  }
  .illness-form {
    padding: 15px;
    .van-field {
      padding: 0;
      &::after {
        border-bottom: none;
      }
    }
    .item {
      > p {
        color: var(--cp-text3);
        padding: 15px 0;
      }
    }
  }
  .illness-img {
    padding-top: 16px;
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    .tip {
      font-size: 12px;
      color: var(--cp-tip);
    }
    ::v-deep() {
      .van-uploader {
        &__preview {
          &-delete {
            left: -6px;
            top: -6px;
            border-radius: 50%;
            background-color: var(--cp-primary);
            width: 20px;
            height: 20px;
            &-icon {
              transform: scale(0.9) translate(-22%, 22%);
            }
          }
          &-image {
            border-radius: 8px;
            overflow: hidden;
          }
        }
        &__upload {
          border-radius: 8px;
        }
        &__upload-icon {
          color: var(--cp-text3);
        }
      }
    }
  }
  .van-button {
    font-size: 16px;
    margin-bottom: 20px;
    &.disabled {
      opacity: 1;
      background: #fafafa;
      color: #d9dbde;
      border: #fafafa;
    }
  }
}
</style>
