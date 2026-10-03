import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { generateBookingPDF } from "@/lib/pdf";

export async function GET(req: NextRequest, { params }: { params: Promise<{ bookingId: string }> }) {
  try {
    const { bookingId } = await params;
    const supabase = getAdminSupabase();

    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_id", bookingId)
      .single();

    if (fetchError || !booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    const { data: tickets, error: ticketError } = await supabase
      .from("tickets")
      .select("*")
      .eq("booking_id", booking.id)
      .order("id");

    if (ticketError || !tickets || tickets.length === 0) {
      return new NextResponse("Tickets not found", { status: 404 });
    }

    const pdfBuffer = await generateBookingPDF(booking, tickets);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${booking.booking_id}-EPASS.pdf"`
      }
    });
  } catch (err) {
    console.error("PDF Generation Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
