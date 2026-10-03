import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAdminSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getAdminSupabase();

    const { data: checkins, error } = await supabase
      .from("checkins")
      .select(`
        id, 
        checked_in_at, 
        checked_in_by,
        tickets (
           id,
           ticket_id,
           pass_type,
           booking_id,
           bookings (
             id,
             booking_id,
             name,
             quantity
           )
        )
      `)
      .order("checked_in_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching recent checkins:", error);
      return NextResponse.json({ success: false, error: "Failed to fetch checkins" }, { status: 500 });
    }

    const formattedCheckins = await Promise.all(checkins.map(async (c: any) => {
       const t = c.tickets;
       const b = t?.bookings;

       let ticketNumber = 1;
       if (t?.booking_id) {
           const { data: bookingTickets } = await supabase
              .from("tickets")
              .select("id")
              .eq("booking_id", t.booking_id)
              .order("id");
           
           if (bookingTickets) {
             const idx = bookingTickets.findIndex((bt: any) => bt.id === t.id);
             if (idx >= 0) ticketNumber = idx + 1;
           }
       }

       return {
         ticketId: t?.ticket_id,
         ticketNumber,
         totalTickets: b?.quantity || 1,
         customer: b?.name,
         bookingId: b?.booking_id,
         passType: t?.pass_type,
         checkedInAt: c.checked_in_at,
         checkedInByEmail: session.user.email
       };
    }));

    return NextResponse.json({ success: true, checkins: formattedCheckins });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
