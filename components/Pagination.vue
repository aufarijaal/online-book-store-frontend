<script setup lang="ts">
const props = defineProps<{
    size?: "normal" | "small"
    paginationInfo: {
        currentPage: number
        hasPrevPage: boolean
        hasNextPage: boolean
        pages: {
            url?: string
            label: string
            active: boolean
        }[],
        lastPage: number
    }
    showSkeletonIf?: boolean
}>()
</script>

<template>
    <div class="placeholder-glow" v-if="showSkeletonIf">
        <div class="placeholder" :style="{
            width: '250px',
            height: size === 'small' ? '30px' : '42px'
        }"></div>
    </div>

    <nav v-bind="$attrs" v-else>
        <ul :class="['pagination m-0', size === 'small' ? 'sm' : '']">
            <li class="page-item">
                <NuxtLink :to="{ path: $route.path, query: { ...$route.query, page: 1 } }" class="page-link">
                    <Icon name="ic:baseline-skip-previous" size="18" />
                </NuxtLink>
            </li>

            <li :class="{ 'page-item': true, 'disabled': !paginationInfo.hasPrevPage }">
                <NuxtLink
                    :to="{ path: $route.path, query: { ...$route.query, page: paginationInfo.currentPage === 1 ? 1 : paginationInfo.currentPage - 1 } }"
                    class="page-link" :disabled="!paginationInfo.hasPrevPage">
                    <Icon name="ic:round-navigate-before" size="18" />
                </NuxtLink>
            </li>

            <li v-for="item in paginationInfo.pages" :key="item.label"
                :class="{ 'page-item': true, 'active': item.active }">
                <NuxtLink :to="{ path: $route.path, query: { ...$route.query, page: parseInt(item.label) } }"
                    class="page-link">
                    {{
                        item.label }}
                </NuxtLink>
            </li>

            <li :class="{ 'page-item': true, 'disabled': !paginationInfo.hasNextPage }">
                <NuxtLink :to="{ path: $route.path, query: { page: paginationInfo.currentPage + 1 } }" class="page-link"
                    :disabled="!paginationInfo.hasNextPage">
                    <Icon name="ic:round-navigate-next" size="18" />
                </NuxtLink>
            </li>

            <li class="page-item">
                <NuxtLink :to="{ path: $route.path, query: { page: paginationInfo.lastPage } }" class="page-link">
                    <Icon name="ic:baseline-skip-next" size="18" />
                </NuxtLink>
            </li>
        </ul>
    </nav>
</template>
