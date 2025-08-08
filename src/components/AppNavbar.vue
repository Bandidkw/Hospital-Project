<template>
  <nav class="bg-white py-4 text-my-custom-gray shadow-lg relative z-50">
    <div class="container mx-auto flex justify-between items-center h-16 px-4">
      <div class="flex items-center h-full">
        <router-link to="/"
          ><img src="/src/assets/MTH-Logo/logo.png" alt="Hospital Logo" class="h-24 w-24 p-3 m-0"
        /></router-link>
        <div>
          <router-link to="/">
            <h1 class="text-xl font-bold text-my-custom-green">โรงพยาบาลแม่แตง</h1>
            <p class="text-sm text-my-custom-green">Maetaeng Hospital</p>
          </router-link>
        </div>
      </div>

      <div class="hidden md:flex h-full items-center">
        <RouterLink
          to="/"
          class="space-x-2 flex items-center px-4 py-2 hover:text-blue-600 transition duration-300"
        >
          <i class="fas fa-home"></i>
          <span>หน้าแรก</span>
        </RouterLink>

        <div class="relative h-full flex items-center">
          <button
            @click="toggleDropdown('about')"
            class="flex items-center space-x-2 px-4 py-2 hover:text-blue-600 transition duration-300 cursor-pointer focus:outline-none"
            :aria-expanded="isDropdownOpen.about"
          >
            <i class="fas fa-hospital"></i>
            <span>ข้อมูลโรงพยาบาล</span>
            <i
              :class="{
                'fas fa-chevron-down': !isDropdownOpen.about,
                'fas fa-chevron-up': isDropdownOpen.about,
              }"
              class="text-xs ml-1 transition-transform duration-300"
            ></i>
          </button>
          <div
            v-if="isDropdownOpen.about"
            class="absolute bg-white text-my-custom-gray rounded-md shadow-lg py-2 mt-2 w-48 z-50 top-full left-0"
            @click.stop
          >
            <RouterLink
              to="/history"
              class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              @click="closeAllDropdowns()"
            >
              <i class="fas fa-history"></i><span>ประวัติโรงพยาบาล</span>
            </RouterLink>
            <RouterLink
              to="/vision"
              class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              @click="closeAllDropdowns()"
            >
              <i class="fas fa-eye"></i><span>วิสัยทัศน์/พันธกิจ</span>
            </RouterLink>
            <RouterLink
              to="/personnel"
              class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              @click="closeAllDropdowns()"
            >
              <i class="fas fa-users"></i><span>บุคลากร</span>
            </RouterLink>
          </div>
        </div>

        <div class="relative h-full flex items-center">
          <button
            @click="toggleDropdown('services')"
            class="space-x-2 flex items-center px-4 py-2 hover:text-blue-600 transition duration-300 cursor-pointer focus:outline-none"
            :aria-expanded="isDropdownOpen.services"
          >
            <i class="fas fa-concierge-bell"></i>
            <span>บริการ</span>
            <i
              :class="{
                'fas fa-chevron-down': !isDropdownOpen.services,
                'fas fa-chevron-up': isDropdownOpen.services,
              }"
              class="text-xs ml-1 transition-transform duration-300"
            ></i>
          </button>
          <div
            v-if="isDropdownOpen.services"
            class="absolute bg-white text-my-custom-gray rounded-md shadow-lg py-2 mt-2 w-48 z-50 top-full left-0"
            @click.stop
          >
            <RouterLink
              to="/outpatient"
              class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              @click="closeAllDropdowns()"
            >
              <i class="fas fa-stethoscope"></i><span>คลินิกผู้ป่วยนอก</span>
            </RouterLink>
            <RouterLink
              to="/inpatient"
              class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              @click="closeAllDropdowns()"
            >
              <i class="fas fa-bed"></i><span>ผู้ป่วยใน</span>
            </RouterLink>
            <RouterLink
              to="/emergency"
              class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              @click="closeAllDropdowns()"
            >
              <i class="fas fa-ambulance"></i><span>ห้องฉุกเฉิน</span>
            </RouterLink>
          </div>
        </div>

        <RouterLink
          to="/news"
          class="space-x-2 flex items-center px-4 py-2 hover:text-blue-600 transition duration-300"
        >
          <i class="fas fa-newspaper"></i>
          <span>ข่าวสาร</span>
        </RouterLink>
        <RouterLink
          to="/ita-documents-public"
          class="space-x-2 flex items-center px-4 py-2 hover:text-blue-600 transition duration-300"
        >
          <i class="fas fa-award"></i>
          <span>ITA</span>
        </RouterLink>
        <RouterLink
          to="/contact"
          class="space-x-2 flex items-center px-4 py-2 hover:text-blue-600 transition duration-300"
        >
          <i class="fas fa-id-card"></i>
          <span>ติดต่อเรา</span>
        </RouterLink>
        <!-- ***** เมนู 'บริการอื่นๆ' พร้อม Dropdown (สำหรับ Desktop) - ย้ายมาที่นี่แล้ว ***** -->
        <!-- <div class="relative h-full flex items-center">
          <button
            @click="toggleDropdown('otherServices')"
            class="space-x-2 flex items-center px-4 py-2 hover:text-blue-600 transition duration-300 cursor-pointer focus:outline-none"
            :aria-expanded="isDropdownOpen.otherServices"
          >
            <i class="fas fa-ellipsis-h"></i>
            <span>บริการอื่นๆ</span>
            <i
              :class="{
                'fas fa-chevron-down': !isDropdownOpen.otherServices,
                'fas fa-chevron-up': isDropdownOpen.otherServices,
              }"
              class="text-xs ml-1 transition-transform duration-300"
            ></i>
          </button>
          <div
            v-if="isDropdownOpen.otherServices"
            class="absolute bg-white text-my-custom-gray rounded-md shadow-lg py-2 mt-2 w-48 z-50 top-full left-0"
            @click.stop
          >
            <RouterLink
              to="/some-internal-page"
              class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              @click="closeAllDropdowns()"
            >
              <i class="fas fa-info-circle"></i><span>หน้าข้อมูลภายใน</span>
            </RouterLink>
            <a
              href="https://11123.gtwoffice.com/login"
              target="_blank"
              class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              @click="closeAllDropdowns()"
              เจ้าหน้าที่
            >
              <i class="fas fa-link"></i><span>บริการเสริม 1</span>
            </a>
            <a
              href="http://10.0.0.5/portal/pm25.php"
              target="_blank"
              class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              @click="closeAllDropdowns()"
            >
              <i class="fas fa-link"></i><span>บริการเสริม 2</span>
            </a>
            <a
              href="https://ihimslink.cmhis.org/login"
              target="_blank"
              class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              @click="closeAllDropdowns()"
            >
              <i class="fas fa-link"></i><span>บริการเสริม 3</span>
            </a>
          </div>
        </div> -->
        <!-- ***** สิ้นสุดเมนู 'บริการอื่นๆ' ***** -->

        <div class="relative h-full flex items-center">
          <button
            @click="toggleDropdown('staff')"
            class="space-x-2 flex items-center px-4 py-2 hover:text-blue-600 transition duration-300 cursor-pointer focus:outline-none"
            :aria-expanded="isDropdownOpen.staff"
          >
            <i class="fas fa-user-circle"></i>
            <span>เจ้าหน้าที่</span>
            <i
              :class="{
                'fas fa-chevron-down': !isDropdownOpen.staff,
                'fas fa-chevron-up': isDropdownOpen.staff,
              }"
              class="text-xs ml-1 transition-transform duration-300"
            ></i>
          </button>
          <div
            v-if="isDropdownOpen.staff"
            class="absolute bg-white text-my-custom-gray rounded-md shadow-lg py-2 mt-2 w-48 z-50 top-full left-0"
            @click.stop
          >
            <template v-if="authStore.isAuthenticated">
              <div class="block px-4 py-2 text-my-custom-gray font-semibold">
                <i class="fas fa-user"></i> สวัสดี, {{ authStore.user?.username || 'ผู้ใช้งาน' }}
              </div>
              <a
                href="#"
                class="block px-4 py-2 text-my-custom-gray hover:bg-red-100 flex items-center space-x-2"
                @click.prevent="handleLogout"
              >
                <i class="fas fa-sign-out-alt"></i><span>ออกจากระบบ</span>
              </a>
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
              <hr class="my-1 border-gray-200" />
            </template>
          </div>
        </div>
      </div>

      <div class="md:hidden">
        <button @click="toggleMobileMenu" class="text-my-custom-gray focus:outline-none">
          <i class="fas fa-bars text-2xl"></i>
        </button>
      </div>
    </div>

    <!-- ***** Mobile Menu ***** -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-white px-4 py-2 border-t border-gray-200">
      <RouterLink
        to="/"
        class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2"
      >
        <i class="fas fa-home"></i> <span>หน้าแรก</span>
      </RouterLink>

      <div
        class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
        @click="toggleDropdown('about')"
      >
        <i class="fas fa-hospital"></i> <span>ข้อมูลโรงพยาบาล</span>
        <i
          :class="{
            'fas fa-chevron-down': !isDropdownOpen.about,
            'fas fa-chevron-up': isDropdownOpen.about,
          }"
          class="text-xs ml-auto transition-transform duration-300"
        ></i>
      </div>
      <div v-if="isDropdownOpen.about" class="bg-gray-100 pl-6">
        <RouterLink
          to="/history"
          class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2"
          @click="closeAllDropdowns()"
        >
          <i class="fas fa-history"></i><span>ประวัติโรงพยาบาล</span>
        </RouterLink>
        <RouterLink
          to="/vision"
          class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2"
          @click="closeAllDropdowns()"
        >
          <i class="fas fa-eye"></i><span>วิสัยทัศน์/พันธกิจ</span>
        </RouterLink>
        <RouterLink
          to="/organization"
          class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2"
          @click="closeAllDropdowns()"
        >
          <i class="fas fa-sitemap"></i><span>โครงสร้างองค์กร</span>
        </RouterLink>
        <RouterLink
          to="/personnel"
          class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2"
          @click="closeAllDropdowns()"
        >
          <i class="fas fa-users"></i><span>บุคลากร</span>
        </RouterLink>
      </div>

      <div
        class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
        @click="toggleDropdown('services')"
      >
        <i class="fas fa-concierge-bell"></i> <span>บริการ</span>
        <i
          :class="{
            'fas fa-chevron-down': !isDropdownOpen.services,
            'fas fa-chevron-up': isDropdownOpen.services,
          }"
          class="text-xs ml-auto transition-transform duration-300"
        ></i>
      </div>
      <div v-if="isDropdownOpen.services" class="bg-gray-100 pl-6">
        <RouterLink
          to="/outpatient"
          class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2"
          @click="closeAllDropdowns()"
        >
          <i class="fas fa-stethoscope"></i><span>คลินิกผู้ป่วยนอก</span>
        </RouterLink>
        <RouterLink
          to="/inpatient"
          class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2"
          @click="closeAllDropdowns()"
        >
          <i class="fas fa-bed"></i><span>ผู้ป่วยใน</span>
        </RouterLink>
        <RouterLink
          to="/emergency"
          class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2"
          @click="closeAllDropdowns()"
        >
          <i class="fas fa-ambulance"></i><span>ห้องฉุกเฉิน</span>
        </RouterLink>
      </div>

      <RouterLink
        to="/news"
        class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2"
      >
        <i class="fas fa-newspaper"></i> <span>ข่าวสาร</span>
      </RouterLink>
      <RouterLink
        to="/ita-documents-public"
        class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2"
      >
        <i class="fas fa-award"></i> <span>ITA</span>
      </RouterLink>
      <RouterLink
        to="/contact"
        class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2"
      >
        <i class="fas fa-id-card"></i> <span>ติดต่อเรา</span>
      </RouterLink>

      <!-- ***** เมนู 'บริการอื่นๆ' พร้อม Dropdown (สำหรับ Mobile) - ย้ายมาที่นี่แล้ว ***** -->
      <!-- <div
        class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
        @click="toggleDropdown('otherServices')"
      >
        <i class="fas fa-ellipsis-h"></i> <span>บริการอื่นๆ</span>
        <i
          :class="{
            'fas fa-chevron-down': !isDropdownOpen.otherServices,
            'fas fa-chevron-up': isDropdownOpen.otherServices,
          }"
          class="text-xs ml-auto transition-transform duration-300"
        ></i>
      </div> -->
      <!-- <div v-if="isDropdownOpen.otherServices" class="bg-gray-100 pl-6">
        <a
          href="https://example.com/other-service-1"
          target="_blank"
          class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2"
          @click="closeAllDropdowns()"
        >
          <i class="fas fa-link"></i><span>บริการเสริม 1 (Mobile)</span>
        </a>
        <a
          href="https://example.com/other-service-2"
          target="_blank"
          class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2"
          @click="closeAllDropdowns()"
        >
          <i class="fas fa-link"></i><span>บริการเสริม 2 (Mobile)</span>
        </a>
        <RouterLink
          to="/some-internal-page"
          class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2"
          @click="closeAllDropdowns()"
        >
          <i class="fas fa-info-circle"></i><span>หน้าข้อมูลภายใน (Mobile)</span>
        </RouterLink>
      </div> -->
      <!-- ***** สิ้นสุดเมนู 'บริการอื่นๆ' (Mobile) ***** -->

      <div
        class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
        @click="toggleDropdown('staff')"
      >
        <i class="fas fa-user-circle"></i> <span>เจ้าหน้าที่</span>
        <i
          :class="{
            'fas fa-chevron-down': !isDropdownOpen.staff,
            'fas fa-chevron-up': isDropdownOpen.staff,
          }"
          class="text-xs ml-auto transition-transform duration-300"
        ></i>
      </div>
      <div v-if="isDropdownOpen.staff" class="bg-gray-100 pl-6">
        <template v-if="authStore.isAuthenticated">
          <div class="block px-4 py-2 text-my-custom-gray font-semibold">
            <i class="fas fa-user"></i> สวัสดี, {{ authStore.user?.username || 'ผู้ใช้งาน' }}
          </div>
          <a
            href="#"
            class="block px-4 py-2 text-my-custom-gray hover:bg-red-100 flex items-center space-x-2"
            @click.prevent="handleLogout"
          >
            <i class="fas fa-sign-out-alt"></i><span>ออกจากระบบ</span>
          </a>
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
          <hr class="my-1 border-gray-200" />
        </template>
      </div>
    </div>
  </nav>

  <LoginModal v-model:isOpen="isLoginModalOpen" @loginSuccess="handleLoginSuccess" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import LoginModal from './LoginModal.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const isMobileMenuOpen = ref(false)
