
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