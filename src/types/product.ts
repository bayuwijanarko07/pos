
export interface Product {
  id: string
  name: string
  image_url: string
  price: number
  sku: string
  barcode: string
  is_active: boolean
  category: string
  category_id: string
  created_at: string
  stock: number
}

export interface Category {
  id: string
  name: string
  created_at: string
}

export interface Inventory {
    id: string
    product_id: string
    stock: number
    updated_at?: string
}

export type InventoryInsert = {
    product_id: string
    stock: number
}

export type InventoryUpdate = {
    id: string
    product_id: string
    stock: number
}

export interface ProductRow {
  id: string 
  name: string
  sku: string
  price: number
  image_url: string
  barcode: string
  is_active: boolean
  category_id: string
  created_at: string
  categories: { id: string; name: string }[] | null
  inventories: { stock: number }[] | null
}