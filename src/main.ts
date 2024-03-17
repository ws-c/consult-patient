import { createApp } from 'vue'
import pinia from './stores'
import './styles/main.scss'
import 'vant/lib/index.css'
import './styles/main.scss'
import App from './App.vue'
import router from './router'
import 'virtual:svg-icons-register'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
