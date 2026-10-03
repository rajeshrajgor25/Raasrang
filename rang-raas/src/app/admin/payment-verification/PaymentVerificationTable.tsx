"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Search, Image as ImageIcon } from "lucide-react";

export function PaymentVerificationTable({ payments }: { payments: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const router = useRouter();

  const filteredPayments = payments.filter(p => 
    p.booking?.booking_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.utr.includes(searchTerm)
  );

  const handleVerify = async (bookingId: string) => {
    if (!confirm("Are you sure you want to verify this payment and issue tickets?")) return;
    
    setVerifyingId(bookingId);
    try {
      const res = await fetch("/api/admin/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Payment verified successfully! Tickets have been generated.");
        setSelectedPayment(null);
        router.refresh();
      } else {
        alert(data.error || "Failed to verify payment");
      }
    } catch (e) {
      alert("An error occurred");
    } finally {
      setVerifyingId(null);
    }
  };

  const handleReject = async (bookingId: string) => {
    if (rejectionReason.length < 5) return;
    
    try {
      const res = await fetch("/api/admin/reject-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, reason: rejectionReason }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Payment rejected and customer notified.");
        setSelectedPayment(null);
        setRejectingId(null);
        setRejectionReason("");
        router.refresh();
      } else {
        alert(data.error || "Failed to reject payment");
      }
    } catch (e) {
      alert("An error occurred");
    }
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Booking ID, Name, UTR..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-black border border-white/20 rounded-lg text-white focus:border-gold outline-none w-80"
          />
        </div>
      </div>

      <div className="bg-black border border-white/10 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-sm font-medium text-gray-400">Booking ID</th>
                <th className="p-4 text-sm font-medium text-gray-400">Customer</th>
                <th className="p-4 text-sm font-medium text-gray-400">Pass</th>
                <th className="p-4 text-sm font-medium text-gray-400">Amount</th>
                <th className="p-4 text-sm font-medium text-gray-400">UTR</th>
                <th className="p-4 text-sm font-medium text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No pending payments found.</td>
                </tr>
              ) : filteredPayments.map(payment => (
                <tr key={payment.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-sm text-gray-300">{payment.booking.booking_id}</td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-white">{payment.booking.name}</div>
                    <div className="text-xs text-gray-500">{payment.booking.phone}</div>
                  </td>
                  <td className="p-4 text-sm capitalize text-white">
                    {payment.booking.pass_type} <span className="text-gray-500">×{payment.booking.quantity}</span>
                  </td>
                  <td className="p-4 text-sm font-bold text-gold">₹{payment.booking.total_amount}</td>
                  <td className="p-4 font-mono text-sm text-gray-300">{payment.utr}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedPayment(payment)}
                      className="px-4 py-1.5 bg-white/10 text-white rounded hover:bg-white/20 text-sm font-medium transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-950 border border-gold/30 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Review Payment</h2>
              <button onClick={() => setSelectedPayment(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-gold text-sm font-bold uppercase mb-2">Customer Details</h3>
                  <div className="bg-black p-4 rounded-lg border border-white/10 space-y-2">
                    <p><span className="text-gray-500 inline-block w-24">Name:</span> <span className="text-white font-medium">{selectedPayment.booking.name}</span></p>
                    <p><span className="text-gray-500 inline-block w-24">Phone:</span> <span className="text-white font-medium">{selectedPayment.booking.phone}</span></p>
                    <p><span className="text-gray-500 inline-block w-24">Email:</span> <span className="text-white font-medium">{selectedPayment.booking.email}</span></p>
                  </div>
                </div>

                <div>
                  <h3 className="text-gold text-sm font-bold uppercase mb-2">Booking Details</h3>
                  <div className="bg-black p-4 rounded-lg border border-white/10 space-y-2">
                    <p><span className="text-gray-500 inline-block w-24">Booking ID:</span> <span className="text-white font-mono">{selectedPayment.booking.booking_id}</span></p>
                    <p><span className="text-gray-500 inline-block w-24">Pass Type:</span> <span className="text-white capitalize">{selectedPayment.booking.pass_type}</span></p>
                    <p><span className="text-gray-500 inline-block w-24">Quantity:</span> <span className="text-white font-bold">{selectedPayment.booking.quantity}</span></p>
                    <p><span className="text-gray-500 inline-block w-24">Total Amount:</span> <span className="text-gold font-bold text-lg">₹{selectedPayment.booking.total_amount}</span></p>
                  </div>
                </div>

                <div>
                  <h3 className="text-gold text-sm font-bold uppercase mb-2">Payment Details</h3>
                  <div className="bg-black p-4 rounded-lg border border-white/10 space-y-2">
                    <p><span className="text-gray-500 inline-block w-24">UTR:</span> <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">{selectedPayment.utr}</span></p>
                    <p><span className="text-gray-500 inline-block w-24">Date:</span> <span className="text-white">{new Date(selectedPayment.payment_date).toLocaleDateString()}</span></p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-gold text-sm font-bold uppercase mb-2">Payment Screenshot</h3>
                <div className="bg-black p-2 rounded-lg border border-white/10 flex items-center justify-center min-h-[300px]">
                  {selectedPayment.screenshot_url ? (
                    <img src={selectedPayment.screenshot_url} alt="Payment Screenshot" className="max-w-full max-h-[400px] object-contain rounded" />
                  ) : (
                    <div className="text-center text-gray-500 flex flex-col items-center">
                      <ImageIcon size={48} className="mb-2 opacity-50" />
                      <p>No screenshot provided</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-8">
                  {rejectingId === selectedPayment.booking.id ? (
                    <div className="bg-red-950/30 p-4 rounded-lg border border-red-500/50">
                      <h4 className="text-red-400 font-bold mb-2">REJECT PAYMENT</h4>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Reason for rejection (e.g. UTR could not be verified in the account)"
                        className="w-full bg-black border border-red-500/30 rounded p-2 text-white text-sm mb-3"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setRejectingId(null);
                            setRejectionReason("");
                          }}
                          className="flex-1 bg-gray-800 text-white py-2 rounded font-bold text-sm hover:bg-gray-700 transition-colors"
                        >
                          CANCEL
                        </button>
                        <button
                          onClick={() => handleReject(selectedPayment.booking.id)}
                          disabled={rejectionReason.length < 5}
                          className="flex-1 bg-red-600 text-white py-2 rounded font-bold text-sm hover:bg-red-500 transition-colors disabled:opacity-50"
                        >
                          CONFIRM REJECT
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleVerify(selectedPayment.booking.id)}
                        disabled={verifyingId === selectedPayment.booking.id}
                        className="flex-1 bg-gold text-black py-4 rounded font-bold text-lg hover:bg-gold-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {verifyingId === selectedPayment.booking.id ? "VERIFYING..." : <><Check size={20} /> VERIFY PAYMENT</>}
                      </button>
                      <button 
                        onClick={() => setRejectingId(selectedPayment.booking.id)}
                        className="flex-1 bg-red-500/20 text-red-400 border border-red-500/50 py-4 rounded font-bold text-lg hover:bg-red-500/30 transition-colors"
                      >
                        REJECT
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
