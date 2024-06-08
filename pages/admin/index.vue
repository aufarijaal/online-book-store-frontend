<script lang="ts" setup>
const auth = useAuthStore()

definePageMeta({
  layout: 'admin',
  middleware: ['authenticated', 'admin'],
})

useHead({
  title: `Admin · Dashboard`,
  script: [
    {
      src: 'https://cdn.jsdelivr.net/npm/chart.js',
      defer: true,
    },
  ],
})

const counts = ref({
  booksCount: 0,
  genresCount: 0,
  authorsCount: 0,
  customersCount: 0,
  chart: null,
})

const myChartRef = ref<HTMLCanvasElement>()

async function getCounts() {
  await useApiFetch('/sanctum/csrf-cookie')

  const result = await useApiFetch('/api/v1/admin/dashboard', {
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    alert(result.error.value?.data.errors)
    return
  }

  counts.value.booksCount = (result.data.value as any).data.booksCount
  counts.value.genresCount = (result.data.value as any).data.genresCount
  counts.value.authorsCount = (result.data.value as any).data.authorsCount
  counts.value.customersCount = (result.data.value as any).data.customersCount
  counts.value.chart = (result.data.value as any).data.chart
}

onMounted(async () => {
  await getCounts()

  if (counts.value.chart) {
    // Create a new Chart instance
    const myChart = new Chart(myChartRef.value?.getContext('2d')!, {
      type: 'line', // Change this to the chart type you prefer (e.g., 'line', 'pie', etc.)
      data: counts.value.chart,
      options: {},
    })
  }
})
</script>

<template>
  <div class="p-4 pt-0 container">
    <div class="col row gap-3">
      <div class="col-12 col-md card p-3">
        <div>
          <svg class="text-success" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M6.5 11L12 2l5.5 9zm11 11q-1.875 0-3.187-1.312T13 17.5q0-1.875 1.313-3.187T17.5 13q1.875 0 3.188 1.313T22 17.5q0 1.875-1.312 3.188T17.5 22M3 21.5v-8h8v8zM17.5 20q1.05 0 1.775-.725T20 17.5q0-1.05-.725-1.775T17.5 15q-1.05 0-1.775.725T15 17.5q0 1.05.725 1.775T17.5 20M5 19.5h4v-4H5zM10.05 9h3.9L12 5.85zm8.5 2"
            />
          </svg>
        </div>
        <div class="fs-1 fw-bolder">{{ counts.genresCount }}</div>
        <div class="fs-6">Total Genres</div>
      </div>

      <div class="col-12 col-md card p-3">
        <div>
          <svg class="text-primary" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M6 22h15v-2H6.012C5.55 19.988 5 19.805 5 19s.55-.988 1.012-1H21V4c0-1.103-.897-2-2-2H6c-1.206 0-3 .799-3 3v14c0 2.201 1.794 3 3 3M5 8V5c0-.805.55-.988 1-1h13v12H5z"
            />
            <path fill="currentColor" d="M8 6h9v2H8z" />
          </svg>
        </div>
        <div class="fs-1 fw-bolder">{{ counts.booksCount }}</div>
        <div class="fs-6">Total Books</div>
      </div>

      <div class="col-12 col-md card p-3">
        <div>
          <AuthorIcon width="32" height="32" class="text-warning" />
        </div>
        <div class="fs-1 fw-bolder">{{ counts.authorsCount }}</div>
        <div class="fs-6">Total Authors</div>
      </div>

      <div class="col-12 col-md card p-3">
        <div>
          <svg class="text-info" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 50 50">
            <path
              fill="currentColor"
              d="M25.577 8.938c2.297.169 4.306-1.468 4.488-3.648c.184-2.191-1.53-4.108-3.827-4.277c-2.3-.167-4.309 1.46-4.487 3.651c-.179 2.19 1.536 4.103 3.826 4.274zM42.783 41l-1.388-12h-2.252c.021-1 .018-1.111-.051-1.718c-.067-.621-.264-1.075-.585-1.218c.263-.28.438-.636.472-1.037a1.76 1.76 0 0 0-.74-1.575l-5.732-3.768l-4.22-7.946c-.699-1.04-1.883-1.879-3.312-1.999c-1.098-.076-2.108.287-2.925.827l-8.374 6.482a1.658 1.658 0 0 0-.577.865l-1.951 7.851l-.148.233V26h-.016c-.327 0-.625.312-.739.725c-.11.405-.245.94-.245 1.373V29H7.826L6.438 41h5.609l-2.459 3.935c-.16.305-.348.736-.381 1.152c-.121 1.49 1.039 2.785 2.594 2.904c1.111.074 2.067-.462 2.648-1.318L18.599 41h.543l-.085-.737l1.151-1.852c.125-.248.522-.855.566-1.143l1.406-6.11l6.001 6.273l1.884 9.431c.301 1.115 1.263 2.035 2.543 2.129c1.557.118 2.92-.981 3.044-2.468l-.017-.548L34.651 41zM10.957 27.99c.056-.473.233-.742.545-.742l.117-.002c.315.381.783.642 1.323.686a1.904 1.904 0 0 0 1.553-.633a.677.677 0 0 1 .197.326c.083.287.131.616.131.887c0 .162-.008.488-.019.488h-3.876c-.013 0-.009-.643.029-1.01M16.688 29h-1.185c.025-1 .018-1.111-.047-1.718c-.056-.52-.203-.922-.436-1.128l1.479-6.442l2.917-2.257zm21.758 0h-3.879c-.016 0-.011-.643.029-1.01c.052-.473.232-.742.545-.742c.449 0 .856-.014 1.217-.022c.363-.013.858-.031 1.481-.031c.239 0 .401.142.491.431c.086.287.132.616.132.887l-.016.487zM25.9 26.717l1.88-7.936l1.581 2.983c.125.205.273.374.468.533L35.476 26h-.853c-.327 0-.447.312-.56.725c-.107.405-.063.94-.063 1.373V29h-2.532l-.409 3.53l-5.159-5.813z"
            />
          </svg>
        </div>
        <div class="fs-1 fw-bolder">{{ counts.customersCount }}</div>
        <div class="fs-6">Total Customers</div>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col">
        <canvas id="myChart" ref="myChartRef"></canvas>
      </div>
    </div>
  </div>
</template>

<style></style>
