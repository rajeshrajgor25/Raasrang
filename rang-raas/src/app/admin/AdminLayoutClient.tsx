"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Home, LayoutDashboard, CheckCircle, Ticket, CalendarCheck, Settings, BarChart2, Menu, X } from "lucide-react";

export default function AdminLayoutClient({ children, logoutAction }: { children: React.ReactNode, logoutAction: () => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-950 text-white w-full">{children}</div>;
  }

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/10 text-center flex-shrink-0 relative">
        {/* Mobile close button inside the drawer */}
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center bg-black mx-auto mb-3">
          <span className="font-playfair text-gold font-bold">WCC</span>
        </div>
        <h2 className="font-playfair text-xl font-bold text-gold uppercase tracking-wider">RANG RAAS</h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <Link href="/admin/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin/dashboard' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
          <LayoutDashboard size={20} className="text-gold" />
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link href="/admin/payment-verification" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin/payment-verification' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
          <CheckCircle size={20} className="text-gold" />
          <span className="font-medium">Payment Verification</span>
        </Link>
        <Link href="/admin/bookings" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin/bookings' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
          <Ticket size={20} className="text-gold" />
          <span className="font-medium">All Bookings</span>
        </Link>
        <Link href="/admin/tickets" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin/tickets' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
          <Ticket size={20} className="text-gold" />
          <span className="font-medium">Tickets</span>
        </Link>
        <Link href="/admin/check-in" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin/check-in' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
          <CalendarCheck size={20} className="text-gold" />
          <span className="font-medium">Check-in Scanner</span>
        </Link>
        <Link href="/admin/analytics" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin/analytics' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
          <BarChart2 size={20} className="text-gold" />
          <span className="font-medium">Analytics</span>
        </Link>
        <Link href="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === '/admin/settings' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
          <Settings size={20} className="text-gold" />
          <span className="font-medium">Settings</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2 flex-shrink-0">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white transition-colors w-full">
          <Home size={20} />
          <span className="font-medium text-sm">Back to Website</span>
        </Link>
        <button onClick={logoutAction} className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors w-full">
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-black border-r border-white/10 flex-col flex-shrink-0 h-full z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-black border-r border-white/10 flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 w-full">
        {/* Top Header */}
        <header className="h-16 bg-black border-b border-white/10 flex items-center justify-between md:justify-end px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-300 hover:text-white p-2"
            >
              <Menu size={24} />
            </button>
            <span className="font-playfair text-gold font-bold text-lg uppercase tracking-wider">WCC | RANG RAAS</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-black font-bold text-sm">
              A
            </div>
            <span className="text-sm font-medium hidden md:inline-block">Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-950 p-4 md:p-8 w-full max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
