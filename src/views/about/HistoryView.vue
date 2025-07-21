<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-md my-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">ประวัติโรงพยาบาล</h1>
    <p class="text-gray-700 leading-relaxed mb-4">
      โรงพยาบาลแม่แตง ก่อตั้งขึ้นเมื่อปี พ.ศ. 25XX
      ด้วยความมุ่งมั่นที่จะให้บริการทางการแพทย์ที่มีคุณภาพแก่ประชาชนในพื้นที่อำเภอแม่แตงและใกล้เคียง
      เริ่มต้นจากการเป็นสถานีอนามัยขนาดเล็กที่ให้บริการพื้นฐาน
      ก่อนจะได้รับการพัฒนาและขยายขีดความสามารถอย่างต่อเนื่อง จนกระทั่งกลายเป็นโรงพยาบาลชุมชนขนาด XX
      เตียงในปัจจุบัน
    </p>
    <p class="text-gray-700 leading-relaxed mb-4">
      ตลอดระยะเวลาที่ผ่านมา โรงพยาบาลได้ทุ่มเทพัฒนาบุคลากรทางการแพทย์ เครื่องมือและอุปกรณ์ที่ทันสมัย
      รวมถึงการนำเทคโนโลยีใหม่ๆ มาใช้ในการวินิจฉัยและรักษาโรค เพื่อให้ประชาชนได้รับบริการที่ดีที่สุด
      เราภาคภูมิใจที่เป็นส่วนหนึ่งในการดูแลสุขภาพของชุมชน และจะยังคงมุ่งมั่นพัฒนาต่อไปไม่หยุดยั้ง
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
