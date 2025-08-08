<template>
  <section class="py-16 bg-gray-100">
    <div class="container mx-auto text-center">
      <h2 class="text-3xl font-semibold text-gray-700 mb-8">ติดต่อเรา</h2>
      <div class="md:grid md:grid-cols-2 md:gap-8 px-4 md:px-0 text-left">
        <div class="bg-white p-8 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">ข้อมูลติดต่อโรงพยาบาลแม่แตง</h3>
          <p class="text-gray-600 mb-2">
            <i class="fas fa-map-marker-alt mr-2 text-blue-500"></i>ตำบลสันมหาพน, อำเภอแม่แตง,
            จังหวัดเชียงใหม่
          </p>
          <p class="text-gray-600 mb-2">
            <i class="fas fa-phone mr-2 text-blue-500"></i>[หมายเลขโทรศัพท์]
          </p>
          <p class="text-gray-600 mb-4">
            <i class="fas fa-envelope mr-2 text-blue-500"></i>[ที่อยู่อีเมล]
          </p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15082.352329367468!2d98.9419184!3d19.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da761014022a87%3A0x102d36d41880f00!2sSan%20Maha%20Phon%2C%20Mae%20Taeng%20District%2C%20Chiang%20Mai!5e0!3m2!1sen!2sth!4v1628424915729!5m2!1sen!2sth"
            width="100%"
            height="250"
            style="border: 0"
            allowfullscreen
            loading="lazy"
            class="rounded-lg"
          >
          </iframe>
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
              <label for="email" class="block text-gray-700 text-sm font-bold mb-2">อีเมล:</label>
              <input
                type="email"
                id="email"
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
// ในอนาคตเราสามารถเพิ่ม Logic การส่งฟอร์มได้ที่นี่
</script>
