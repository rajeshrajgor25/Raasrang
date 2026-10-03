import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminSupabase } from "@/lib/supabase";
import { Resend } from "resend";
import { generateBookingPDF } from "@/lib/pdf";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { bookingId } = await req.json();
    if (!bookingId) return NextResponse.json({ success: false, error: "Missing booking ID" }, { status: 400 });

    const supabase = getAdminSupabase();

    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("id, booking_id, quantity, pass_type, total_amount, email, booking_status, name")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    if (booking.booking_status !== "CONFIRMED") {
      return NextResponse.json({ success: false, error: "Cannot resend E-pass for unconfirmed bookings." }, { status: 400 });
    }

    const { data: tickets, error: ticketError } = await supabase
      .from("tickets")
      .select("ticket_id, status")
      .eq("booking_id", booking.id)
      .eq("status", "ACTIVE"); // only send active ones, or all? Let's just send all so they have their record
      
    // Wait, let's fetch all tickets for this booking.
    const { data: allTickets, error: allTicketsError } = await supabase
      .from("tickets")
      .select("*")
      .eq("booking_id", booking.id)
      .order("id");

    if (allTicketsError || !allTickets || allTickets.length === 0) {
       return NextResponse.json({ success: false, error: "No tickets found for this booking." }, { status: 404 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json({ success: false, error: "Resend API Key is not configured in the server environment." }, { status: 500 });
    }

    try {
      const resend = new Resend(resendApiKey);
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `http://${req.headers.get("host")}`;
      const pdfUrl = `${baseUrl}/api/e-pass/booking/${booking.booking_id}`;
      
      const pdfBuffer = await generateBookingPDF(booking, allTickets);

      const emailResponse = await resend.emails.send({
        from: process.env.EMAIL_FROM || "RANG RAAS <noreply@weekendcultureclub.com>",
        to: booking.email,
        subject: `RANG RAAS – Your E-Pass is Confirmed 🎟️ (Resent)`,
        attachments: [
          {
            filename: `${booking.booking_id}-EPASS.pdf`,
            content: pdfBuffer,
          }
        ],
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <p>Hello ${booking.name},</p>
            <p>As requested, here are your E-Pass details for RANG RAAS.</p>
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
        console.error("Resend API returned error:", emailResponse.error);
        await supabase.from("bookings").update({
          email_status: 'FAILED',
          email_sent_at: null,
          email_error: emailResponse.error.message
        }).eq("id", booking.id);
        return NextResponse.json({ success: false, error: emailResponse.error.message }, { status: 500 });
      }

      await supabase.from("bookings").update({
        email_status: 'SENT',
        email_sent_at: new Date().toISOString(),
        email_error: null
      }).eq("id", booking.id);

    } catch (emailError: any) {
      console.error("Failed to resend email:", emailError);
      await supabase.from("bookings").update({
        email_status: 'FAILED',
        email_sent_at: null,
        email_error: emailError.message || "Unknown error"
      }).eq("id", booking.id);
      return NextResponse.json({ success: false, error: emailError.message || "Failed to send email via Resend" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend E-Pass Error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
