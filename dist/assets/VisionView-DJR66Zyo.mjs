import{d as u,u as m,r as d,o as x,c as a,a as i,b as s,e as n,t as p,_ as b}from"./index-C1nZs7mf.mjs";const f=`
  <ul class="list-disc list-inside text-gray-700 leading-relaxed space-y-3 text-lg">
    <li>
      พัฒนาการมีส่วนของภาคีเครือข่ายในการส่งเสริมการดูแลสุขภาพ ป้องกันควบคุมโรค ฟื้นฟู และรักษา
      แก่ประชาชนอำเภอแม่แตง รวมถึง 3 ศูนย์
    </li>
    <li>
      สนับสนุนการทำงานของบุคลากร โดยจัดบริการให้มีประสิทธิภาพด้วยเทคโนโลยีสารสนเทศที่ทันสมัย
      เพื่อให้องค์กรมีความสุข
    </li>
  </ul>
`,g=`
  <ul class="list-disc list-inside text-gray-700 leading-relaxed space-y-3 text-lg">
    <li>
      <span class="font-bold">การพัฒนาตนเอง (Self Development):</span> การเรียนรู้ สร้างความสามารถของตนเองอยู่เสมอ
      เพื่อให้ทันต่อการเปลี่ยนแปลงที่เกิดขึ้น <br>โดยเป็นการพัฒนาด้านจิตใจ สติปัญญา
      ความฉลาดทางอารมณ์ ด้านสังคมและความรู้ที่มีอยู่ในตนเองให้เพิ่มมากขึ้น
    </li>
    <li>
      <span class="font-bold">จรรยาบรรณ (Ethics):</span> การที่บุคลกรผู้ประกอบอาชีพการให้บริการสุขภาพแก่ประชาชนพึง
      กระทำตามมาตรฐานวิชาชีพ และมาตรฐานงาน
      <br>เพื่อให้การให้บริการและการปฏิบัติงานมีประสิทธิภาพและสมศักดิ์ศรีของวิชาชีพ
    </li>
    <li>
      <span class="font-bold">สามัคคี (Harmony):</span> บุคลากรมีความร่วมมือ ร่วมใจ ในการพัฒนางานโดยพร้อมเพรียงกัน
      เพื่อให้งานบรรลุเป้าหมายที่กำหนดอย่างสร้างสรรค์
    </li>
    <li>
      <span class="font-bold">เสียสละ (Sacrifice):</span> บุคลากรมีคุณธรรมขั้นพื้นฐาน
      คือการเป็นผู้ให้เพื่อเป็นประโยชน์แก่ผู้อื่นและองค์กรโดยตนเองไม่เดือดร้อน
      <br>สร้างให้เกิดความสุขในองค์กร
    </li>
  </ul>
`,_={id:"1",vision:"โรงพยาบาลแม่แตงเป็นโรงพยาบาลคุณภาพ ผู้รับบริการปลอดภัย ผู้ให้บริการมีความสุข",missionHtml:f,coreValuesHtml:g};async function v(){return new Promise(r=>{setTimeout(()=>{r(_)},300)})}const y={class:"container mx-auto p-8 bg-white rounded-lg shadow-xl my-8"},V={key:0,class:"text-center py-10"},h={key:1},w={class:"mb-8 p-6 rounded-lg bg-blue-50 border-l-4 border-blue-600 shadow-md"},H={class:"text-gray-800 leading-relaxed text-xl font-medium"},T={class:"mb-8 p-6 rounded-lg bg-green-50 border-l-4 border-green-600 shadow-md"},M=["innerHTML"],C={class:"p-6 rounded-lg bg-purple-50 border-l-4 border-purple-600 shadow-md"},N=["innerHTML"],k=u({__name:"VisionView",setup(r){const c=m(),t=d({id:"",vision:"",missionHtml:"",coreValuesHtml:""}),o=d(!0);return x(async()=>{o.value=!0;try{const l=await v();t.value=l}catch(l){console.error("Failed to load vision data:",l),c.error("ไม่สามารถโหลดข้อมูลวิสัยทัศน์และพันธกิจได้")}finally{o.value=!1}}),(l,e)=>(i(),a("div",y,[e[4]||(e[4]=s("h1",{class:"text-3xl font-bold text-gray-800 mb-6"},"วิสัยทัศน์และพันธกิจ",-1)),o.value?(i(),a("div",V,e[0]||(e[0]=[s("i",{class:"fas fa-spinner fa-spin text-4xl text-blue-500"},null,-1),s("p",{class:"mt-2 text-gray-600"},"กำลังโหลดข้อมูลวิสัยทัศน์...",-1)]))):(i(),a("div",h,[s("div",w,[e[1]||(e[1]=s("h2",{class:"text-2xl font-semibold text-blue-600 mb-3 flex items-center"},[s("i",{class:"fas fa-eye mr-3 text-blue-500"}),n(" วิสัยทัศน์ (Vision) ")],-1)),s("p",H,'"'+p(t.value.vision)+'"',1)]),s("div",T,[e[2]||(e[2]=s("h2",{class:"text-2xl font-semibold text-green-600 mb-3 flex items-center"},[s("i",{class:"fas fa-tasks mr-3 text-green-500"}),n(" พันธกิจ (Mission) ")],-1)),s("div",{innerHTML:t.value.missionHtml,class:"prose max-w-none text-gray-700"},null,8,M)]),s("div",C,[e[3]||(e[3]=s("h2",{class:"text-2xl font-semibold text-purple-600 mb-3 flex items-center"},[s("i",{class:"fas fa-bullseye mr-3 text-purple-500"}),n(" ค่านิยม (Core Values) ")],-1)),s("div",{innerHTML:t.value.coreValuesHtml,class:"prose max-w-none text-gray-700"},null,8,N)])]))]))}}),O=b(k,[["__scopeId","data-v-56cca4f3"]]);export{O as default};
