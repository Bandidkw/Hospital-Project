<template>
  <nav class="bg-white py-1 text-my-custom-gray shadow-lg relative z-50">
    <div class="container mx-auto flex justify-between items-center h-16 px-4">
      <router-link to="/" class="flex items-center space-x-3 shrink-0">
        <img src="/src/assets/MTH-Logo/logo.png" alt="Hospital Logo" class="h-14 w-14" />
        <div class="hidden lg:block">
          <h1 class="text-xl font-bold text-my-custom-green">โรงพยาบาลแม่แตง</h1>
          <p class="text-sm text-my-custom-green">Maetaeng Hospital</p>
        </div>
      </router-link>

      <div class="hidden md:flex h-full items-center">
        <RouterLink
          to="/"
          class="space-x-2 flex items-center px-4 py-2 hover:text-teal-600 transition"
        >
          <i class="fas fa-home"></i>
          <span class="md:text-sm lg:text-base">หน้าแรก</span>
        </RouterLink>

        <div v-for="menu in menuItems" :key="menu.key" class="relative h-full flex items-center">
          <button
            @click="toggleDropdown(menu.key)"
            class="flex items-center space-x-2 px-4 py-2 hover:text-teal-600 transition"
            :aria-expanded="isDropdownOpen[menu.key]"
          >
            <i :class="menu.icon"></i>
            <span class="md:text-sm lg:text-base">{{ menu.title }}</span>
            <i
              class="fas text-xs ml-1 transition-transform duration-300"
              :class="isDropdownOpen[menu.key] ? 'fa-chevron-up' : 'fa-chevron-down'"
            ></i>
          </button>
          <div
            v-if="isDropdownOpen[menu.key]"
            class="absolute bg-white text-my-custom-gray rounded-md shadow-lg py-2 mt-2 w-56 z-50 top-full left-0"
            @click.stop
          >
            <RouterLink
              v-for="item in menu.items"
              :key="item.label"
              :to="item.to"
              class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              @click="closeAllDropdowns()"
            >
              <i :class="item.icon"></i>
              <span>{{ item.label }}</span>
            </RouterLink>
          </div>
        </div>

        <RouterLink
          to="/ita-documents-public"
          class="space-x-2 flex items-center px-4 py-2 hover:text-teal-600 transition"
        >
          <i class="fas fa-award"></i>
          <span class="md:text-sm lg:text-base">ITA</span>
        </RouterLink>

        <div class="relative h-full flex items-center">
          <button
            @click="toggleDropdown('staff')"
            class="space-x-2 flex items-center px-4 py-2 hover:text-teal-600 transition cursor-pointer focus:outline-none"
            :aria-expanded="isDropdownOpen.staff"
          >
            <i class="fas fa-user-circle"></i>
            <span class="md:text-sm lg:text-base">เจ้าหน้าที่</span>
            <i
              class="fas text-xs ml-1 transition-transform duration-300"
              :class="isDropdownOpen.staff ? 'fa-chevron-up' : 'fa-chevron-down'"
            ></i>
          </button>
          <div
            v-if="isDropdownOpen.staff"
            class="absolute bg-white text-my-custom-gray rounded-md shadow-lg py-2 mt-2 w-60 z-50 top-full right-0"
            @click.stop
          >
            <template v-if="authStore.isAuthenticated">
              <div class="block px-4 py-2 text-my-custom-gray font-semibold">
                <i class="fas fa-user"></i> สวัสดี, {{ authStore.user?.username || 'ผู้ใช้งาน' }}
              </div>
              <hr class="my-1 border-gray-200" />
              <RouterLink
                to="/dashboard"
                class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2"
                @click="closeAllDropdowns()"
              >
                <i class="fas fa-desktop"></i><span>แผงควบคุมเว็บไซต์</span>
              </RouterLink>
              <a
                href="https://11123.gtwoffice.com/login"
                target="_blank"
                class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2"
                @click="closeAllDropdowns()"
              >
                <i class="fas fa-external-link-alt"></i><span>ระบบ Back Office</span>
              </a>
              <hr class="my-1 border-gray-200" />
              <a
                href="#"
                class="block px-4 py-2 text-my-custom-gray hover:bg-red-100 flex items-center space-x-2"
                @click.prevent="handleLogout"
              >
                <i class="fas fa-sign-out-alt"></i><span>ออกจากระบบ</span>
              </a>
            </template>
            <template v-else>
              <a
                href="http://10.0.0.5/portal"
                target="_blank"
                class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2"
                @click="closeAllDropdowns()"
              >
                <i class="fas fa-external-link-alt"></i><span>บริการของเรา</span>
              </a>
              <a
                href="#"
                class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2"
                @click.prevent="openLoginModal"
              >
                <i class="fas fa-sign-in-alt"></i><span>เข้าสู่ระบบ</span>
              </a>
            </template>
          </div>
        </div>
      </div>

      <div class="md:hidden">
        <button @click="toggleMobileMenu" class="text-my-custom-gray focus:outline-none">
          <i :class="isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'" class="text-2xl"></i>
        </button>
      </div>
    </div>

    <div v-if="isMobileMenuOpen" class="md:hidden bg-white px-4 py-2 border-t border-gray-200">
      <RouterLink
        to="/"
        class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2"
        @click="closeAllDropdowns()"
      >
        <i class="fas fa-home"></i> <span>หน้าแรก</span>
      </RouterLink>

      <template v-for="menu in menuItems" :key="menu.key">
        <div
          class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
          @click="toggleDropdown(menu.key)"
        >
          <i :class="menu.icon"></i>
          <span>{{ menu.title }}</span>
          <i
            class="fas text-xs ml-auto transition-transform duration-300"
            :class="isDropdownOpen[menu.key] ? 'fa-chevron-up' : 'fa-chevron-down'"
          ></i>
        </div>
        <div v-if="isDropdownOpen[menu.key]" class="bg-gray-100 pl-6">
          <RouterLink
            v-for="item in menu.items"
            :key="item.label"
            :to="item.to"
            class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2"
            @click="closeAllDropdowns()"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </RouterLink>
        </div>
      </template>

      <RouterLink
        to="/ita-documents-public"
        class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2"
        @click="closeAllDropdowns()"
      >
        <i class="fas fa-award"></i> <span>ITA</span>
      </RouterLink>
      <div
        class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
        @click="toggleDropdown('staff')"
      >
        <i class="fas fa-user-circle"></i> <span>เจ้าหน้าที่</span>
        <i
          class="fas text-xs ml-auto transition-transform duration-300"
          :class="isDropdownOpen.staff ? 'fa-chevron-up' : 'fa-chevron-down'"
        ></i>
      </div>
      <div v-if="isDropdownOpen.staff" class="bg-gray-100 pl-6">
        <template v-if="authStore.isAuthenticated">
          <div class="block px-4 py-2 text-my-custom-gray font-semibold">
            <i class="fas fa-user"></i> สวัสดี, {{ authStore.user?.username || 'ผู้ใช้งาน' }}
          </div>
          <hr class="my-1 border-gray-200" />
          <RouterLink
            to="/dashboard"
            class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2"
            @click="closeAllDropdowns()"
          >
            <i class="fas fa-desktop"></i><span>แผงควบคุม</span>
          </RouterLink>
          <a
            href="#"
            class="block px-4 py-2 text-my-custom-gray hover:bg-red-100 flex items-center space-x-2"
            @click.prevent="handleLogout"
          >
            <i class="fas fa-sign-out-alt"></i><span>ออกจากระบบ</span>
          </a>
        </template>
        <template v-else>
          <a
            href="#"
            class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2"
            @click.prevent="openLoginModal"
          >
            <i class="fas fa-sign-in-alt"></i><span>เข้าสู่ระบบ</span>
          </a>
        </template>
      </div>
    </div>
  </nav>

  <LoginModal v-model:isOpen="isLoginModalOpen" @loginSuccess="handleLoginSuccess" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, reactive } from 'vue'
