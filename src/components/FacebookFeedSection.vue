<template>
  <section class="py-12 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center text-primary-900 mb-8">ข่าวสารจาก Facebook</h2>

      <div v-if="isLoading" class="text-center py-10">
        <p class="text-gray-500">กำลังโหลดข้อมูลจาก Facebook...</p>
      </div>

      <div v-else-if="posts.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          v-for="post in posts"
          :key="post.id"
          :href="post.permalink_url"
          target="_blank"
          class="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl"
        >
          <img
            v-if="post.full_picture"
            :src="post.full_picture"
            alt="Facebook Post Image"
            class="w-full h-48 object-cover"
          />

          <div class="p-4">
            <p class="text-gray-700 text-sm mb-2 line-clamp-2">{{ post.message }}</p>
            <p class="text-xs text-gray-400">
              {{ new Date(post.created_time).toLocaleDateString('th-TH') }}
            </p>
            <span class="text-xs text-blue-500 font-medium mt-2 block"> ดูโพสต้นฉบับ → </span>
          </div>
        </a>
      </div>

      <div v-else class="text-center py-10 text-gray-500">ไม่พบโพส Facebook ล่าสุด</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { FacebookPost } from '@/types/facebook'

// 💡 กำหนด Props ที่จะรับมาจาก index.vue
defineProps<{
  posts: FacebookPost[]
  isLoading: boolean
}>()
</script>
