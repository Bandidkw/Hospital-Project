<template>
  <nav class="bg-white py-4 text-my-custom-gray shadow-lg relative z-50">
    <div class="container mx-auto flex justify-between items-center h-16 px-4">
      <div class="flex items-center h-full">
        <img src="/src/assets/MTH-Logo/logo.png" alt="Hospital Logo" class="h-24 w-24 p-3 mr-3">
        <div>
          <h1 class="text-xl font-bold text-my-custom-gray">โรงพยาบาลแม่แตง</h1>
          <p class="text-sm text-gray-600">Maetaeng Hospital</p>
        </div>
      </div>

      <div class="hidden md:flex h-full items-center">
        <RouterLink to="/" class="space-x-2 flex items-center px-4 py-2 hover:text-blue-600 transition duration-300">
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
            <i :class="{'fas fa-chevron-down': !isDropdownOpen.about, 'fas fa-chevron-up': isDropdownOpen.about}" class="text-xs ml-1 transition-transform duration-300"></i>
          </button>
          <div
            v-if="isDropdownOpen.about"
            class="absolute bg-white text-my-custom-gray rounded-md shadow-lg py-2 mt-2 w-48 z-50 top-full left-0"
            @click.stop >
            <RouterLink to="/history" class="px-4 py-2 hover:bg-gray-100 flex items-center space-x-2" @click="closeAllDropdowns()">
                <i class="fas fa-history"></i><span>ประวัติโรงพยาบาล</span>
            </RouterLink>
            <RouterLink to="/vision" class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2" @click="closeAllDropdowns()">
                <i class="fas fa-eye"></i><span>วิสัยทัศน์/พันธกิจ</span>
            </RouterLink>
            <RouterLink to="/organization" class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2" @click="closeAllDropdowns()">
                <i class="fas fa-sitemap"></i><span>โครงสร้างองค์กร</span>
            </RouterLink>
            <RouterLink to="/personnel" class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2" @click="closeAllDropdowns()">
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
            <i :class="{'fas fa-chevron-down': !isDropdownOpen.services, 'fas fa-chevron-up': isDropdownOpen.services}" class="text-xs ml-1 transition-transform duration-300"></i>
          </button>
          <div
            v-if="isDropdownOpen.services"
            class="absolute bg-white text-my-custom-gray rounded-md shadow-lg py-2 mt-2 w-48 z-50 top-full left-0"
            @click.stop
          >
            <RouterLink to="/outpatient" class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2" @click="closeAllDropdowns()">
                <i class="fas fa-stethoscope"></i><span>คลินิกผู้ป่วยนอก</span>
            </RouterLink>
            <RouterLink to="/inpatient" class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2" @click="closeAllDropdowns()">
                <i class="fas fa-bed"></i><span>ผู้ป่วยใน</span>
            </RouterLink>
            <RouterLink to="/emergency" class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2" @click="closeAllDropdowns()">
                <i class="fas fa-ambulance"></i><span>ห้องฉุกเฉิน</span>
            </RouterLink>
          </div>
        </div>

        <RouterLink to="/news" class="space-x-2 flex items-center px-4 py-2 hover:text-blue-600 transition duration-300">
          <i class="fas fa-newspaper"></i>
          <span>ข่าวสาร</span>
        </RouterLink>
        <RouterLink to="/ita" class="space-x-2 flex items-center px-4 py-2 hover:text-blue-600 transition duration-300">
          <i class="fas fa-award"></i>
          <span>ITA</span>
        </RouterLink>
        <RouterLink to="/contact" class="space-x-2 flex items-center px-4 py-2 hover:text-blue-600 transition duration-300">
          <i class="fas fa-id-card"></i>
          <span>ติดต่อเรา</span>
        </RouterLink>

        <div class="relative h-full flex items-center">
          <button
            @click="toggleDropdown('staff')"
            class="space-x-2 flex items-center px-4 py-2 hover:text-blue-600 transition duration-300 cursor-pointer focus:outline-none"
            :aria-expanded="isDropdownOpen.staff"
          >
            <i class="fas fa-user-circle"></i>
            <span>เจ้าหน้าที่</span>
            <i :class="{'fas fa-chevron-down': !isDropdownOpen.staff, 'fas fa-chevron-up': isDropdownOpen.staff}" class="text-xs ml-1 transition-transform duration-300"></i>
          </button>
          <div
            v-if="isDropdownOpen.staff"
            class="absolute bg-white text-my-custom-gray rounded-md shadow-lg py-2 mt-2 w-48 z-50 top-full left-0"
            @click.stop
          >
            <a href="http://10.0.0.5/portal" target="_blank" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2" @click="closeAllDropdowns()">
              <i class="fas fa-external-link-alt w-5"></i><span>โปรแกรมเกี่ยวกับเรา</span>
            </a>
            <!-- <RouterLink to="/equipment" class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2" @click="closeAllDropdowns()">
              <i class="fas fa-box w-5"></i><span>ระบบครุภัณฑ์</span>
            </RouterLink>
            <RouterLink to="/personnel-login" class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2" @click="closeAllDropdowns()">
              <i class="fas fa-users-cog w-5"></i><span>ระบบบุคลากร</span>
            </RouterLink>
            <RouterLink to="/pharmacy-login" class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2" @click="closeAllDropdowns()">
              <i class="fas fa-pills w-5"></i><span>ระบบคลังยา</span>
            </RouterLink>
            <RouterLink to="/finance-login" class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2" @click="closeAllDropdowns()">
              <i class="fas fa-dollar-sign w-5"></i><span>ระบบการเงิน</span>
            </RouterLink>
            <RouterLink to="/other-systems-login" class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2" @click="closeAllDropdowns()">
              <i class="fas fa-th-large w-5"></i><span>ระบบงานอื่นๆ</span>
            </RouterLink> -->
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2" @click.prevent="openLoginModal">
              <i class="fas fa-sign-in-alt w-5"></i><span>เข้าสู่ระบบ</span>
            </a>
          </div>
        </div>
      </div>

      <div class="md:hidden">
        <button @click="toggleMobileMenu" class="text-my-custom-gray focus:outline-none">
          <i class="fas fa-bars text-2xl"></i>
        </button>
      </div>
    </div>

    <div v-if="isMobileMenuOpen" class="md:hidden bg-white px-4 py-2 border-t border-gray-200">
      <RouterLink to="/" class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2">
        <i class="fas fa-home"></i> <span>หน้าแรก</span>
      </RouterLink>

      <div class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2 cursor-pointer" @click="toggleDropdown('about')">
        <i class="fas fa-hospital"></i> <span>ข้อมูลโรงพยาบาล</span>
        <i :class="{'fas fa-chevron-down': !isDropdownOpen.about, 'fas fa-chevron-up': isDropdownOpen.about}" class="text-xs ml-auto transition-transform duration-300"></i>
      </div>
      <div v-if="isDropdownOpen.about" class="bg-gray-100 pl-6">
        <RouterLink to="/history" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2" @click="closeAllDropdowns()">
            <i class="fas fa-history"></i><span>ประวัติโรงพยาบาล</span>
        </RouterLink>
        <RouterLink to="/vision" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2" @click="closeAllDropdowns()">
            <i class="fas fa-eye"></i><span>วิสัยทัศน์/พันธกิจ</span>
        </RouterLink>
        <RouterLink to="/organization" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2" @click="closeAllDropdowns()">
            <i class="fas fa-sitemap"></i><span>โครงสร้างองค์กร</span>
        </RouterLink>
        <RouterLink to="/personnel" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2" @click="closeAllDropdowns()">
            <i class="fas fa-users"></i><span>บุคลากร</span>
        </RouterLink>
      </div>

      <div class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2 cursor-pointer" @click="toggleDropdown('services')">
        <i class="fas fa-concierge-bell"></i> <span>บริการ</span>
        <i :class="{'fas fa-chevron-down': !isDropdownOpen.services, 'fas fa-chevron-up': isDropdownOpen.services}" class="text-xs ml-auto transition-transform duration-300"></i>
      </div>
      <div v-if="isDropdownOpen.services" class="bg-gray-100 pl-6">
        <RouterLink to="/outpatient" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2" @click="closeAllDropdowns()">
            <i class="fas fa-stethoscope"></i><span>คลินิกผู้ป่วยนอก</span>
        </RouterLink>
        <RouterLink to="/inpatient" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2" @click="closeAllDropdowns()">
            <i class="fas fa-bed"></i><span>ผู้ป่วยใน</span>
        </RouterLink>
        <RouterLink to="/emergency" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2" @click="closeAllDropdowns()">
            <i class="fas fa-ambulance"></i><span>ห้องฉุกเฉิน</span>
        </RouterLink>
      </div>

      <RouterLink to="/news" class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2">
        <i class="fas fa-newspaper"></i> <span>ข่าวสาร</span>
      </RouterLink>
      <RouterLink to="/ita" class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2">
        <i class="fas fa-award"></i> <span>ITA</span>
      </RouterLink>
      <RouterLink to="/contact" class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2">
        <i class="fas fa-id-card"></i> <span>ติดต่อเรา</span>
      </RouterLink>

      <div class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2 cursor-pointer" @click="toggleDropdown('staff')">
        <i class="fas fa-user-circle"></i> <span>เจ้าหน้าที่</span>
        <i :class="{'fas fa-chevron-down': !isDropdownOpen.staff, 'fas fa-chevron-up': isDropdownOpen.staff}" class="text-xs ml-auto transition-transform duration-300"></i>
      </div>
      <div v-if="isDropdownOpen.staff" class="bg-gray-100 pl-6">
        <a href="#" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2" @click.prevent="openLoginModal">
          <i class="fas fa-sign-in-alt"></i><span>เข้าสู่ระบบเจ้าหน้าที่</span>
        </a>
        <RouterLink to="/admin-panel" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200 flex items-center space-x-2" @click="closeAllDropdowns()">
          <i class="fas fa-user-cog"></i><span>แผงควบคุมผู้ดูแล</span> </RouterLink>
      </div>
    </div>
  </nav>

  <LoginModal v-model:isOpen="isLoginModalOpen" @loginSuccess="handleLoginSuccess" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router'; // เพิ่ม useRouter

