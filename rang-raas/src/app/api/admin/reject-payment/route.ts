import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { bookingId, reason } = await req.json();

    if (!bookingId || !reason || reason.length < 5) {
      return NextResponse.json({ success: false, error: "Invalid booking ID or rejection reason too short" }, { status: 400 });
    }

    const supabase = getAdminSupabase();

    // Get the booking
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("id, booking_id, name, email, pass_type, quantity, total_amount, booking_status")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    if (booking.booking_status === "CONFIRMED") {
      return NextResponse.json({ success: false, error: "Payment already verified." }, { status: 400 });
    }

    // 1. Mark payment as REJECTED
    await supabase.from("payments").update({
      status: "REJECTED",
      rejection_reason: reason
    }).eq("booking_id", booking.id);

    // 2. Send Email
    try {
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "RANG RAAS <noreply@weekendcultureclub.com>",
          to: booking.email,
          subject: `RANG RAAS \u2013 Payment Verification Update for Booking ${booking.booking_id}`,
          html: `
            <div style="font-family: sans-serif; color: #333;">
              <p>Hello ${booking.name},</p>
              <p>We reviewed the payment submitted for your RANG RAAS booking.</p>
              <p>Unfortunately, we could not verify the payment.</p>
              <p><strong>Booking ID:</strong> ${booking.booking_id}<br/>
              <strong>Pass:</strong> ${booking.pass_type}<br/>
              <strong>Quantity:</strong> ${booking.quantity}<br/>
              <strong>Amount:</strong> \u20B9${booking.total_amount}</p>
              <p><strong>Reason for rejection:</strong><br/>
              ${reason}</p>
              <p>Please review the payment details and submit the payment information again if required.</p>
              <p>Regards,<br/>
              Weekend Culture Club<br/>
              RANG RAAS \u2013 Pre-Navratri Garba Night</p>
            </div>
          `
        });
      }
    } catch (e) {
      console.error("Failed to send rejection email:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Payment rejection error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
