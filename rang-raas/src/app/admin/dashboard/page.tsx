import { Ticket, CheckCircle, IndianRupee, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";
import { getAdminSupabase } from "@/lib/supabase";

export default async function AdminDashboard() {
  const supabase = getAdminSupabase();
  
  const [
    { count: totalBookings },
    { count: paidBookings },
    { count: pendingPayments },
    { count: totalTickets },
    { count: checkedInTickets },
    { data: recentBookingsData }
  ] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("booking_status", "CONFIRMED"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("booking_status", "PAYMENT_PENDING"),
    supabase.from("tickets").select("*", { count: "exact", head: true }),
    supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "CHECKED_IN"),
    supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(5)
  ]);

  const { data: revenueData } = await supabase.from("bookings").select("total_amount").eq("booking_status", "CONFIRMED");
  const totalRevenue = revenueData?.reduce((acc, b) => acc + Number(b.total_amount), 0) || 0;
  
  const recentBookings = recentBookingsData || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Event Overview & Live Statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black border border-white/10 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
              <FileText className="text-gold" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold text-white">{totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-black border border-white/10 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="text-green-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Paid Bookings</p>
              <p className="text-2xl font-bold text-white">{paidBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-black border border-white/10 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <AlertCircle className="text-yellow-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pending Verification</p>
              <p className="text-2xl font-bold text-white">{pendingPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-black border border-white/10 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
              <IndianRupee className="text-gold" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gold">₹{totalRevenue.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        <div className="bg-black border border-white/10 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Ticket className="text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Tickets Issued</p>
              <p className="text-2xl font-bold text-white">{totalTickets}</p>
            </div>
          </div>
        </div>

        <div className="bg-black border border-white/10 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <CheckCircle className="text-purple-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Checked In</p>
              <p className="text-2xl font-bold text-white">{checkedInTickets}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-black border border-white/10 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-gold hover:underline text-sm">View All &rarr;</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-sm font-medium text-gray-400">Booking ID</th>
                <th className="p-4 text-sm font-medium text-gray-400">Customer</th>
                <th className="p-4 text-sm font-medium text-gray-400">Pass</th>
                <th className="p-4 text-sm font-medium text-gray-400">Amount</th>
                <th className="p-4 text-sm font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No bookings yet.</td>
                </tr>
              ) : recentBookings.map(booking => (
                <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-sm text-gray-300">{booking.booking_id}</td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-white">{booking.name}</div>
                    <div className="text-xs text-gray-500">{booking.phone}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-white capitalize">{booking.pass_type} <span className="text-gray-500 ml-1">×{booking.quantity}</span></div>
                  </td>
                  <td className="p-4 text-sm text-white">₹{booking.total_amount}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
