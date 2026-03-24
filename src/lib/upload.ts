import { supabase } from "@/integrations/supabase/client";

const BUCKET = "hostel_images";

/**
 * Uploads a hostel image to Supabase Storage.
 * Returns the public URL of the uploaded file.
 * Throws an error if the upload fails.
 */
export async function uploadHostelImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `hostels/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
