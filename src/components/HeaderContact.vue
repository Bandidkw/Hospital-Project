<template>
  <div v-if="settingsStore.settings" class="bg-blue-700 text-white text-sm py-2">
    <div class="container mx-auto flex justify-between items-center px-4">
      <div class="flex items-center space-x-4">
        <span v-if="settingsStore.settings.telMain"> 📞 {{ settingsStore.settings.telMain }} </span>
        <span v-if="settingsStore.settings.emailMain">
          📧 {{ settingsStore.settings.emailMain }}
        </span>
      </div>

      <div class="flex items-center space-x-3">
        <a
          v-if="settingsStore.settings.facebookUrl"
          :href="settingsStore.settings.facebookUrl"
          target="_blank"
          class="text-white hover:text-blue-200 transition duration-300"
        >
          <i class="fab fa-facebook-f"></i>
        </a>

        <a
          v-if="settingsStore.settings.lineId"
          :href="`https://line.me/ti/p/~${settingsStore.settings.lineId.replace('@', '')}`"
          target="_blank"
          class="text-white hover:text-blue-200 transition duration-300"
        >
          <i class="fab fa-line"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { onMounted } from 'vue'

const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.loadSettings()
})
</script>

<style scoped></style>
