
import { supabase } from "@/integrations/supabase/client"

export async function uploadAdvocacyImage() {
  try {
    // Convert the uploaded image to base64 and then to a file
    const response = await fetch('/lovable-uploads/80934f40-f381-433a-afea-69f37fe637ab.png')
    const blob = await response.blob()
    const file = new File([blob], 'scientists-first-advocacy-team.png', { type: 'image/png' })

    const { data, error } = await supabase.storage
      .from('images')
      .upload('scientists-first-advocacy-team.png', file, {
        upsert: true
      })

    if (error) {
      console.error('Error uploading image:', error)
      return null
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl('scientists-first-advocacy-team.png')

    return urlData.publicUrl
  } catch (error) {
    console.error('Error uploading advocacy image:', error)
    return null
  }
}
