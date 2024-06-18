<script setup lang="ts">
import type { CSSProperties } from 'vue';

defineProps<{
    images: string[]
    imagesStyles?: CSSProperties
}>()
</script>

<template>
    <div id="carouselExampleIndicators" class="carousel slide">
        <div class="carousel-indicators">
            <button v-for="n in images.length" type="button" data-bs-target="#carouselExampleIndicators"
                :data-bs-slide-to="n - 1" :class="{ 'active': n - 1 === 0 }" :aria-current="n - 1 === 0"
                :aria-label="`Slide ${n}`"></button>
        </div>
        <div class="carousel-inner">
            <div :class="{ 'carousel-item': true, 'active': i === 0 }" v-for="(img, i) in images">
                <img :src="img" class="d-block w-100" alt="carousel image" :style="imagesStyles">
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
</template>