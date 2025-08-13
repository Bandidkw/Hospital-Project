// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification' // นำเข้า Toast
import 'vue-toastification/dist/index.css' // นำเข้า CSS ของ Toast
import { useAuthStore } from './stores/auth'

// นำเข้า Tailwind CSS (ถ้ายังไม่ได้ทำ)
import './assets/main.css' // ตรวจสอบให้แน่ใจว่าไฟล์นี้มี @tailwind base; @tailwind components; @tailwind utilities;

// นำเข้า FontAwesome (ถ้ายังไม่ได้ทำ)
import '@fortawesome/fontawesome-free/css/all.css'

// นำเข้า Pinia (ถ้ายังไม่ได้ทำและใช้)
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(router)

// ตั้งค่า Pinia (ถ้ายังไม่ได้ทำ)
app.use(createPinia())

// --- 2. เพิ่มกฎเหล็กตอนตื่นนอน! ---
const authStore = useAuthStore()
authStore.fetchUser() // สั่งให้อ่านโพสต์อิททันที!
// ------------------------------------

// ตั้งค่า Toastification
const toastOptions = {
  // ตำแหน่งของการแจ้งเตือน: 'top-center' จะอยู่กลางด้านบน
  // หากต้องการให้กลางจอเป๊ะๆ (แต่อาจจะทับเนื้อหา) อาจจะต้องใช้ CSS กำหนดเองเพิ่มเติม
  position: 'top-center',
  timeout: 3000, // แสดงผล 3 วินาที
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__fade',
  maxToasts: 5, // จำนวน Toast ที่แสดงพร้อมกันสูงสุด
  newestOnTop: true, // Toast ใหม่ล่าสุดจะอยู่ด้านบน
}

app.use(Toast, toastOptions) // ใช้ plugin Toast พร้อม options ที่กำหนด

app.mount('#app')
