<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-md my-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">ประวัติโรงพยาบาล</h1>
    <p class="text-gray-700 leading-relaxed mb-4">
      โรงพยาบาลแม่แตง เดิมเป็นสถานีอนามัยชั้นหนึ่ง เปิดดำเนินการเมื่อ พ.ศ. 2502 ในสถานที่ซึ่ง
      เป็นสำนักงานสาธารณสุขอำเภอแม่แตงในปัจจุบัน <br />– พ.ศ. 2518
      ได้รับการยกฐานะขึ้นเป็นโรงพยาบาลขนาด 10 เตียง <br />– เดือนตุลาคม พ.ศ.2527
      ได้ย้ายไปก่อตั้งสถานที่แห่งใหม่ เพราะสถานที่เดิมคับแคบ <br />– เดือนกุมภาพันธ์ พ.ศ.2528 ได้
      สร้างสถานที่แห่งใหม่แล้วเสร็จ <br />– 12 มีนาคม พ.ศ.2528
      ได้เปิดให้บริการในสถานที่แห่งใหม่อย่างเป็นทางการ <br />– พ.ศ.2538
      ได้รับการยกฐานะขึ้นเป็นโรงพยาบาลขนาด 30 เตียง โดยเริ่มเปิดบริการในปี พ.ศ. 2539 ปี พ.ศ. 2542
      ได้รับอาคาร 30 เตียง 2 หลัง ปัจจุบันเปิดทำการ 57 เตียง มี 2 หอผู้ป่วย
    </p>
    <p class="text-gray-700 leading-relaxed mb-4">
      โรงพยาบาลแม่แตง ตั้งอยู่เลขที่ 300 หมู่ 7 ตำบลสันมหาพน อำเภอแม่แตง จังหวัดเชียงใหม่
      อยู่ทางทิศเหนือของจังหวัดเชียงใหม่ ตามทางหลวงแผ่นดินหมายเลข 107 เส้นทางสายเชียงใหม่ – ฝาง
      กิโลเมตรที่ 40 ระยะห่างจากกรุงเทพฯ 735 กิโลเมตร มีเนื้อที่ประมาณ 1,362 ตารางกิโลเมตร
      ปัจจุบันเป็นโรงพยาบาลขนาด 60 เตียง
      ให้บริการครอบคลุมพื้นที่เขตอำเภอแม่แตงและอำเภอใกล้เคียงที่สะดวกในการมารับบริการ
    </p>
    <!-- Display the image if historyImage has a value -->
    <img
      v-if="historyImage"
      :src="historyImage"
      alt="Historical image of hospital"
      class="w-full h-auto rounded-lg shadow-lg mt-6"
    />
    <p v-else class="text-red-500 mt-4">ไม่สามารถโหลดรูปภาพประวัติโรงพยาบาลได้</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Import all images from assets/History
// The path is adjusted to go up two levels from src/views/about/ to src/, then down to assets/History/
const historyImages = import.meta.glob('../../assets/History/*.{jpg,jpeg,png,gif}') as Record<
  string,
  () => Promise<{ default: string }>
>

// Reactive reference to hold the image URL
const historyImage = ref('')

// Use onMounted to ensure the component is ready before trying to load the image
onMounted(() => {
  // Log all paths found by import.meta.glob for debugging purposes
  console.log('Paths found by import.meta.glob:', Object.keys(historyImages))

  // Define the exact path to the image we want to load
  // IMPORTANT: This path must match exactly what import.meta.glob finds, including casing.
  const targetImagePath = '../../assets/History/hospital_old.png'

  // Check if the target image path exists in the glob result
  if (historyImages[targetImagePath]) {
    // Call the function associated with the specific path to load the image
    historyImages[targetImagePath]()
      .then((module) => {
        // The loaded module's default export is the image URL
        historyImage.value = module.default
        console.log('Image loaded successfully:', historyImage.value) // Log for debugging
      })
      .catch((error) => {
        console.error('Error loading image from glob:', error)
        // Optionally set a placeholder image or display an error message
        // historyImage.value = 'path/to/placeholder_error.png';
      })
  } else {
    console.warn(
      `Image '${targetImagePath}' not found by import.meta.glob. Please check the path and filename.`,
    )
    console.warn('Available paths from glob:', Object.keys(historyImages)) // Show available paths again
  }
})
</script>

<style scoped>
/* Add specific styles for this page if needed */
</style>
