import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    
    // Provide a stable UUID for the hardcoded admin for existing sessions that only have email
    const adminId = session.user.id || "11111111-1111-1111-1111-111111111111";

    const { code, action = "checkin" } = await req.json();
    const supabase = getAdminSupabase();

    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .select("id, ticket_id, status, pass_type, booking_id")
      .or(`ticket_id.eq.${code},qr_token.eq.${code}`)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json({ success: false, error: "INVALID PASS (Not Found)" }, { status: 400 });
    }

    const { data: booking } = await supabase
      .from("bookings")
      .select("booking_id, name, quantity, total_amount, pass_type, booking_status")
      .eq("id", ticket.booking_id)
      .single();

    const { data: allTickets } = await supabase
      .from("tickets")
      .select("id, ticket_id, status")
      .eq("booking_id", ticket.booking_id)
      .order("id");

    const sortedTickets = allTickets || [];
    const ticketIndex = sortedTickets.findIndex(t => t.id === ticket.id);
    const ticketNumber = ticketIndex + 1;
    const totalTickets = sortedTickets.length;

    // We can fetch checkin info if it's already checked in
    let checkinTime = null;
    let checkedInBy = null;
    if (ticket.status === "CHECKED_IN") {
       const { data: checkinData } = await supabase.from("checkins").select("checked_in_at, checked_in_by").eq("ticket_id", ticket.id).single();
       if (checkinData) {
         checkinTime = checkinData.checked_in_at;
         checkedInBy = checkinData.checked_in_by;
       }
    }

    if (action === "validate") {
      if (ticket.status === "CHECKED_IN") {
        return NextResponse.json({ 
           success: false, 
           error: "ALREADY CHECKED IN",
           ticket: {
             ticketId: ticket.ticket_id,
             ticketNumber,
             totalTickets,
             customer: booking?.name,
             bookingId: booking?.booking_id,
             checkedInAt: checkinTime,
             checkedInBy
           }
        }, { status: 409 });
      }

      if (ticket.status !== "ACTIVE" || booking?.booking_status !== "CONFIRMED") {
        return NextResponse.json({ success: false, error: "Ticket is not active or booking not confirmed" }, { status: 400 });
      }

      return NextResponse.json({ 
        success: true, 
        ticket: {
          ticketId: ticket.ticket_id,
          ticketNumber,
          totalTickets,
          status: ticket.status,
          passType: ticket.pass_type
        },
        booking: {
          bookingId: booking?.booking_id,
          customer: booking?.name,
          quantity: booking?.quantity,
          totalAmount: booking?.total_amount,
          passType: booking?.pass_type
        },
        allTickets: sortedTickets.map((t, idx) => ({
          ticketId: t.ticket_id,
          ticketNumber: idx + 1,
          status: t.status,
          isCurrent: t.id === ticket.id
        }))
      }, { status: 200 });
    }

    // Action === checkin
    if (ticket.status === "CHECKED_IN") {
      return NextResponse.json({ 
        success: false, 
        error: "ALREADY CHECKED IN",
        ticket: {
           ticketId: ticket.ticket_id,
           ticketNumber,
           totalTickets,
           customer: booking?.name,
           bookingId: booking?.booking_id,
           checkedInAt: checkinTime,
           checkedInBy
        }
      }, { status: 409 });
    }

    if (ticket.status !== "ACTIVE" || booking?.booking_status !== "CONFIRMED") {
      return NextResponse.json({ success: false, error: "Ticket is not active or booking not confirmed" }, { status: 400 });
    }

    // ATOMIC CHECK-IN: Insert checkin record first.
    // If two scanners scan simultaneously, the UNIQUE constraint on checkins.ticket_id will reject one.
    const { data: insertedCheckin, error: insertError } = await supabase.from("checkins").insert({
      ticket_id: ticket.id,
      checked_in_by: adminId // INSERT UUID NOT EMAIL
    }).select().single();

    if (insertError) {
      // Unique constraint violation (23505) or any other insertion error
      console.error("Atomic check-in failed (likely duplicate):", insertError);
      
      // Fetch the actual check-in time to show the staff
      const { data: existingCheckin } = await supabase.from("checkins").select("checked_in_at, checked_in_by").eq("ticket_id", ticket.id).single();
      
      return NextResponse.json({ 
        success: false, 
        error: "ALREADY CHECKED IN",
        ticket: {
           ticketId: ticket.ticket_id,
           ticketNumber,
           totalTickets,
           customer: booking?.name,
           bookingId: booking?.booking_id,
           checkedInAt: existingCheckin?.checked_in_at || new Date().toISOString(),
           checkedInBy: existingCheckin?.checked_in_by
        }
      }, { status: 409 });
    }

    // Mark ticket as checked in ONLY after successful checkin record insertion
    await supabase.from("tickets").update({ status: "CHECKED_IN" }).eq("id", ticket.id);

    return NextResponse.json({ 
      success: true, 
      ticket: {
        ticketId: ticket.ticket_id,
        ticketNumber,
        totalTickets,
        customer: booking?.name || "Unknown",
        bookingId: booking?.booking_id,
        passType: ticket.pass_type,
        checkedInAt: insertedCheckin.checked_in_at, // Use real db timestamp
        checkedInByEmail: session.user.email // Send back email just for UI
      },
      allTickets: sortedTickets.map((t, idx) => ({
        ticketId: t.ticket_id,
        ticketNumber: idx + 1,
        status: t.id === ticket.id ? "CHECKED_IN" : t.status,
        isCurrent: t.id === ticket.id
      }))
    }, { status: 200 });

  } catch (err) {
    console.error("Check-in Error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
