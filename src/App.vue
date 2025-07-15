<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HeaderContact from './components/HeaderContact.vue' // Import HeaderContact
import Navbar from './components/Navbar.vue'; // Import Navbar
import Footer from './components/Footer.vue'; // Import Footer
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <HeaderContact /><Navbar />

    <main class="flex-grow"> <RouterView />
    </main>

    <Footer />
  </div>
</template>


<style scoped></style>
