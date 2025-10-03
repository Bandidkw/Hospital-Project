<template>
  <main class="bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-10">
      <header class="mb-10 text-center">
        <h1
          class="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-3"
        >
          <i class="fas fa-exchange-alt text-blue-600"></i>
          <span>แบบฟอร์มแจ้งการส่งตัวผู้ป่วย</span>
        </h1>
        <p class="text-gray-600 mt-2">กรุณากรอกข้อมูลให้ครบถ้วนเพื่อความสะดวกในการประสานงาน</p>
      </header>

      <div class="mb-8 flex justify-between items-center border-b pb-4">
        <div v-for="step in 4" :key="step" class="text-center w-1/4">
          <div
            class="mx-auto w-8 h-8 rounded-full flex items-center justify-center text-lg"
            :class="
              currentStep === step
                ? 'bg-blue-600 text-white'
                : currentStep > step
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
            "
          >
            <i v-if="currentStep > step" class="fas fa-check"></i>
            <span velse>{{ step }}</span>
          </div>
          <p class="text-xs mt-1" :class="currentStep >= step ? 'font-semibold' : 'text-gray-500'">
            {{ stepLabels[step - 1] }}
          </p>
        </div>
      </div>

      <div class="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <section v-if="currentStep === 1" class="space-y-4">
          <h2 class="text-2xl font-bold text-gray-800">1. ข้อมูลผู้ป่วยและต้นทาง</h2>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label for="patientName" class="block text-sm font-medium text-gray-700"
                >ชื่อ-นามสกุล ผู้ป่วย</label
              >
              <input
                id="patientName"
                v-model="formData.patientName"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label for="patientHN" class="block text-sm font-medium text-gray-700"
                >เลข HN (Hospital Number)</label
              >
              <input
                id="patientHN"
                v-model="formData.patientHN"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          <div>
            <label for="originHospital" class="block text-sm font-medium text-gray-700"
              >โรงพยาบาลต้นทาง</label
            >
            <select
              id="originHospital"
              v-model="formData.originHospitalId"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option disabled value="">-- กรุณาเลือกโรงพยาบาล --</option>
              <option v-for="hospital in hospitalList" :key="hospital.id" :value="hospital.id">
                {{ hospital.name }}
              </option>
            </select>
          </div>
          <div>
            <label for="referralFile" class="block text-sm font-medium text-gray-700"
              >อัปโหลดเอกสารส่งตัว (ถ้ามี)</label
            >
            <input
              id="referralFile"
              @change="onFileChange"
              type="file"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </section>

        <section v-if="currentStep === 2" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-800">2. โรงพยาบาลปลายทางและคลินิก</h2>
          <div
            v-for="(dest, destIndex) in formData.destinations"
            :key="destIndex"
            class="p-4 border rounded-lg bg-gray-50 space-y-3"
          >
            <div class="flex justify-between items-start">
              <h3 class="font-semibold pt-2">ปลายทางที่ {{ destIndex + 1 }}</h3>
              <button
                v-if="formData.destinations.length > 1"
                @click="removeDestination(destIndex)"
                type="button"
                class="px-3 py-2 text-red-600 hover:text-red-800"
                title="ลบปลายทางนี้"
              >
                <i class="fas fa-times-circle"></i>
              </button>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">โรงพยาบาลปลายทาง</label>
              <select
                v-model="dest.hospitalId"
                @change="handleHospitalChange(destIndex)"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option disabled value="">-- กรุณาเลือกโรงพยาบาล --</option>
                <option v-for="hospital in hospitalList" :key="hospital.id" :value="hospital.id">
                  {{ hospital.name }}
                </option>
              </select>
            </div>
            <div
              v-for="(clinic, clinicIndex) in dest.clinics"
              :key="clinicIndex"
              class="flex items-end gap-2"
            >
              <div class="flex-grow">
                <label class="block text-sm font-medium text-gray-700">คลินิก/แผนก</label>
                <select
                  v-model="clinic.clinicId"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  :disabled="!dest.hospitalId"
                >
                  <option disabled value="">
                    {{ dest.hospitalId ? '-- กรุณาเลือกคลินิก --' : 'โปรดเลือกโรงพยาบาลก่อน' }}
                  </option>
                  <option
                    v-for="clinicOpt in dest.availableClinics"
                    :key="clinicOpt.id"
                    :value="clinicOpt.id"
                  >
                    {{ clinicOpt.name }}
                  </option>
                </select>
              </div>
              <button
                v-if="dest.clinics.length > 1"
                @click="removeClinic(destIndex, clinicIndex)"
                type="button"
                class="px-3 py-2 text-red-600 hover:text-red-800"
                title="ลบคลินิก"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <button
              @click="addClinic(destIndex)"
              type="button"
              class="text-sm text-blue-600 hover:underline"
            >
              + เพิ่มคลินิก/ใบนัด
            </button>
          </div>
          <button
            @click="addDestination"
            type="button"
            class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            + เพิ่มโรงพยาบาลปลายทางอื่น
          </button>
        </section>

        <section v-if="currentStep === 3" class="space-y-4">
          <h2 class="text-2xl font-bold text-gray-800">3. เลือกวันและเวลาเดินทาง</h2>
          <div class="flex justify-center pt-4">
            <!-- component -->
            <CustomCalendar v-model="formData.travelDate" />
            <!-- <div class="lg:flex lg:h-full lg:flex-col">
              <header
                class="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none"
              >
                <h1 class="text-base font-semibold leading-6 text-gray-900">
                  <time datetime="2022-01">January 2022</time>
                </h1>
                <div class="flex items-center">
                  <div
                    class="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch"
                  >
                    <button
                      type="button"
                      class="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
                    >
                      <span class="sr-only">Previous month</span>
                      <svg
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      class="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
                    >
                      Today
                    </button>
                    <span class="relative -mx-px h-5 w-px bg-gray-300 md:hidden"></span>
                    <button
                      type="button"
                      class="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
                    >
                      <span class="sr-only">Next month</span>
                      <svg
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div class="hidden md:ml-4 md:flex md:items-center">
                    <div class="relative">
                      <button
                        type="button"
                        class="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        id="menu-button"
                        aria-expanded="false"
                        aria-haspopup="true"
                      >
                        Month view
                        <svg
                          class="-mr-1 h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                      <div
                        class="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabindex="-1"
                      >
                        <div class="py-1" role="none">
                          <a
                            href="#"
                            class="text-gray-700 block px-4 py-2 text-sm"
                            role="menuitem"
                            tabindex="-1"
                            id="menu-item-0"
                            >Day view</a
                          >
                          <a
                            href="#"
                            class="text-gray-700 block px-4 py-2 text-sm"
                            role="menuitem"
                            tabindex="-1"
                            id="menu-item-1"
                            >Week view</a
                          >
                          <a
                            href="#"
                            class="text-gray-700 block px-4 py-2 text-sm"
                            role="menuitem"
                            tabindex="-1"
                            id="menu-item-2"
                            >Month view</a
                          >
                          <a
                            href="#"
                            class="text-gray-700 block px-4 py-2 text-sm"
                            role="menuitem"
                            tabindex="-1"
                            id="menu-item-3"
                            >Year view</a
                          >
                        </div>
                      </div>
                    </div>
                    <div class="ml-6 h-6 w-px bg-gray-300"></div>
                    <button
                      type="button"
                      class="ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      Add event
                    </button>
                  </div>
                  <div class="relative ml-6 md:hidden">
                    <button
                      type="button"
                      class="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500"
                      id="menu-0-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span class="sr-only">Open menu</span>
                      <svg
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                        />
                      </svg>
                    </button>
                    <div
                      class="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="menu-0-button"
                      tabindex="-1"
                    >
                      <div class="py-1" role="none">
                        <a
                          href="#"
                          class="text-gray-700 block px-4 py-2 text-sm"
                          role="menuitem"
                          tabindex="-1"
                          id="menu-0-item-0"
                          >Create event</a
                        >
                      </div>
                      <div class="py-1" role="none">
                        <a
                          href="#"
                          class="text-gray-700 block px-4 py-2 text-sm"
                          role="menuitem"
                          tabindex="-1"
                          id="menu-0-item-1"
                          >Go to today</a
                        >
                      </div>
                      <div class="py-1" role="none">
                        <a
                          href="#"
                          class="text-gray-700 block px-4 py-2 text-sm"
                          role="menuitem"
                          tabindex="-1"
                          id="menu-0-item-2"
                          >Day view</a
                        >
                        <a
                          href="#"
                          class="text-gray-700 block px-4 py-2 text-sm"
                          role="menuitem"
                          tabindex="-1"
                          id="menu-0-item-3"
                          >Week view</a
                        >
                        <a
                          href="#"
                          class="text-gray-700 block px-4 py-2 text-sm"
                          role="menuitem"
                          tabindex="-1"
                          id="menu-0-item-4"
                          >Month view</a
                        >
                        <a
                          href="#"
                          class="text-gray-700 block px-4 py-2 text-sm"
                          role="menuitem"
                          tabindex="-1"
                          id="menu-0-item-5"
                          >Year view</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </header>
              <div class="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
                <div
                  class="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none"
                >
                  <div class="flex justify-center bg-white py-2">
                    <span>M</span>
                    <span class="sr-only sm:not-sr-only">on</span>
                  </div>
                  <div class="flex justify-center bg-white py-2">
                    <span>T</span>
                    <span class="sr-only sm:not-sr-only">ue</span>
                  </div>
                  <div class="flex justify-center bg-white py-2">
                    <span>W</span>
                    <span class="sr-only sm:not-sr-only">ed</span>
                  </div>
                  <div class="flex justify-center bg-white py-2">
                    <span>T</span>
                    <span class="sr-only sm:not-sr-only">hu</span>
                  </div>
                  <div class="flex justify-center bg-white py-2">
                    <span>F</span>
                    <span class="sr-only sm:not-sr-only">ri</span>
                  </div>
                  <div class="flex justify-center bg-white py-2">
                    <span>S</span>
                    <span class="sr-only sm:not-sr-only">at</span>
                  </div>
                  <div class="flex justify-center bg-white py-2">
                    <span>S</span>
                    <span class="sr-only sm:not-sr-only">un</span>
                  </div>
                </div>
                <div class="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
                  <div class="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
                    <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
                      <time datetime="2021-12-27">27</time>
                    </div>
                    <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
                      <time datetime="2021-12-28">28</time>
                    </div>
                    <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
                      <time datetime="2021-12-29">29</time>
                    </div>
                    <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
                      <time datetime="2021-12-30">30</time>
                    </div>
                    <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
                      <time datetime="2021-12-31">31</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-01">1</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-01">2</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-03">3</time>
                      <ol class="mt-2">
                        <li>
                          <a href="#" class="group flex">
                            <p
                              class="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600"
                            >
                              Design review
                            </p>
                            <time
                              datetime="2022-01-03T10:00"
                              class="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                              >10AM</time
                            >
                          </a>
                        </li>
                        <li>
                          <a href="#" class="group flex">
                            <p
                              class="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600"
                            >
                              Sales meeting
                            </p>
                            <time
                              datetime="2022-01-03T14:00"
                              class="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                              >2PM</time
                            >
                          </a>
                        </li>
                      </ol>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-04">4</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-05">5</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-06">6</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-07">7</time>
                      <ol class="mt-2">
                        <li>
                          <a href="#" class="group flex">
                            <p
                              class="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600"
                            >
                              Date night
                            </p>
                            <time
                              datetime="2022-01-08T18:00"
                              class="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                              >6PM</time
                            >
                          </a>
                        </li>
                      </ol>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-08">8</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-09">9</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-10">10</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-11">11</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time
                        datetime="2022-01-12"
                        class="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white"
                        >12</time
                      >
                      <ol class="mt-2">
                        <li>
                          <a href="#" class="group flex">
                            <p
                              class="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600"
                            >
                              Sam's birthday party
                            </p>
                            <time
                              datetime="2022-01-25T14:00"
                              class="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                              >2PM</time
                            >
                          </a>
                        </li>
                      </ol>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-13">13</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-14">14</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-15">15</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-16">16</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-17">17</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-18">18</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-19">19</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-20">20</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-21">21</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-22">22</time>
                      <ol class="mt-2">
                        <li>
                          <a href="#" class="group flex">
                            <p
                              class="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600"
                            >
                              Maple syrup museum
                            </p>
                            <time
                              datetime="2022-01-22T15:00"
                              class="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                              >3PM</time
                            >
                          </a>
                        </li>
                        <li>
                          <a href="#" class="group flex">
                            <p
                              class="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600"
                            >
                              Hockey game
                            </p>
                            <time
                              datetime="2022-01-22T19:00"
                              class="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                              >7PM</time
                            >
                          </a>
                        </li>
                      </ol>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-23">23</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-24">24</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-25">25</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-26">26</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-27">27</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-28">28</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-29">29</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-30">30</time>
                    </div>
                    <div class="relative bg-white px-3 py-2">
                      <time datetime="2022-01-31">31</time>
                    </div>
                    <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
                      <time datetime="2022-02-01">1</time>
                    </div>
                    <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
                      <time datetime="2022-02-02">2</time>
                    </div>
                    <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
                      <time datetime="2022-02-03">3</time>
                    </div>
                    <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
                      <time datetime="2022-02-04">4</time>
                      <ol class="mt-2">
                        <li>
                          <a href="#" class="group flex">
                            <p
                              class="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600"
                            >
                              Cinema with friends
                            </p>
                            <time
                              datetime="2022-02-04T21:00"
                              class="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                              >9PM</time
                            >
                          </a>
                        </li>
                      </ol>
                    </div>
                    <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
                      <time datetime="2022-02-05">5</time>
                    </div>
                    <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
                      <time datetime="2022-02-06">6</time>
                    </div>
                  </div>
                  <div class="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2021-12-27" class="ml-auto">27</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2021-12-28" class="ml-auto">28</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2021-12-29" class="ml-auto">29</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2021-12-30" class="ml-auto">30</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2021-12-31" class="ml-auto">31</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-01" class="ml-auto">1</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-02" class="ml-auto">2</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-03" class="ml-auto">3</time>
                      <span class="sr-only">2 events</span>
                      <span class="-mx-0.5 mt-auto flex flex-wrap-reverse">
                        <span class="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                        <span class="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                      </span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-04" class="ml-auto">4</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-05" class="ml-auto">5</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-06" class="ml-auto">6</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-07" class="ml-auto">7</time>
                      <span class="sr-only">1 event</span>
                      <span class="-mx-0.5 mt-auto flex flex-wrap-reverse">
                        <span class="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                      </span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-08" class="ml-auto">8</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-09" class="ml-auto">9</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-10" class="ml-auto">10</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-11" class="ml-auto">11</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 font-semibold text-indigo-600 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-12" class="ml-auto">12</time>
                      <span class="sr-only">1 event</span>
                      <span class="-mx-0.5 mt-auto flex flex-wrap-reverse">
                        <span class="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                      </span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-13" class="ml-auto">13</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-14" class="ml-auto">14</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-15" class="ml-auto">15</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-16" class="ml-auto">16</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-17" class="ml-auto">17</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-18" class="ml-auto">18</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-19" class="ml-auto">19</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-20" class="ml-auto">20</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-21" class="ml-auto">21</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 font-semibold text-white hover:bg-gray-100 focus:z-10"
                    >
                      <time
                        datetime="2022-01-22"
                        class="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-gray-900"
                        >22</time
                      >
                      <span class="sr-only">2 events</span>
                      <span class="-mx-0.5 mt-auto flex flex-wrap-reverse">
                        <span class="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                        <span class="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                      </span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-23" class="ml-auto">23</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-24" class="ml-auto">24</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-25" class="ml-auto">25</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-26" class="ml-auto">26</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-27" class="ml-auto">27</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-28" class="ml-auto">28</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-29" class="ml-auto">29</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-30" class="ml-auto">30</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-white px-3 py-2 text-gray-900 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-01-31" class="ml-auto">31</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-02-01" class="ml-auto">1</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-02-02" class="ml-auto">2</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-02-03" class="ml-auto">3</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-02-04" class="ml-auto">4</time>
                      <span class="sr-only">1 event</span>
                      <span class="-mx-0.5 mt-auto flex flex-wrap-reverse">
                        <span class="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                      </span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-02-05" class="ml-auto">5</time>
                      <span class="sr-only">0 events</span>
                    </button>
                    <button
                      type="button"
                      class="flex h-14 flex-col bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100 focus:z-10"
                    >
                      <time datetime="2022-02-06" class="ml-auto">6</time>
                      <span class="sr-only">0 events</span>
                    </button>
                  </div>
                </div>
              </div>
            </div> -->
          </div>
        </section>

        <section v-if="currentStep === 4">
          <h2 class="text-2xl font-bold text-gray-800">4. ตรวจสอบและยืนยันข้อมูล</h2>
          <p class="text-gray-600 mt-4">กรุณาตรวจสอบข้อมูลทั้งหมดให้ถูกต้องก่อนกดยืนยัน</p>
        </section>

        <div class="mt-8 flex justify-between">
          <button
            v-if="currentStep > 1"
            @click="prevStep"
            type="button"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            ย้อนกลับ
          </button>
          <div v-else></div>
          <button
            v-if="currentStep < 4"
            @click="nextStep"
            type="button"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            ถัดไป
          </button>
          <button
            v-if="currentStep === 4"
            type="submit"
            class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            ยืนยันการส่งข้อมูล
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
// import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import CustomCalendar from '@/components/CustomCalendar.vue'

