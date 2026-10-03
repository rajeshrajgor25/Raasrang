import { getAdminSupabase } from "@/lib/supabase";
import { ResendEpassButton } from "./ResendButton";
import { ViewBookingModal } from "./ViewBookingModal";
export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const supabase = getAdminSupabase();
  const { data: bookingsData } = await supabase
    .from("bookings")
    .select("*, payments(*), tickets(*, checkins(*))")
    .order("created_at", { ascending: false });
    
  const bookings = bookingsData || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-white mb-2">All Bookings</h1>
        <p className="text-gray-400">View and manage all event bookings.</p>
      </div>

      <div className="bg-black border border-white/10 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-sm font-medium text-gray-400">Booking ID</th>
                <th className="p-4 text-sm font-medium text-gray-400">Customer</th>
                <th className="p-4 text-sm font-medium text-gray-400">Pass</th>
                <th className="p-4 text-sm font-medium text-gray-400">Created</th>
                <th className="p-4 text-sm font-medium text-gray-400">Amount</th>
                <th className="p-4 text-sm font-medium text-gray-400">Payment Status</th>
                <th className="p-4 text-sm font-medium text-gray-400">Check-in</th>
                <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No bookings found.</td>
                </tr>
              ) : bookings.map(booking => (
                <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-sm text-gray-300">{booking.booking_id}</td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-white">{booking.name}</div>
                    <div className="text-xs text-gray-500">{booking.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-white capitalize">{booking.pass_type} <span className="text-gray-500 ml-1">×{booking.quantity}</span></div>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {new Date(booking.created_at).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', 
                      hour: '2-digit', minute: '2-digit', hour12: true
                    }).replace(/am/i, 'AM').replace(/pm/i, 'PM')}
                  </td>
                  <td className="p-4 text-sm text-white font-bold">₹{booking.total_amount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      booking.booking_status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                      booking.booking_status === 'PAYMENT_PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                      booking.booking_status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {booking.booking_status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    {booking.booking_status === 'CONFIRMED' ? (
                      <div className={`text-sm font-medium ${
                        (booking.tickets?.filter((t: any) => t.checkins && t.checkins.length > 0).length || 0) === booking.quantity
                          ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {booking.tickets?.filter((t: any) => t.checkins && t.checkins.length > 0).length || 0} / {booking.quantity} Checked In
                      </div>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </td>
                  <td className="p-4 flex gap-2">
                    <ViewBookingModal booking={booking} />
                    <ResendEpassButton 
                      bookingId={booking.id} 
                      email={booking.email} 
                      disabled={booking.booking_status !== 'CONFIRMED'} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
