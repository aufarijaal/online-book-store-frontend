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
const initialLoading = ref(true)

const myChartRef = ref<HTMLCanvasElement>()

async function getCounts() {
  initialLoading.value = true
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch('/admin/dashboard', {
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

  initialLoading.value = false
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
    <div class="col row gap-3 placeholder-glow" v-if="initialLoading">
      <div class="placeholder col-12 col-md" style="height: 150px;" v-for="n in 4"></div>
    </div>

    <div class="col row gap-3" v-else>
      <div class="col-12 col-md card p-3">
        <div>
          <Icon name="material-symbols:category-outline" class="text-success" size="32" />
        </div>
        <div class="fs-1 fw-bolder">{{ counts.genresCount }}</div>
        <div class="fs-6">Total Genres</div>
      </div>

      <div class="col-12 col-md card p-3">
        <div>
          <Icon name="material-symbols:book" class="text-primary" size="32" />
        </div>
        <div class="fs-1 fw-bolder">{{ counts.booksCount }}</div>
        <div class="fs-6">Total Books</div>
      </div>

      <div class="col-12 col-md card p-3">
        <div>
          <Icon name="mdi:account-edit" class="text-warning" size="32" />
        </div>
        <div class="fs-1 fw-bolder">{{ counts.authorsCount }}</div>
        <div class="fs-6">Total Authors</div>
      </div>

      <div class="col-12 col-md card p-3">
        <div>
          <Icon name="map:shopping-mall" class="text-info" size="32" />
        </div>
        <div class="fs-1 fw-bolder">{{ counts.customersCount }}</div>
        <div class="fs-6">Total Customers</div>
      </div>
    </div>

    <div class="row mt-5 placeholder-glow" v-if="initialLoading">
      <div class="col placeholder w-100" style="height: 300px"></div>
    </div>

    <div class="row mt-5" v-else>
      <div class="col">
        <canvas id="myChart" ref="myChartRef"></canvas>
      </div>
    </div>
  </div>
</template>

<style></style>
