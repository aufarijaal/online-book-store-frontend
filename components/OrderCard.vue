<script setup lang="ts">
import toRupiah from "@develoka/angka-rupiah-js"

const props = defineProps<{
    order: {
        id: number
        status: "unpaid" | "paid"
        order_items: {
            book: {
                title: string
                slug: string
                cover_image?: string
            }
            qty: number
            item_price: number
        }[]
        total_amount: number
        order_date: string
        token: string
    }
}>()
const emit = defineEmits<{
    (event: 'payIfUnpaid', token: string): void;
}>()
</script>

<template>
    <div class="card bg-secondary mb-3 w-100">
        <div class="card-body">
            <div class="mb-3 d-flex justify-content-between align-items-center">
                <span class="text-muted text-sm">Order ID: #{{ order.id }}</span>
                <span :class="[
                    'badge',
                    order.status === 'unpaid' ? 'bg-warning' : order.status === 'paid' ? 'bg-primary' : 'bg-danger',
                ]">{{ order.status === 'unpaid' ? 'Unpaid' : order.status === 'paid' ? 'Paid' : 'Expired' }}</span>
            </div>
            <div>
                <OrderItem v-if="order.order_items" v-for="item in order.order_items" :item="item" />
            </div>
            <hr />
            <div class="d-flex align-items-center justify-content-end gap-2">
                <div>Total Amount:</div>
                <div class="fw-bold text-success">
                    {{ toRupiah(order.total_amount, { floatingPoint: 0 }) }}
                </div>
            </div>

            <div class="d-flex align-items-center justify-content-end gap-2 text-xs mt-2">
                <div>Order Date: {{ order.order_date }}</div>
            </div>

            <div class="d-flex align-items-center justify-content-end gap-2 text-xs mt-4">
                <button class="btn btn-success" @click="$emit('payIfUnpaid', order.token)"
                    v-if="order.status === 'unpaid'">
                    Finish Payment
                </button>

                <!-- <button disabled class="btn btn-primary" @click="() => { }"
              v-if="order.status === 'paid' || order.status === 'expired'">
              Reorder
            </button> -->
            </div>
        </div>
    </div>

</template>
