import { supabase } from '@/lib/supabase'

const BUCKET = 'product-images'

export async function uploadProductImage(file: File) {
  if (!file) throw new Error('File tidak ditemukan')

  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Format gambar tidak didukung')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`

  const filePath = `products/${fileName}` 

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Upload error:', error)
    throw error
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath)

  return {
    path: filePath,
    publicUrl: data.publicUrl,
  }
}