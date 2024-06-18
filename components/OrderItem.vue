<script setup lang="ts">
import toRupiah from "@develoka/angka-rupiah-js"
const props = defineProps<{
    item: {
        book: {
            title: string
            slug: string
            cover_image?: string
        }
        qty: number
        item_price: number
    }
}>()
</script>
<template>
    <div class="card bg-secondary mb-3 w-100">
        <div class="card-body">
            <div class="d-flex">
                <div style="flex-shrink: 0">
                    <NuxtLink :to="`/books/${item.book.slug}`">
                        <img :src="useBookCoverUrl(item.book.cover_image)"
                            onerror="this.onerror=null; this.src='/fallback_image.jpg'"
                            :alt="`${item.book.title}'s Cover Image`" style="max-height: 80px; max-width: 60px;" />
                    </NuxtLink>
                </div>
                <div class="ms-4" style="flex-grow: 1">
                    <NuxtLink :to="`/books/${item.book.slug}`" class="fw-bold"
                        style="text-decoration: none; color: unset">{{ item.book.title }}</NuxtLink>
                    <div class="d-flex justify-content-between text-sm mt-3">
                        <div>Qty</div>
                        <div>{{ item.qty }}</div>
                    </div>
                    <div class="d-flex justify-content-between text-sm">
                        <div>Item Price</div>
                        <div class="text-primary">
                            {{ toRupiah(item.item_price, { floatingPoint: 0 }) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
