import Link from "next/link";
import { LogOut, Home, LayoutDashboard, CheckCircle, Ticket, CalendarCheck, Settings, BarChart2 } from "lucide-react";
import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10 text-center">
          <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center bg-black mx-auto mb-3">
            <span className="font-playfair text-gold font-bold">WCC</span>
          </div>
          <h2 className="font-playfair text-xl font-bold text-gold uppercase tracking-wider">RANG RAAS</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
            <LayoutDashboard size={20} className="text-gold" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/payment-verification" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
            <CheckCircle size={20} className="text-gold" />
            <span className="font-medium">Payment Verification</span>
          </Link>
          <Link href="/admin/bookings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
            <Ticket size={20} className="text-gold" />
            <span className="font-medium">All Bookings</span>
          </Link>
          <Link href="/admin/tickets" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
            <Ticket size={20} className="text-gold" />
            <span className="font-medium">Tickets</span>
          </Link>
          <Link href="/admin/check-in" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
            <CalendarCheck size={20} className="text-gold" />
            <span className="font-medium">Check-in Scanner</span>
          </Link>
          <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
            <BarChart2 size={20} className="text-gold" />
            <span className="font-medium">Analytics</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
            <Settings size={20} className="text-gold" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white transition-colors w-full">
            <Home size={20} />
            <span className="font-medium text-sm">Back to Website</span>
          </Link>
          <form action={async () => {
            "use server";
            await logout();
            redirect("/admin/login");
          }}>
            <button type="submit" className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors w-full">
              <LogOut size={20} />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-black border-b border-white/10 flex items-center justify-end px-8 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-black font-bold">
              A
            </div>
            <span className="text-sm font-medium">Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-950 p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
