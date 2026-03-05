import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { useCartStore } from './cart'
import type { OrderItem } from '@/types/order'

export const useOrderStore = defineStore('order', {
  state: () => ({
    loading: false,
    error: null as string | null
  }),

  actions: {
    generateInvoice() {
      const date = new Date()
      return `INV-${date.getFullYear()}${date.getMonth()+1}${date.getDate()}-${Date.now()}`
    },

    async createOrder(cashierId: string) {
      const cartStore = useCartStore()

      if (!cartStore.cart.length) return

      this.loading = true

      try {

        const total = cartStore.totalPrice
        const discount = 0
        const tax = 0
        const grandTotal = total - discount + tax

        const invoice = this.generateInvoice()

        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            invoice_no: invoice,
            cashier_id: cashierId,
            total: total,
            discount: discount,
            tax: tax,
            grand_total: grandTotal,
            payment_status: 'pending',
            sync_status: false
          })
          .select()
          .single()

        if (orderError) throw orderError

        const items: OrderItem[] = cartStore.cart.map(item => ({
          order_id: order.id,
          product_id: item.id,
          qty: item.qty,
          price: item.price,
          sub_total: item.qty * item.price
        }))

        const { error: itemError } = await supabase
          .from('order_items')
          .insert(items)

        if (itemError) throw itemError

        cartStore.clearCart()

        return order

      } catch (err: any) {
        this.error = err.message
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
})