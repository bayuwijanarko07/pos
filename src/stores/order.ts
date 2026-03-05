import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

interface Order {
  id: string
  invoice_no: string
  cashier_id: string
  total: number
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    order: null as Order | null
  }),

  actions: {
    async createOrder(cashierId: string) {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          cashier_id: cashierId,
          total: 0,
          grand_total: 0
        })
        .select()
        .single()

      if (error) throw error

      this.order = data
    }
  }
})