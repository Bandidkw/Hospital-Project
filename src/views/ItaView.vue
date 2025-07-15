<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-md my-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">การประเมินคุณธรรมและความโปร่งใส (ITA)</h1>
    <p class="text-gray-700 leading-relaxed mb-6">
      โรงพยาบาลแม่แตงมุ่งมั่นที่จะดำเนินงานด้วยหลักธรรมาภิบาล
      มีความโปร่งใส ตรวจสอบได้ และยึดมั่นในคุณธรรม
      เพื่อสร้างความเชื่อมั่นให้กับประชาชนและผู้มีส่วนได้ส่วนเสียทุกภาคส่วน
      เราเข้าร่วมการประเมินคุณธรรมและความโปร่งใสในการดำเนินงานของหน่วยงานภาครัฐ (Integrity and Transparency Assessment: ITA)
      เป็นประจำทุกปี เพื่อสะท้อนถึงความมุ่งมั่นของเรา
    </p>

    <h2 class="text-2xl font-semibold text-gray-800 mb-4">ผลการประเมิน ITA</h2>
    <div class="overflow-x-auto mb-8">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
            <th class="py-3 px-6 text-left">ปีงบประมาณ</th>
            <th class="py-3 px-6 text-center">คะแนนรวม</th>
            <th class="py-3 px-6 text-center">ระดับผลการประเมิน</th>
            <th class="py-3 px-6 text-center">เอกสารอ้างอิง</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-for="result in itaResults" :key="result.year" class="border-b border-gray-200 hover:bg-gray-50">
            <td class="py-3 px-6 text-left">{{ result.year }}</td>
            <td class="py-3 px-6 text-center">{{ result.score }}</td>
            <td class="py-3 px-6 text-center">
              <span :class="{'bg-green-200 text-green-600': result.level === 'A', 'bg-blue-200 text-blue-600': result.level === 'B', 'bg-yellow-200 text-yellow-600': result.level === 'C'}" class="py-1 px-3 rounded-full text-xs">
                {{ result.level }}
              </span>
            </td>
            <td class="py-3 px-6 text-center">
              <a :href="result.documentUrl" target="_blank" class="text-blue-600 hover:underline flex items-center justify-center">
                <i class="fas fa-file-alt mr-2"></i> ดูเอกสาร
              </a>
            </td>
          </tr>
          <tr v-if="itaResults.length === 0">
            <td colspan="4" class="py-8 text-center text-gray-500">
              ยังไม่มีข้อมูลผลการประเมิน ITA
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 class="text-2xl font-semibold text-gray-800 mb-4">นโยบายและมาตรการ</h2>
    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-6">
      <li>นโยบายไม่รับของขวัญและผลประโยชน์ทุกชนิด (No Gift Policy)</li>
      <li>มาตรการป้องกันและปราบปรามการทุจริต</li>
      <li>ช่องทางการร้องเรียน/แจ้งเบาะแสการทุจริต</li>
      <li>การเปิดเผยข้อมูลข่าวสารภาครัฐ</li>
    </ul>

    <div class="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
      <p class="font-bold">สอบถามเพิ่มเติม:</p>
      <p>หากมีข้อสงสัยเกี่ยวกับ ITA หรือต้องการแจ้งเบาะแส โปรดติดต่อหน่วยงานที่รับผิดชอบ</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const itaResults = ref([
  { year: 2567, score: 95.25, level: 'A', documentUrl: '#' },
  { year: 2566, score: 92.10, level: 'A', documentUrl: '#' },
  { year: 2565, score: 88.50, level: 'B', documentUrl: '#' },
]);

// In a real application, you would fetch this data from an API
</script>

<style scoped>
/* Add specific styles for this page if needed */
</style>