import { RouterLink, useRoute, type RouteLocationRaw } from 'vue-router'
import LoginModal from './LoginModal.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { CATEGORY_LIST } from '@/features/news/categories'

// --- Data Structure for Menus ---
type MenuKey = 'about' | 'services' | 'news' | 'complaint'
type DropdownState = Record<MenuKey | 'staff', boolean>

type MenuItem = {
  key: MenuKey
  title: string
  icon: string
  items: { label: string; icon: string; to: RouteLocationRaw }[]
}

const menuItems: MenuItem[] = [
  {
    key: 'about',
    title: 'ข้อมูลโรงพยาบาล',
    icon: 'fas fa-hospital',
    items: [
      { label: 'ประวัติโรงพยาบาล', icon: 'fas fa-history', to: { path: '/history' } },
      { label: 'วิสัยทัศน์/พันธกิจ', icon: 'fas fa-eye', to: { path: '/vision' } },
      { label: 'บุคลากร', icon: 'fas fa-users', to: { path: '/personnel' } },
    ],
  },
  {
    key: 'services',
    title: 'บริการ',
    icon: 'fas fa-concierge-bell',
    items: [
      { label: 'คลินิกผู้ป่วยนอก', icon: 'fas fa-stethoscope', to: { path: '/outpatient' } },
      { label: 'ผู้ป่วยใน', icon: 'fas fa-bed', to: { path: '/inpatient' } },
      { label: 'ห้องฉุกเฉิน', icon: 'fas fa-ambulance', to: { path: '/emergency' } },
      { label: 'ส่งตัวผู้ป่วย', icon: 'fas fa-exchange-alt', to: { path: '/patient-referral' } },
      { label: 'ติดตามสถานะ', icon: 'fas fa-tasks', to: { path: '/status' } },
    ],
  },
  {
    key: 'news',
    title: 'ข่าวสาร',
    icon: 'fas fa-newspaper',
    items: [
      { label: 'ข่าวทั้งหมด', icon: 'far fa-newspaper', to: { name: 'public-news' } },
      ...CATEGORY_LIST.filter((cat) => cat.key !== 'general').map((cat) => ({
        label: cat.label,
        icon: 'fas fa-tag',
        to: { name: 'public-news', query: { category: cat.key } },
      })),
    ],
  },
  {
    key: 'complaint',
    title: 'ข้อร้องเรียน',
    icon: 'fas fa-bullhorn',
    items: [{ label: 'ร้องเรียน', icon: 'fas fa-headset', to: { path: '/complaint-form' } }],
  },
]