// --- Interfaces for Data ---
interface Hospital {
  id: string
  name: string
}
interface Clinic {
  id: string
  name: string
}

// --- Mock Data ---
const mockHospitals: Hospital[] = [
  { id: 'h01', name: 'โรงพยาบาลแม่แตง' },
  { id: 'h02', name: 'โรงพยาบาลนครพิงค์' },
  { id: 'h03', name: 'โรงพยาบาลมหาราชนครเชียงใหม่' },
]
const mockClinics: Record<string, Clinic[]> = {
  h01: [
    { id: 'h01c01', name: 'คลินิกอายุรกรรม' },
    { id: 'h01c02', name: 'คลินิกศัลยกรรม' },
  ],
  h02: [
    { id: 'h02c01', name: 'แผนกโรคหัวใจ' },
    { id: 'h02c02', name: 'แผนกจักษุวิทยา' },
  ],
  h03: [{ id: 'h03c01', name: 'ศูนย์ความเป็นเลิศทางการแพทย์' }],
}

// --- Component State ---
const currentStep = ref(1)
const stepLabels = ['ข้อมูลผู้ป่วย', 'เลือกปลายทาง', 'เลือกวันเวลา', 'ยืนยันข้อมูล']
const hospitalList = ref<Hospital[]>([])

const formData = reactive({
  patientName: '',
  patientHN: '',
  originHospitalId: '',
  referralFile: null as File | null,
  destinations: [
    {
      hospitalId: '',
      availableClinics: [] as Clinic[],
      clinics: [{ clinicId: '' }],
    },
  ],
  travelDate: new Date(),
})

