<script setup lang="ts">
import HeroSection from '../components/HeroSection.vue'; // Import HeroSection
</script>

<template>
  <div>
    <HeroSection /> <div class="text-center py-10">
      <h1 class="text-4xl font-bold text-blue-700 mb-4">Welcome to Hospital Website</h1>
      <p class="text-lg text-gray-700 max-w-2xl mx-auto">
        Providing compassionate and quality healthcare services to our community.
      </p>
      <button class="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300">
        Learn More About Our Services
      </button>
    </div>
  </div>
</template>
