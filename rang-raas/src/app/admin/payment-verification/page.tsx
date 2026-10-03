import { PaymentVerificationTable } from "./PaymentVerificationTable";
import { getAdminSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic"; // Ensure fresh data on every request

export default async function PaymentVerificationPage() {
  const supabase = getAdminSupabase();
  const { data: pendingPayments } = await supabase
    .from("payments")
    .select("*, booking:bookings(*)")
    .eq("status", "PENDING_VERIFICATION")
    .order("created_at", { ascending: true });
    
  const payments = pendingPayments || [];

  for (const payment of payments) {
    if (payment.screenshot_url && !payment.screenshot_url.startsWith('http')) {
      const { data } = await supabase.storage.from("payment-screenshots").createSignedUrl(payment.screenshot_url, 60 * 60 * 24);
      if (data) {
        payment.screenshot_url = data.signedUrl;
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-white mb-2">Payment Verification</h1>
        <p className="text-gray-400">Verify manual UPI payments and issue E-Passes.</p>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-4">
        <div className="bg-yellow-500/20 border border-yellow-500/50 px-4 py-2 rounded-lg inline-block">
          <span className="text-yellow-400 font-bold mr-2">{payments.length}</span>
          <span className="text-yellow-500/80 text-sm">Pending Verification</span>
        </div>
      </div>

      <PaymentVerificationTable payments={payments} />
    </div>
  );
}
