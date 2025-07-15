<template>
  <nav class="bg-white py-4 text-my-custom-gray shadow-lg">
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
            :aria-expanded="isDropdownOpen.about.toString()"
          >
            <i class="fas fa-hospital"></i>
            <span>ข้อมูลโรงพยาบาล</span>
            <i :class="{'fas fa-chevron-down': !isDropdownOpen.about, 'fas fa-chevron-up': isDropdownOpen.about}" class="text-xs ml-1 transition-transform duration-300"></i>
          </button>
          <div
            v-if="isDropdownOpen.about"
            class="absolute bg-white text-my-custom-gray rounded-md shadow-lg py-2 mt-2 w-48 z-50 top-full left-0"
            @click.stop >
            <RouterLink to="/history" class="block px-4 py-2 hover:bg-gray-100">ประวัติโรงพยาบาล</RouterLink>
            <RouterLink to="/vision" class="block px-4 py-2 hover:bg-gray-100">วิสัยทัศน์/พันธกิจ</RouterLink>
            <RouterLink to="/organization" class="block px-4 py-2 hover:bg-gray-100">โครงสร้างองค์กร</RouterLink>
            <RouterLink to="/personnel" class="block px-4 py-2 hover:bg-gray-100">บุคลากร</RouterLink>
          </div>
        </div>

        <div class="relative h-full flex items-center">
          <button
            @click="toggleDropdown('services')"
            class="space-x-2 flex items-center px-4 py-2 hover:text-blue-600 transition duration-300 cursor-pointer focus:outline-none"
            :aria-expanded="isDropdownOpen.services.toString()"
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
            <RouterLink to="/outpatient" class="block px-4 py-2 hover:bg-gray-100">คลินิกผู้ป่วยนอก</RouterLink>
            <RouterLink to="/inpatient" class="block px-4 py-2 hover:bg-gray-100">ผู้ป่วยใน</RouterLink>
            <RouterLink to="/emergency" class="block px-4 py-2 hover:bg-gray-100">ห้องฉุกเฉิน</RouterLink>
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
            :aria-expanded="isDropdownOpen.staff.toString()"
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
            <RouterLink to="/back-office" class="block px-4 py-2 hover:bg-gray-100">ระบบ Back Office</RouterLink>
            <RouterLink to="/equipment" class="block px-4 py-2 hover:bg-gray-100">ระบบครุภัณฑ์</RouterLink>
            <RouterLink to="/personnel-login" class="block px-4 py-2 hover:bg-gray-100">ระบบบุคลากร</RouterLink>
            <RouterLink to="/pharmacy-login" class="block px-4 py-2 hover:bg-gray-100">ระบบคลังยา</RouterLink>
            <RouterLink to="/finance-login" class="block px-4 py-2 hover:bg-gray-100">ระบบการเงิน</RouterLink>
            <RouterLink to="/other-systems-login" class="block px-4 py-2 hover:bg-gray-100">ระบบงานอื่นๆ</RouterLink>
            <RouterLink to="/staff-login" class="block px-4 py-2 hover:bg-gray-100">เข้าสู่ระบบ</RouterLink>
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
        <RouterLink to="/history" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200">ประวัติโรงพยาบาล</RouterLink>
        <RouterLink to="/vision" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200">วิสัยทัศน์/พันธกิจ</RouterLink>
        <RouterLink to="/organization" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200">โครงสร้างองค์กร</RouterLink>
        <RouterLink to="/personnel" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200">บุคลากร</RouterLink>
      </div>

      <div class="block py-2 text-my-custom-gray hover:bg-gray-100 flex items-center space-x-2 cursor-pointer" @click="toggleDropdown('services')">
        <i class="fas fa-concierge-bell"></i> <span>บริการ</span>
        <i :class="{'fas fa-chevron-down': !isDropdownOpen.services, 'fas fa-chevron-up': isDropdownOpen.services}" class="text-xs ml-auto transition-transform duration-300"></i>
      </div>
      <div v-if="isDropdownOpen.services" class="bg-gray-100 pl-6">
        <RouterLink to="/outpatient" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200">คลินิกผู้ป่วยนอก</RouterLink>
        <RouterLink to="/inpatient" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200">ผู้ป่วยใน</RouterLink>
        <RouterLink to="/emergency" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200">ห้องฉุกเฉิน</RouterLink>
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
        <RouterLink to="/staff-login" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200">เข้าสู่ระบบเจ้าหน้าที่</RouterLink>
        <RouterLink to="/admin-panel" class="block px-4 py-2 text-my-custom-gray hover:bg-gray-200">แผงควบคุมผู้ดูแล</RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'; // ต้อง import onMounted, onUnmounted
import { RouterLink } from 'vue-router';

const isMobileMenuOpen = ref(false);
const isDropdownOpen = ref({
  about: false,
  services: false,
  staff: false,
});

// ฟังก์ชันสำหรับสลับสถานะ Dropdown และปิด dropdown อื่นๆ
const toggleDropdown = (menu: 'about' | 'services' | 'staff') => {
  // ปิด dropdown อื่นๆ ก่อนเปิดอันใหม่
  for (const key in isDropdownOpen.value) {
    if (key !== menu) {
      isDropdownOpen.value[key as keyof typeof isDropdownOpen.value] = false;
    }
  }
  isDropdownOpen.value[menu] = !isDropdownOpen.value[menu];
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  // ปิด dropdown ทั้งหมดเมื่อสลับ Mobile Menu
  for (const key in isDropdownOpen.value) {
    isDropdownOpen.value[key as keyof typeof isDropdownOpen.value] = false;
  }
};

// Logic สำหรับปิด dropdown เมื่อคลิกนอกพื้นที่ (สำหรับ Desktop Dropdown ที่ใช้ @click)
const handleClickOutside = (event: MouseEvent) => {
  const navbarElement = document.querySelector('nav'); // เลือก element ที่เป็น navbar หลัก

  // ตรวจสอบว่าการคลิกไม่ได้อยู่ใน navbar (เพื่อไม่ให้ปิด dropdown ถ้าคลิกภายใน navbar)
  // และไม่ได้คลิกที่ปุ่มที่เปิด dropdown (เพราะ toggleDropdown จะจัดการเอง)
  if (navbarElement && !navbarElement.contains(event.target as Node)) {
    for (const key in isDropdownOpen.value) {
      isDropdownOpen.value[key as keyof typeof isDropdownOpen.value] = false;
    }
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* คุณสามารถเพิ่ม CSS เฉพาะ component นี้ได้ที่นี่ */
/*
ถ้าต้องการ transition ตอนเปิด/ปิด dropdown (ที่ไม่ใช่ group-hover) ให้เพิ่ม class เหล่านี้:
ตัวอย่าง:
.absolute[v-if] {
  opacity: 0;
  transform: translateY(-5px);
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}
.absolute[v-if].v-enter-active, .absolute[v-if].v-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}
.absolute[v-if].v-enter-to, .absolute[v-if].v-leave-from {
  opacity: 1;
  transform: translateY(0);
}
*/
</style>
