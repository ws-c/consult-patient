<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { showToast, type FormInstance } from 'vant'
import { loginByPassword, sendMobileCode, loginByCode } from '@/services/user'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const agree = ref(false)
const phone = ref()
const password = ref('')
const show = ref(false)
// 表单提交
const onSubmit = async () => {
  if (!agree.value) {
    showToast('请勾选同意')
  }
  const res = isPass.value
    ? await loginByPassword(phone.value, password.value)
    : await loginByCode(phone.value, code.value)
  const store = useUserStore()
  store.setUser(res.data)
  router.replace((route.query.returnUrl as string) || '/user')
  showToast('登录成功')
  console.log(res.data)
}
// 发送验证码
const isPass = ref(true)
const code = ref('')
const form = ref<FormInstance | null>(null)
const time = ref(0)
let timeId: number
const send = async () => {
  if (time.value > 0) return
  await form.value?.validate('手机号')
  const res = await sendMobileCode(phone.value, 'login')
  code.value = res.data.code
  time.value = 60
  timeId = setInterval(() => {
    time.value--
    if (time.value <= 0) {
      clearInterval(timeId)
    }
  }, 1000)
  showToast('发送成功')
}
onUnmounted(() => {
  clearInterval(timeId)
})
</script>

<template>
  <div class="login-page">
    <cp-nav-bar
      right-text="注册"
      @click-right="$router.push('/register')"
    ></cp-nav-bar>
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;">
        <span @click="isPass = !isPass">{{
          !isPass ? '密码登录' : '短信验证码登录'
        }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- form 表单 -->
    <van-form autocomplete="off" @submit="onSubmit">
      <van-field
        v-model="phone"
        placeholder="请输入手机号"
        type="tel"
        name="手机号"
        :rules="mobileRules"
      ></van-field>
      <van-field
        v-if="isPass"
        v-model="password"
        placeholder="请输入密码"
        name="密码"
        :type="`${show ? 'password' : 'text'}`"
        :rules="passwordRules"
      >
        <template #button>
          <cp-icon
            @click="show = !show"
            :name="`login-eye-${show ? 'on' : 'off'}`"
          ></cp-icon>
        </template>
      </van-field>
      <van-field
        v-else
        v-model="code"
        :rules="codeRules"
        placeholder="短信验证码"
      >
        <template #button>
          <span class="btn-send" @click="send">{{
            time === 0 ? '发送验证码' : time
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit"
          >登 录
        </van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }

  &-head {
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;

    h3 {
      font-weight: normal;
      font-size: 24px;
    }

    a {
      font-size: 15px;
    }
  }

  &-other {
    margin-top: 60px;
    padding: 0 30px;

    .icon {
      display: flex;
      justify-content: center;

      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}

.van-form {
  padding: 0 14px;

  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    &:active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
