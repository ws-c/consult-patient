<script setup lang="ts">
import {
  getPatientList,
  addPatient,
  editPatient,
  delPatient
} from '@/services/user'
import type { PatientList, Patient } from '@/types/user'
import { onMounted, ref, computed } from 'vue'
import CpRadioBtn from '@/components/CpRadioBtn.vue'
import { showToast, showConfirmDialog } from 'vant'
import Validator from 'id-validator'
import { useRoute, useRouter } from 'vue-router'
import { useConsultStore } from '@/stores'
const list = ref<PatientList>([])
const loadList = async () => {
  const res = await getPatientList()
  list.value = res.data
  selectedDefaultPatient()
}
onMounted(() => {
  loadList()
})
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]

const showRight = ref(false)
const onShowRight = (item?: Patient) => {
  if (item) {
    const { id, gender, name, idCard, defaultFlag } = item
    patient.value = { id, gender, name, idCard, defaultFlag }
  } else {
    patient.value = { ...initPatient }
  }
  showRight.value = true
}
const onCloseRight = () => {
  showRight.value = false
}
const initPatient: Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}
// 添加和编辑患者
const patient = ref<Patient>({ ...initPatient })
// 默认值需要转换
const defaultFlag = computed({
  get() {
    return patient.value.defaultFlag === 1 ? true : false
  },
  set(value) {
    patient.value.defaultFlag = value ? 1 : 0
  }
})
const onSave = async () => {
  if (!patient.value.name) return showToast('请输入真实姓名')
  if (!patient.value.idCard) return showToast('请输入身份证号')
  const validate = new Validator()
  if (!validate.isValid(patient.value.idCard))
    return showToast('身份证格式错误')
  const { sex } = validate.getInfo(patient.value.idCard)
  if (patient.value.gender !== sex) return showToast('性别和身份证不符')
  // 发送请求
  // 添加 & 修改
  patient.value.id
    ? await editPatient(patient.value)
    : await addPatient(patient.value)
  showRight.value = false
  loadList()
  showToast(patient.value.id ? '编辑成功' : '添加成功')
}
//删除患者
const remove = async () => {
  if (patient.value.id) {
    await showConfirmDialog({
      title: '温馨提示',
      message: `您确认要删除 ${patient.value.name} 患者信息吗 ？`,
      cancelButtonText: '取消',
      confirmButtonText: '确认'
    })
    await delPatient(patient.value.id)
    showRight.value = false
    loadList()
    showToast('删除成功')
  }
}
// 选中患者
const route = useRoute()
const patientId = ref<string>()
const selectedPatient = (item: Patient) => {
  if (isChange.value) {
    patientId.value = item.id
  }
}
const selectedDefaultPatient = () => {
  if (isChange.value && list.value.length) {
    const defPatient = list.value.find((item) => item.defaultFlag === 1)
    if (defPatient) {
      patientId.value = defPatient.id
    } else {
      patientId.value = list.value[0].id
    }
  }
}
const isChange = computed(() => route.query.isChange === '1')
// 下一步
const router = useRouter()
const store = useConsultStore()
const next = () => {
  if (!patientId.value) return showToast('请选择患者')
  // 跳转到问诊页面
  route.query.patientId = patientId.value
  // route.query.isChange = '0'
  store.setPatient(patientId.value)
  router.push('/consult/pay')
}
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar :title="isChange ? '选择患者' : '患者列表'"></cp-nav-bar>
    <div class="patient-change" v-if="isChange">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>
    <div class="patient-list">
      <div
        class="patient-item"
        v-for="item in list"
        :key="item.id"
        @click="selectedPatient(item)"
        :class="{ selected: patientId === item.id }"
      >
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{
            item.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '\$1******\$2')
          }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon">
          <cp-icon name="user-edit" @click="onShowRight(item)" />
        </div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <div class="patient-add" @click="onShowRight()" v-if="list.length < 6">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加6位患者</div>
    </div>
    <!-- 底部按钮 -->
    <div class="patient-next" v-if="isChange">
      <van-button type="primary" @click="next" round block>下一步</van-button>
    </div>
    <!--弹出框-->
    <van-popup v-model:show="showRight" position="right">
      <cp-nav-bar
        :back="onCloseRight"
        :title="patient.id ? '编辑患者' : '添加患者'"
        right-text="保存"
        @click-right="onSave"
      ></cp-nav-bar>
      <van-form autocomplete="off" style="margin-top: 50px">
        <van-field
          v-model="patient.name"
          label="真实姓名"
          placeholder="请输入真实姓名"
        />
        <van-field
          v-model="patient.idCard"
          label="身份证号"
          placeholder="请输入身份证号"
        />
        <van-field label="性别">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn
              v-model="patient.gender"
              :options="options"
            ></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox v-model="defaultFlag" round />
          </template>
        </van-field>
      </van-form>
      <van-action-bar v-if="patient.id">
        <van-action-bar-button @click="remove">删除</van-action-bar-button>
      </van-action-bar>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  ::v-deep() {
    .van-popup {
      width: 100%;
      height: 100%;
    }
    .van-action-bar {
      padding: 0 10px;
      margin-bottom: 10px;
      .van-button {
        color: var(--cp-price);
        background-color: var(--cp-bg);
      }
    }
  }
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
.patient-change {
  padding: 15px;
  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }
  > p {
    color: var(--cp-text3);
  }
}
.patient-next {
  padding: 15px;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
}
</style>
