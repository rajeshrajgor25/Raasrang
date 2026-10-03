import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminSupabase } from "@/lib/supabase";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { generateBookingPDF } from "@/lib/pdf";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { bookingId } = await req.json();
    const supabase = getAdminSupabase();

    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("id, booking_id, quantity, pass_type, total_amount, email, booking_status, name")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    if (booking.booking_status === "CONFIRMED") {
      return NextResponse.json({ success: false, error: "Payment already verified." }, { status: 400 });
    }

    const { data: payment, error: payError } = await supabase
      .from("payments")
      .select("id, status")
      .eq("booking_id", booking.id)
      .single();

    if (payError || !payment) {
      return NextResponse.json({ success: false, error: "Payment not found" }, { status: 404 });
    }

    // 1. Mark payment as PAID
    await supabase.from("payments").update({
      status: "PAID",
      verified_by: session.user.email,
      verified_at: new Date().toISOString()
    }).eq("id", payment.id);

    // 2. Mark booking as CONFIRMED
    await supabase.from("bookings").update({
      booking_status: "CONFIRMED"
    }).eq("id", booking.id);

    // 3. Generate tickets
    const tickets = [];
    for (let i = 0; i < booking.quantity; i++) {
      const tokenHex = randomBytes(3).toString("hex").toUpperCase();
      const ticketId = `RR26-${tokenHex}`;
      const qrToken = randomBytes(16).toString("hex");

      const { data: ticket, error: ticketError } = await supabase.from("tickets").insert({
        ticket_id: ticketId,
        booking_id: booking.id,
        qr_token: qrToken,
        pass_type: booking.pass_type,
        status: "ACTIVE",
        pdf_url: `/e-pass/${ticketId}`
      }).select().single();
      
      if (!ticketError && ticket) tickets.push(ticket);
    }

    let emailSuccess = false;
    let emailErrorMsg = "";
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `http://${req.headers.get("host")}`;
        const pdfUrl = `${baseUrl}/api/e-pass/booking/${booking.booking_id}`;
        
        const pdfBuffer = await generateBookingPDF(booking, tickets);

        const emailResponse = await resend.emails.send({
          from: process.env.EMAIL_FROM || "RANG RAAS <noreply@weekendcultureclub.com>",
          to: booking.email,
          subject: `RANG RAAS – Your E-Pass is Confirmed 🎟️`,
          attachments: [
            {
              filename: `${booking.booking_id}-EPASS.pdf`,
              content: pdfBuffer,
            }
          ],
          html: `
            <div style="font-family: sans-serif; color: #333;">
              <p>Hello ${booking.name},</p>
              <p>Your payment has been successfully verified.</p>
              <p>Your RANG RAAS booking is confirmed.</p>
              <p><strong>Booking ID:</strong><br/>${booking.booking_id}</p>
              <p><strong>Pass Type:</strong><br/>${booking.pass_type}</p>
              <p><strong>Quantity:</strong><br/>${booking.quantity}</p>
              <p><strong>Total Amount:</strong><br/>₹${booking.total_amount}</p>
              <p>Your E-pass PDF is attached to this email.</p>
              <p>You can also view your E-pass online:</p>
              <p><a href="${pdfUrl}">[VIEW E-PASS]</a></p>
              <p><strong>Event Details:</strong><br/>
              RANG RAAS – PRE-NAVRATRI GARBA NIGHT<br/>
              Saturday, 10 October 2026<br/>
              7:00 PM – 10:00 PM<br/>
              <br/>
              Ranbhoomi<br/>
              Marambal Pada Road, Jatty Road,<br/>
              near Sai Baba Mandir,<br/>
              Virar West, Maharashtra 401301</p>
              <p>Regards,<br/>
              Weekend Culture Club</p>
            </div>
          `
        });

        if (emailResponse.error) {
           emailErrorMsg = emailResponse.error.message;
           console.error("Resend API returned error:", emailResponse.error);
        } else {
           emailSuccess = true;
           console.log(`[Email Service] Sent confirmation to ${booking.email}`);
        }
      } catch (emailError: any) {
        console.error("Failed to send confirmation email:", emailError);
        emailErrorMsg = emailError.message || "Unknown error";
      }
    } else {
      emailErrorMsg = "RESEND_API_KEY is not configured in the environment.";
    }

    // Update booking with email status
    if (emailSuccess) {
      await supabase.from("bookings").update({
        email_status: 'SENT',
        email_sent_at: new Date().toISOString(),
        email_error: null
      }).eq("id", booking.id);
    } else {
      await supabase.from("bookings").update({
        email_status: 'FAILED',
        email_sent_at: null,
        email_error: emailErrorMsg
      }).eq("id", booking.id);
    }

    return NextResponse.json({ 
      success: true, 
      tickets,
      message: emailSuccess ? "Payment verified." : `Payment verified, but email delivery failed. (${emailErrorMsg})`
    });
  } catch (err) {
    console.error("Verification API Error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
