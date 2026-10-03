"use server";

import { randomBytes } from "crypto";
import { getAdminSupabase } from "@/lib/supabase";

export async function createBooking(data: any) {
  try {
    const randomHex = randomBytes(3).toString("hex").toUpperCase();
    const bookingId = `RR-2026-${randomHex}`;
    const passType = data.passType === "regular" ? "regular" : "early_bird";
    const unitPrice = passType === "regular" ? 299 : 249;
    
    let quantity = Number(data.quantity);
    if (isNaN(quantity) || quantity < 1) quantity = 1;
    if (quantity > 10) quantity = 10;
    
    const totalAmount = unitPrice * quantity;

    const supabase = getAdminSupabase();
    const { error } = await supabase.from("bookings").insert({
      booking_id: bookingId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      gender: data.gender,
      special_requirements: data.specialRequirements,
      pass_type: passType,
      quantity: quantity,
      unit_price: unitPrice,
      total_amount: totalAmount,
      booking_status: "PAYMENT_PENDING",
    });

    if (error) throw error;

    return { success: true, bookingId };
  } catch (error) {
    console.error("Booking Error:", error);
    return { success: false, error: "Unable to create your booking." };
  }
}
