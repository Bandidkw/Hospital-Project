<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">ตัวอย่างการใช้งานหน้าข่าวสารใหม่</h1>

    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">วิธีการเข้าถึงหน้าใหม่:</h2>

      <div class="space-y-4">
        <div class="p-4 bg-blue-50 rounded-lg">
          <h3 class="font-semibold text-blue-800 mb-2">URL สำหรับหน้าใหม่:</h3>
          <code class="text-blue-600">/news/[id]/image</code>
          <p class="text-sm text-blue-700 mt-1">เช่น: /news/123/image</p>
        </div>

        <div class="p-4 bg-gray-50 rounded-lg">
          <h3 class="font-semibold text-gray-800 mb-2">URL สำหรับหน้าเก่า:</h3>
          <code class="text-gray-600">/news/[id]</code>
          <p class="text-sm text-gray-700 mt-1">เช่น: /news/123</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">ตัวอย่างการใช้งาน:</h2>

      <div class="space-y-4">
        <!-- ปุ่มทดสอบไปหน้าใหม่ -->
        <div>
          <h3 class="font-medium mb-2">ไปหน้าข่าวสารใหม่ (มีปุ่มกลับด้านบน):</h3>
          <router-link
            :to="{ name: 'news-image-detail', params: { id: 'sample-news-1' } }"
            class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i class="fas fa-image"></i>
            ทดสอบหน้าใหม่
          </router-link>
        </div>

        <!-- ปุ่มทดสอบไปหน้าเก่า -->
        <div>
          <h3 class="font-medium mb-2">ไปหน้าข่าวสารเก่า (ปุ่มกลับด้านล่าง):</h3>
          <router-link
            :to="{ name: 'news-detail', params: { id: 'sample-news-1' } }"
            class="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <i class="fas fa-newspaper"></i>
            ทดสอบหน้าเก่า
          </router-link>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-xl font-semibold mb-4">การใช้งานใน Component:</h2>

      <div class="bg-gray-100 p-4 rounded-lg">
        <pre class="text-sm"><code>&lt;!-- สำหรับข่าวที่เป็นรูปภาพ --&gt;
&lt;router-link
  :to="{ name: 'news-image-detail', params: { id: news.id } }"
  class="btn-read-more"
&gt;
  อ่านต่อ (หน้าใหม่)
&lt;/router-link&gt;

&lt;!-- สำหรับข่าวทั่วไป --&gt;
&lt;router-link
  :to="{ name: 'news-detail', params: { id: news.id } }"
  class="btn-read-more"
&gt;
  อ่านต่อ (หน้าเก่า)
&lt;/router-link&gt;</code></pre>
      </div>
    </div>

    <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div class="flex items-start gap-2">
        <i class="fas fa-exclamation-triangle text-yellow-600 mt-1"></i>
        <div>
          <h3 class="font-semibold text-yellow-800">หมายเหตุ:</h3>
          <p class="text-yellow-700 text-sm">
            หากคุณเข้าผ่าน URL /news/123 คุณจะเห็นหน้าเก่าที่ปุ่มกลับอยู่ด้านล่าง<br />
            หากต้องการเห็นหน้าใหม่ที่ปุ่มกลับอยู่ด้านบน ให้เข้าผ่าน URL /news/123/image
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ไม่ต้องมี logic พิเศษ เป็นแค่หน้าตัวอย่าง
</script>
