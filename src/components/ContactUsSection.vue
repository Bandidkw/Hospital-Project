<template>
  <section class="py-16 bg-gray-100">
    <div class="container mx-auto text-center">
      <h2 class="text-3xl font-semibold text-gray-700 mb-8">ติดต่อเรา</h2>
      <div class="md:grid md:grid-cols-2 md:gap-8 px-4 md:px-0 text-left">
        <div class="bg-white p-8 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">
            ข้อมูลติดต่อ{{ settingsStore.settings?.hospitalNameTh }}
          </h3>

          <p v-if="settingsStore.settings?.address" class="text-gray-600 mb-2">
            <i class="fas fa-map-marker-alt mr-2 text-blue-500"></i>
            {{ settingsStore.settings.address }}
          </p>

          <p v-if="settingsStore.settings?.telMain" class="text-gray-600 mb-2">
            <i class="fas fa-phone mr-2 text-blue-500"></i>
            โทร: {{ settingsStore.settings.telMain }}
          </p>

          <p v-if="settingsStore.settings?.emailMain" class="text-gray-600 mb-4">
            <i class="fas fa-envelope mr-2 text-blue-500"></i>
            อีเมล: {{ settingsStore.settings.emailMain }}
          </p>

          <div
            v-if="settingsStore.settings?.googleMapIframe"
            v-html="settingsStore.settings.googleMapIframe"
            class="w-full h-[250px] rounded-lg overflow-hidden"
          ></div>
          <div
            v-else
            class="bg-gray-200 h-[250px] flex items-center justify-center text-gray-500 rounded-lg"
          >
            ไม่พบข้อมูลแผนที่ (กรุณาตั้งค่าใน Dashboard)
          </div>
        </div>

        <div class="bg-white p-8 rounded-lg shadow-md mt-8 md:mt-0">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">ส่งข้อความถึงเรา</h3>
          <form class="space-y-4">
            <div>
              <label for="name" class="block text-gray-700 text-sm font-bold mb-2">ชื่อ:</label>
              <input
                type="text"
                id="name"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label for="phone" class="block text-gray-700 text-sm font-bold mb-2"
                >เบอร์โทรศัพท์:</label
              >
              <input
                type="tel"
                id="phone"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label for="message" class="block text-gray-700 text-sm font-bold mb-2"
                >ข้อความ:</label
              >
              <textarea
                id="message"
                rows="4"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></textarea>
            </div>
            <button
              type="submit"
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              ส่งข้อความ
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { onMounted } from 'vue'

const settingsStore = useSettingsStore()

// 🟢 โหลดข้อมูลการตั้งค่าเมื่อ Component นี้ถูกสร้าง
onMounted(() => {
  settingsStore.loadSettings()
})
</script>

<style scoped>
:deep(.w-full iframe) {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
