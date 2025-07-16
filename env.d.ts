/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly BASE_URL: string; // เพิ่มบรรทัดนี้
  // เพิ่มตัวแปร env อื่นๆ ที่คุณใช้ เช่น VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