// Import LoginModal component
import LoginModal from './LoginModal.vue';

const isMobileMenuOpen = ref(false);
const isDropdownOpen = ref({
  about: false,
  services: false,
  staff: false,
});
const isLoginModalOpen = ref(false); // สถานะสำหรับควบคุม Login Modal

const route = useRoute(); // สำหรับ watch route change เพื่อปิด dropdown
const router = useRouter(); // สำหรับ redirect หลัง login

const toggleDropdown = (menu: 'about' | 'services' | 'staff') => {
  for (const key in isDropdownOpen.value) {
    if (key !== menu) {
      isDropdownOpen.value[key as keyof typeof isDropdownOpen.value] = false;
    }
  }
  isDropdownOpen.value[menu] = !isDropdownOpen.value[menu];
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  for (const key in isDropdownOpen.value) {
    isDropdownOpen.value[key as keyof typeof isDropdownOpen.value] = false;
  }
};

const closeAllDropdowns = () => {
  for (const key in isDropdownOpen.value) {
    isDropdownOpen.value[key as keyof typeof isDropdownOpen.value] = false;
  }
  isMobileMenuOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  const navbarElement = document.querySelector('nav');
  // ตรวจสอบว่าคลิกนอก navbar และไม่ได้คลิกที่ modal (ถ้า modal เปิดอยู่)
  if (navbarElement && !navbarElement.contains(event.target as Node) && !isLoginModalOpen.value) {
    closeAllDropdowns();
  }
};

// **ฟังก์ชันสำหรับเปิด Login Modal**
const openLoginModal = () => {
  isLoginModalOpen.value = true;
  closeAllDropdowns(); // ปิด Dropdown ย่อยใน Navbar ทันทีที่เปิด Modal
};

// **ฟังก์ชันที่จะถูกเรียกเมื่อ Login สำเร็จจาก LoginModal**
const handleLoginSuccess = () => {
  console.log("Login Success Handled by Navbar!");
  // ในตอนนี้ LoginModal จัดการการ redirect แล้ว แต่ถ้าคุณต้องการ Logic อื่นๆ ที่นี่ก็ได้
  // เช่น แสดง toast notification หรืออัปเดตสถานะใน Navbar (ในอนาคตถ้าใช้ Pinia/Vuex)
  // router.push('/back-office'); // LoginModal ทำการ push แล้ว แต่ถ้าต้องการให้ Navbar ควบคุมก็ใส่ตรงนี้
};

// Watch for route changes to close all dropdowns
watch(() => route.path, () => {
  closeAllDropdowns();
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Your existing styles */
</style>
