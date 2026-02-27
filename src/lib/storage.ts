import { supabase } from '@/lib/supabase'

const BUCKET = 'product-images'

export async function uploadProductImage(  productId: string, file: File) {
  if (!file) throw new Error('File tidak ditemukan')

  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Format gambar tidak didukung')
  }

  const fileExt = file.name.split('.').pop() || 'webp'

  const filePath = `${productId}/main.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    throw uploadError
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath)

  return {
    path: filePath,
    publicUrl: data.publicUrl,
  }
}