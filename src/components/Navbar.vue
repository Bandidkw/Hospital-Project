<template>
  <nav class="bg-white p-4 text-gray-800 shadow-lg">
<div class="container mx-auto flex justify-between items-center h-16 px-4">
      <div class="flex items-center h-full justify-between">
        <div class="flex items-center h-full justify-between"><img src="/src/assets/MTH-Logo/logo.png" alt="Hospital Logo" class="h-24 w-24 p-3 mr-3"></div>
        <div>
          <h1 class="text-xl font-bold text-gray-800">โรงพยาบาลแม่แตง</h1>
          <p class="text-sm text-gray-600">Maetaeng Hospital</p>
        </div>
      </div>
      <div class="hidden md:flex h-full items-center"> <RouterLink to="/" class="space-x-2 flex items-center 2 hover:text-blue-600 transition duration-300">
          <i class="fas fa-home"></i>
          <span>หน้าแรก</span>
        </RouterLink>

        <div class="relative group h-full flex items-center"> <RouterLink to="#" class="flex items-center space-x-2 px-4 py-2 hover:text-blue-600 transition duration-300 cursor-pointer">
            <i class="fas fa-hospital"></i>
            <span>ข้อมูลโรงพยาบาล</span>
            <i class="fas fa-chevron-down text-xs ml-1 group-hover:rotate-180 transition-transform duration-300"></i>
          </RouterLink>
          <div class="absolute hidden group-hover:block bg-white text-gray-800 rounded-md shadow-lg py-2 mt-2 w-48 z-50 top-full left-0">
            <RouterLink to="/history" class="block px-4 py-2 hover:bg-gray-100">ประวัติโรงพยาบาล</RouterLink>
            <RouterLink to="/vision" class="block px-4 py-2 hover:bg-gray-100">วิสัยทัศน์/พันธกิจ</RouterLink>
            <RouterLink to="/organization" class="block px-4 py-2 hover:bg-gray-100">โครงสร้างองค์กร</RouterLink>
            <RouterLink to="/personnel" class="block px-4 py-2 hover:bg-gray-100">บุคลากร</RouterLink>
          </div>
        </div>

        <div class="relative group h-full flex items-center">
          <RouterLink to="#" class="space-x-2 flex flex items-center 2 px-4 py-2 hover:text-blue-600 transition duration-300 cursor-pointer">
            <i class="fas fa-concierge-bell"></i>
            <span>บริการ</span>
            <i class="fas fa-chevron-down text-xs ml-1 group-hover:rotate-180 transition-transform duration-300"></i>
          </RouterLink>
          <div class="absolute hidden group-hover:block bg-white text-gray-800 rounded-md shadow-lg py-2 mt-2 w-48 z-50 top-full left-0">
            <RouterLink to="/outpatient" class="block px-4 py-2 hover:bg-gray-100">คลินิกผู้ป่วยนอก</RouterLink>
            <RouterLink to="/inpatient" class="block px-4 py-2 hover:bg-gray-100">ผู้ป่วยใน</RouterLink>
            <RouterLink to="/emergency" class="block px-4 py-2 hover:bg-gray-100">ห้องฉุกเฉิน</RouterLink>
          </div>
        </div>

        <RouterLink to="/news" class="space-x-2 flex items-center 2 px-4 py-2 hover:text-blue-600 transition duration-300">
          <i class="fas fa-newspaper"></i>
          <span>ข่าวสาร</span>
        </RouterLink>
        <RouterLink to="/ita" class="space-x-2 flex items-center 2 px-4 py-2 hover:text-blue-600 transition duration-300">
          <i class="fas fa-award"></i>
          <span>ITA</span>
        </RouterLink>
        <RouterLink to="/contact" class="space-x-2 flex items-center 2 px-4 py-2 hover:text-blue-600 transition duration-300">
          <i class="fas fa-id-card"></i>
          <span>ติดต่อเรา</span>
        </RouterLink>

        <div class="relative group h-full flex items-center">
          <RouterLink to="#" class="space-x-2 flex items-center 2 px-4 py-2 hover:text-blue-600 transition duration-300 cursor-pointer">
            <i class="fas fa-user-circle"></i>
            <span>เจ้าหน้าที่</span>
            <i class="fas fa-chevron-down text-xs ml-1 group-hover:rotate-180 transition-transform duration-300"></i>
          </RouterLink>
          <div class="absolute hidden group-hover:block bg-white text-gray-800 rounded-md shadow-lg py-2 mt-2 w-48 z-50 top-full left-0">
            <RouterLink to="/staff-login" class="block px-4 py-2 hover:bg-gray-100">เข้าสู่ระบบเจ้าหน้าที่</RouterLink>
            <RouterLink to="/admin-panel" class="block px-4 py-2 hover:bg-gray-100">แผงควบคุมผู้ดูแล</RouterLink>
          </div>
        </div>
      </div>

      <div class="md:hidden">
        <button @click="toggleMobileMenu" class="text-gray-800 focus:outline-none">
          <i class="fas fa-bars text-2xl"></i>
        </button>
      </div>
    </div>

    <div v-if="isMobileMenuOpen" class="md:hidden bg-white px-4 py-2 border-t border-gray-200">
      <RouterLink to="/" class="block py-2 text-gray-800 hover:bg-gray-100 flex items-center 2">
        <i class="fas fa-home"></i> <span>หน้าแรก</span>
      </RouterLink>
      <div class="block py-2 text-gray-800 hover:bg-gray-100 flex items-center 2 cursor-pointer" @click="toggleDropdown('about')">
        <i class="fas fa-hospital"></i> <span>ข้อมูลโรงพยาบาล</span> <i :class="{'fas fa-chevron-down': !isDropdownOpen.about, 'fas fa-chevron-up': isDropdownOpen.about}" class="text-xs ml-auto transition-transform duration-300"></i>
      </div>
      <div v-if="isDropdownOpen.about" class="bg-gray-100 pl-6">
        <RouterLink to="/history" class="block px-4 py-2 text-gray-800 hover:bg-gray-200">ประวัติโรงพยาบาล</RouterLink>
        <RouterLink to="/vision" class="block px-4 py-2 text-gray-800 hover:bg-gray-200">วิสัยทัศน์/พันธกิจ</RouterLink>
        <RouterLink to="/organization" class="block px-4 py-2 text-gray-800 hover:bg-gray-200">โครงสร้างองค์กร</RouterLink>
        <RouterLink to="/personnel" class="block px-4 py-2 text-gray-800 hover:bg-gray-200">บุคลากร</RouterLink>
      </div>
      <div class="block py-2 text-gray-800 hover:bg-gray-100 flex items-center 2 cursor-pointer" @click="toggleDropdown('services')">
        <i class="fas fa-concierge-bell"></i> <span>บริการ</span> <i :class="{'fas fa-chevron-down': !isDropdownOpen.services, 'fas fa-chevron-up': isDropdownOpen.services}" class="text-xs ml-auto transition-transform duration-300"></i>
      </div>
      <div v-if="isDropdownOpen.services" class="bg-gray-100 pl-6">
        <RouterLink to="/outpatient" class="block px-4 py-2 text-gray-800 hover:bg-gray-200">คลินิกผู้ป่วยนอก</RouterLink>
        <RouterLink to="/inpatient" class="block px-4 py-2 text-gray-800 hover:bg-gray-200">ผู้ป่วยใน</RouterLink>
        <RouterLink to="/emergency" class="block px-4 py-2 text-gray-800 hover:bg-gray-200">ห้องฉุกเฉิน</RouterLink>
      </div>
      <RouterLink to="/news" class="block py-2 text-gray-800 hover:bg-gray-100 flex items-center 2">
        <i class="fas fa-newspaper"></i> <span>ข่าวสาร</span>
      </RouterLink>
      <RouterLink to="/ita" class="block py-2 text-gray-800 hover:bg-gray-100 flex items-center 2">
        <i class="fas fa-award"></i> <span>ITA</span>
      </RouterLink>
      <RouterLink to="/contact" class="block py-2 text-gray-800 hover:bg-gray-100 flex items-center 2">
        <i class="fas fa-id-card"></i> <span>ติดต่อเรา</span>
      </RouterLink>
      <div class="block py-2 text-gray-800 hover:bg-gray-100 flex items-center 2 cursor-pointer" @click="toggleDropdown('staff')">
        <i class="fas fa-user-circle"></i> <span>เจ้าหน้าที่</span> <i :class="{'fas fa-chevron-down': !isDropdownOpen.staff, 'fas fa-chevron-up': isDropdownOpen.staff}" class="text-xs ml-auto transition-transform duration-300"></i>
      </div>
      <div v-if="isDropdownOpen.staff" class="bg-gray-100 pl-6">
        <RouterLink to="/staff-login" class="block px-4 py-2 text-gray-800 hover:bg-gray-200">เข้าสู่ระบบเจ้าหน้าที่</RouterLink>
        <RouterLink to="/admin-panel" class="block px-4 py-2 text-gray-800 hover:bg-gray-200">แผงควบคุมผู้ดูแล</RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const isMobileMenuOpen = ref(false);
const isDropdownOpen = ref({
  about: false,
  services: false,
  staff: false,
});

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  isDropdownOpen.value.about = false;
  isDropdownOpen.value.services = false;
  isDropdownOpen.value.staff = false;
};

const toggleDropdown = (menu: 'about' | 'services' | 'staff') => {
  isDropdownOpen.value[menu] = !isDropdownOpen.value[menu];
};
</script>

<style scoped>
/* คุณสามารถเพิ่ม CSS เฉพาะ component นี้ได้ที่นี่ */
</style>