// --- Component State ---
const isMobileMenuOpen = ref(false)
const isDropdownOpen = reactive<DropdownState>({
  about: false,
  services: false,
  news: false,
  staff: false,
  complaint: false,
})
const isLoginModalOpen = ref(false)

const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

// --- Methods ---
const toggleDropdown = (menu: keyof DropdownState) => {
  const currentState = isDropdownOpen[menu]
  Object.keys(isDropdownOpen).forEach((key) => {
    isDropdownOpen[key as keyof DropdownState] = false
  })
  isDropdownOpen[menu] = !currentState
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (!isMobileMenuOpen.value) {
    closeAllDropdowns()
  }
}

const closeAllDropdowns = () => {
  Object.keys(isDropdownOpen).forEach((key) => {
    isDropdownOpen[key as keyof DropdownState] = false
  })
  isMobileMenuOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const navbarElement = document.querySelector('nav')
  if (navbarElement && !navbarElement.contains(event.target as Node)) {
    closeAllDropdowns()
  }
}

const openLoginModal = () => {
  closeAllDropdowns()
  isLoginModalOpen.value = true
}

const handleLoginSuccess = () => {
  // Can add logic here, e.g., show a welcome toast
}

const handleLogout = () => {
  closeAllDropdowns()
  authStore.logout()
  toast.info('ออกจากระบบเรียบร้อยแล้ว')
}

// --- Lifecycle & Watchers ---
watch(() => route.path, closeAllDropdowns)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Scoped styles can go here if needed */
</style>
