"use client";

import { useState } from "react";
import { X, ExternalLink } from "lucide-react";

export function ViewBookingModal({ booking }: { booking: any }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 text-sm font-medium transition-colors"
      >
        View
      </button>
    );
  }

  const payment = booking.payments && booking.payments[0] ? booking.payments[0] : null;
  const tickets = booking.tickets || [];

  const formatTime = (isoString?: string | null) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleString('en-IN', {
       timeZone: 'Asia/Kolkata',
       day: '2-digit',
       month: 'short',
       year: 'numeric',
       hour: '2-digit',
       minute: '2-digit',
       hour12: true
    }).replace(/am/i, 'AM').replace(/pm/i, 'PM');
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 text-sm font-medium transition-colors"
      >
        View
      </button>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
        <div className="bg-zinc-900 border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
          
          <div className="p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-playfair font-bold text-white mb-1">Booking Details</h2>
              <p className="text-gold font-mono">{booking.booking_id}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Customer Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Customer Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-400">Customer:</div>
                  <div className="text-white">{booking.name}</div>
                  <div className="text-gray-400">Email:</div>
                  <div className="text-white">{booking.email}</div>
                  <div className="text-gray-400">Phone:</div>
                  <div className="text-white">{booking.phone}</div>
                  <div className="text-gray-400">City:</div>
                  <div className="text-white">{booking.city}</div>
                </div>
              </div>

              {/* Booking & Payment Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Booking & Payment Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-400">Pass:</div>
                  <div className="text-white capitalize">{booking.pass_type}</div>
                  <div className="text-gray-400">Quantity:</div>
                  <div className="text-white">{booking.quantity}</div>
                  <div className="text-gray-400">Total Amount:</div>
                  <div className="text-white font-bold">₹{booking.total_amount}</div>
                  <div className="text-gray-400">Booking Status:</div>
                  <div className="text-white">{booking.booking_status}</div>
                  {payment && (
                    <>
                      <div className="text-gray-400">Payment Status:</div>
                      <div className="text-white">{payment.status}</div>
                      <div className="text-gray-400">UTR:</div>
                      <div className="text-white font-mono">{payment.utr}</div>
                      <div className="text-gray-400">Payment Date:</div>
                      <div className="text-white">{formatTime(payment.payment_date)}</div>
                      {payment.screenshot_url && (
                        <div className="col-span-2 mt-2">
                          <a href={payment.screenshot_url} target="_blank" className="text-gold hover:underline flex items-center gap-1">
                            <ExternalLink size={14} /> View Screenshot
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="bg-[#020817] border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 mb-4 tracking-wider uppercase">Booking Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Booking Created</div>
                  <div className="text-white font-medium">{formatTime(booking.created_at)}</div>
                </div>

                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Payment Submitted</div>
                  <div className="text-white font-medium">{formatTime(payment?.created_at)}</div>
                </div>

                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Payment Verified</div>
                  <div className="text-white font-medium">{formatTime(payment?.verified_at)}</div>
                  {payment?.verified_by && <div className="text-xs text-gray-500 mt-1">by {payment.verified_by}</div>}
                </div>

                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Tickets Issued</div>
                  <div className="text-white font-medium">{tickets.length > 0 ? formatTime(tickets[0].issued_at) : "-"}</div>
                </div>

                <div className="bg-white/5 p-3 rounded-lg border border-white/5 md:col-span-2 flex justify-between items-center">
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">E-Pass Email Sent</div>
                    <div className="text-white font-medium">{formatTime(booking.email_sent_at)}</div>
                    {booking.email_error && <div className="text-xs text-red-400 mt-1">Error: {booking.email_error}</div>}
                  </div>
                  <div>
                    <span className={`px-3 py-1 text-xs rounded-full font-bold ${
                      booking.email_status === 'SENT' ? 'bg-green-500/20 text-green-400' :
                      booking.email_status === 'FAILED' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {booking.email_status || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tickets */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Individual Tickets ({tickets.length})</h3>
              {tickets.length === 0 ? (
                <p className="text-gray-500 text-sm">No tickets generated yet.</p>
              ) : (
                <div className="space-y-3">
                  {tickets.map((t: any, index: number) => {
                    const checkin = t.checkins && t.checkins.length > 0 ? t.checkins[0] : null;
                    return (
                      <div key={t.id} className="bg-white/5 p-4 rounded-lg flex justify-between items-center border border-white/10">
                        <div>
                          <div className="text-white font-medium mb-1">Ticket {index + 1} of {tickets.length}</div>
                          <div className="text-gold font-mono text-sm">{t.ticket_id}</div>
                        </div>
                        <div className="text-right">
                          <div className="mb-1 text-xs text-gray-400">Issued: {formatTime(t.issued_at)}</div>
                          {t.status === 'CHECKED_IN' ? (
                            <>
                              <div className="text-sm font-bold text-green-500 mb-1">CHECKED IN</div>
                              {checkin && <div className="text-xs text-gray-400 font-mono">{formatTime(checkin.checked_in_at)}</div>}
                            </>
                          ) : (
                            <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                              NOT CHECKED IN
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/10">
              <a 
                href={`/api/e-pass/booking/${booking.booking_id}`}
                target="_blank"
                className="flex-1 text-center bg-gold text-black font-bold py-3 rounded-lg hover:bg-gold-light transition-colors"
              >
                VIEW E-PASS
              </a>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
