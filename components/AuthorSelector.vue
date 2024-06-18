<script setup lang="ts">
import { toast } from 'vue-sonner';

defineProps<{
    error?: string
    wrapperClass?: string
}>()

const model = defineModel()
const initialLoading = ref(true)
const data = ref<{ id: number, name: string }[]>()

async function getData() {
    try {
        initialLoading.value = true
        await useApiFetch('/csrf-cookie')

        const result = await useApiFetch('/admin/authors?forDropdown=true', {
            headers: {
                Accept: 'application/json',
            },
        })

        if (result?.error.value) {
            toast.error(result.error.value?.message)
            return
        }

        data.value = (result.data.value as any).data as { id: number, name: string }[]
    } catch (error: any) {
        toast.error(error.message)
    } finally {
        initialLoading.value = false
    }
}

onMounted(async () => {
    await getData();
})
</script>
<template>
    <div :class="['placeholder-glow', wrapperClass]" v-if="initialLoading">
        <div class="placeholder w-100" style="height: 39px; border-radius: var(--bs-border-radius);"></div>
    </div>

    <div :class="['d-flex flex-column', wrapperClass]" v-else>
        <div class="input-group">
            <span class="input-group-text fw-bold">Author</span>
            <select :class="{ 'form-select': true, 'border border-danger': error }" aria-describedby="authorHelp"
                v-model="model">
                <option v-for="(item, i) in data" :value="item.id" :selected="i === 0">
                    {{ item.name }}
                </option>
            </select>
        </div>
        <div id="authorHelp" class="form-text text-xs text-danger" v-if="error">
            {{ error }}
        </div>
    </div>
</template>
