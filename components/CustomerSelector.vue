<script setup lang="ts">
import { toast } from 'vue-sonner';

const props = defineProps<{
    ariaDescribedby?: string
    error?: string
    label: string
}>()

const model = defineModel()
const initialLoading = ref(true)
const customers = ref<Pick<User, 'id' | 'name'>[]>()

async function getCustomers() {
    try {
        initialLoading.value = true
        await useApiFetch('/csrf-cookie')

        const result = await useApiFetch('/admin/customers?forDropdown=true', {
            headers: {
                Accept: 'application/json',
            },
        })

        if (result?.error.value) {
            toast.error(result.error.value?.message)
            return
        }

        customers.value = (result.data.value as any).data as Author[]
    } catch (error: any) {
        toast.error(error.message)
    } finally {
        initialLoading.value = false
    }
}

onMounted(async () => {
    await getCustomers();
})
</script>
<template>
    <div class="placeholder-glow" v-if="initialLoading">
        <div class="placeholder w-100" style="height: 39px; border-radius: var(--bs-border-radius);"></div>
    </div>

    <div class="d-flex flex-column" v-else>
        <div class="input-group">
            <span class="input-group-text fw-bold">{{ label }}</span>
            <select :class="{ 'form-select': true, 'border border-danger': error }" :aria-describedby="ariaDescribedby"
                v-model="model">
                <option v-for="(customer, i) in customers" :value="customer.id" :selected="i === 0">
                    {{ customer.id }} ⠂ {{ customer.name }}
                </option>
            </select>
        </div>
        <div id="ariaDescribedby" class="form-text text-xs text-danger" v-if="error">
            {{ error }}
        </div>
    </div>
</template>
