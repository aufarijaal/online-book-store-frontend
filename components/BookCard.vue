<script lang="ts" setup>
import toRupiah from "@develoka/angka-rupiah-js"

const props = defineProps<{
  book?: {
    title: string
    slug: string
    cover_image?: string
    author_name: string
    price: number
  }
}>()
</script>

<template>
  <NuxtLink style="width: 265px; height: 330px; text-decoration: none" :to="`/books/${book?.slug}`">
    <div class="card shadow-sm p-2">
      <img :src="useBookCoverUrl(book?.cover_image)" onerror="this.onerror=null; this.src='/fallback_image.jpg'" :style="{
        height: '200px',
        width: '100%',
        objectFit: 'contain',
      }" />

      <div class="card-body text-center d-flex flex-column justify-content-center gap-2">
        <div class="text-muted line-clamp-1">by {{ book?.author_name }}</div>
        <div class="fw-bold line-clamp-1">{{ book?.title }}</div>
        <div class="fw-bold text-success">
          {{ toRupiah(book?.price, { floatingPoint: 0 }) }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>