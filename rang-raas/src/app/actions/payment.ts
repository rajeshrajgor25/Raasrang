"use server";

import { getAdminSupabase } from "@/lib/supabase";

export async function submitPayment(data: any): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getAdminSupabase();

    // 1. Get the booking UUID
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("id")
      .eq("booking_id", data.bookingId)
      .single();

    if (fetchError || !booking) return { success: false, error: "Booking not found" };

    // 2. Upload screenshot to Supabase Storage
    let screenshotUrl = data.screenshotBase64; // Fallback if already a URL
    
    if (data.screenshotBase64 && data.screenshotBase64.startsWith('data:image')) {
      const base64Data = data.screenshotBase64.replace(/^data:image\/\w+;base64,/, "");
      const fileBuffer = Buffer.from(base64Data, "base64");
      
      const fileExt = data.screenshotBase64.split(';')[0].split('/')[1] || 'png';
      const fileName = `${booking.id}-${Date.now()}.${fileExt}`;
      
      // Ensure bucket exists or ignore if it does
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(b => b.name === "payment-screenshots")) {
        await supabase.storage.createBucket("payment-screenshots", { public: false });
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("payment-screenshots")
        .upload(fileName, fileBuffer, { 
          contentType: `image/${fileExt}`
        });
        
      if (uploadError) throw uploadError;
      
      screenshotUrl = uploadData.path;
    }

    // 3. Insert payment
    const { error: insertError } = await supabase.from("payments").insert({
      booking_id: booking.id,
      utr: data.utr,
      payment_date: new Date(data.paymentDate).toISOString(),
      screenshot_url: screenshotUrl,
      status: "PENDING_VERIFICATION",
    });

    if (insertError) throw insertError;

    return { success: true };
  } catch (error) {
    console.error("Payment submission failed:", error);
    return { success: false, error: "Failed to submit payment details." };
  }
}
