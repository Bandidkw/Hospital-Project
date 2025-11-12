<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-md my-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">ห้องฉุกเฉิน</h1>
    <p class="text-gray-700 leading-relaxed mb-4">
      โรงพยาบาลแม่แตงมีห้องฉุกเฉินที่พร้อมให้บริการตลอด 24 ชั่วโมง
      สำหรับผู้ป่วยที่มีภาวะเจ็บป่วยฉุกเฉินหรือได้รับอุบัติเหตุ
      ทีมแพทย์และพยาบาลผู้เชี่ยวชาญของเราพร้อมให้การดูแลอย่างรวดเร็วและมีประสิทธิภาพ
      ด้วยอุปกรณ์ทางการแพทย์ที่ทันสมัย
    </p>
    <p class="text-gray-700 leading-relaxed mb-6">
      เราให้ความสำคัญกับการคัดแยกผู้ป่วย (Triage) เพื่อจัดลำดับความเร่งด่วนในการรักษา
      เพื่อให้ผู้ป่วยวิกฤตได้รับการดูแลทันที
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-blue-50 p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold text-blue-700 mb-3 flex items-center">
          <i class="fas fa-clock mr-3 text-blue-500"></i> เวลาทำการ
        </h2>
        <p class="text-gray-700">เปิดให้บริการ 24 ชั่วโมง ตลอด 7 วัน</p>
      </div>
      <div class="bg-green-50 p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold text-green-700 mb-3 flex items-center">
          <i class="fas fa-phone-alt mr-3 text-green-500"></i> เบอร์โทรศัพท์ฉุกเฉิน
        </h2>
        <p class="text-gray-700">1669 (สายตรงห้องฉุกเฉิน)</p>
      </div>
    </div>

    <h2 class="text-2xl font-semibold text-gray-800 mb-4">บริการที่ห้องฉุกเฉิน</h2>
    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-6">
      <li>การประเมินและคัดแยกผู้ป่วยฉุกเฉิน (Triage)</li>
      <li>การปฐมพยาบาลเบื้องต้นและกู้ชีพ</li>
      <li>การวินิจฉัยและรักษาภาวะฉุกเฉินทางการแพทย์</li>
      <li>การส่งต่อผู้ป่วยไปยังโรงพยาบาลที่มีศักยภาพสูงกว่า (ถ้าจำเป็น)</li>
      <li>บริการรถพยาบาลฉุกเฉิน</li>
    </ul>

    <div
      class="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md"
      role="alert"
    >
      <p class="font-bold">ข้อควรทราบ:</p>
      <p>หากมีภาวะฉุกเฉินทางการแพทย์ โปรดโทรแจ้งเบอร์ฉุกเฉิน หรือนำส่งโรงพยาบาลทันที</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// No specific script logic needed for a static page
</script>

<style scoped>
/* Add specific styles for this page if needed */
</style>
