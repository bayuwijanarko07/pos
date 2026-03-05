export interface Order {
  id: string
  invoice_no: string
  cashier_id: string
  total: number
  discount: number
  tax: number
  grand_total: number
  payment_status: 'pending' | 'paid'
  sync_status: boolean
  created_at?: string
}

export interface OrderItem {
  id?: string
  order_id: string
  product_id: string
  qty: number
  price: number
  sub_total: number
}