// --- API Fetching Functions ---
const fetchHospitals = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  hospitalList.value = mockHospitals
}
const fetchClinicsForHospital = async (hospitalId: string): Promise<Clinic[]> => {
  if (!hospitalId) return []
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockClinics[hospitalId] || []
}

onMounted(() => {
  fetchHospitals()
})

// --- Methods ---
const handleHospitalChange = async (destIndex: number) => {
  const destination = formData.destinations[destIndex]
  destination.availableClinics = []
  destination.clinics = [{ clinicId: '' }]
  if (destination.hospitalId) {
    const clinics = await fetchClinicsForHospital(destination.hospitalId)
    destination.availableClinics = clinics
  }
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    formData.referralFile = target.files[0]
  }
}

const addDestination = () => {
  formData.destinations.push({ hospitalId: '', availableClinics: [], clinics: [{ clinicId: '' }] })
}
const removeDestination = (index: number) => {
  if (formData.destinations.length > 1) {
    formData.destinations.splice(index, 1)
  }
}
const addClinic = (destIndex: number) => {
  formData.destinations[destIndex].clinics.push({ clinicId: '' })
}
const removeClinic = (destIndex: number, clinicIndex: number) => {
  if (formData.destinations[destIndex].clinics.length > 1) {
    formData.destinations[destIndex].clinics.splice(clinicIndex, 1)
  }
}

const nextStep = () => {
  if (currentStep.value < 4) currentStep.value++
}
const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}
</script>

<style scoped></style>