const isDropdownOpen = ref({
  about: false,
  services: false,
  staff: false,
  otherServices: false, // เพิ่มเข้ามาสำหรับเมนูใหม่
})
const isLoginModalOpen = ref(false)

const route = useRoute()
// const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const toggleDropdown = (menu: 'about' | 'services' | 'staff' | 'otherServices') => {
  // เพิ่ม 'otherServices'
  for (const key in isDropdownOpen.value) {
    if (key !== menu) {
      isDropdownOpen.value[key as keyof typeof isDropdownOpen.value] = false
    }
  }
  isDropdownOpen.value[menu] = !isDropdownOpen.value[menu]
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  for (const key in isDropdownOpen.value) {
    isDropdownOpen.value[key as keyof typeof isDropdownOpen.value] = false
  }
}

const closeAllDropdowns = () => {
  for (const key in isDropdownOpen.value) {
    isDropdownOpen.value[key as keyof typeof isDropdownOpen.value] = false
  }
  isMobileMenuOpen.value = false
}
const handleClickOutside = (event: MouseEvent) => {
  const navbarElement = document.querySelector('nav')
  if (navbarElement && !navbarElement.contains(event.target as Node) && !isLoginModalOpen.value) {
    closeAllDropdowns()
  }
}

const openLoginModal = () => {
  isLoginModalOpen.value = true
  closeAllDropdowns()
}

const handleLoginSuccess = () => {
  console.log('Login Success Handled by Navbar!')
}

const handleLogout = () => {
  authStore.logout()
  closeAllDropdowns()
  toast.info('ออกจากระบบเรียบร้อยแล้ว')
}

watch(
  () => route.path,
  () => {
    closeAllDropdowns()
  },
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped></style>
