"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitPayment } from "../actions/payment";

export function PaymentForm({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [utr, setUtr] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [screenshot, setScreenshot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }
    
    setError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      setScreenshot(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr || !paymentDate || !screenshot) {
      setError("Please fill all required fields and upload a screenshot.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const res = await submitPayment({
      bookingId,
      utr,
      paymentDate,
      screenshotBase64: screenshot,
    });

    if (res.success) {
      router.push(`/payment-pending?bookingId=${bookingId}`);
    } else {
      setError(res.error || "Failed to submit payment details.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-xl border border-gold/30">
      <h3 className="text-xl font-bold mb-6 text-white">After Payment, Enter Details</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-gray-300 mb-2">UTR / Transaction ID *</label>
          <input 
            type="text" 
            value={utr}
            onChange={e => setUtr(e.target.value)}
            placeholder="e.g. 312345678901" 
            className="w-full"
            required 
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Payment Date *</label>
          <input 
            type="date" 
            value={paymentDate}
            onChange={e => setPaymentDate(e.target.value)}
            className="w-full text-white color-scheme-dark"
            required 
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Upload Payment Screenshot *</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-white/20 rounded p-2 text-sm bg-black/20"
            required 
          />
          {screenshot && (
            <div className="mt-4">
              <p className="text-xs text-green-400 mb-2">Screenshot selected</p>
              <img src={screenshot} alt="Preview" className="h-32 object-contain rounded border border-white/10" />
            </div>
          )}
        </div>

        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded text-sm">{error}</div>}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gold text-black py-4 rounded-md font-bold text-lg hover:bg-gold-light transition-colors disabled:opacity-50 mt-4"
        >
          {isSubmitting ? "SUBMITTING..." : "SUBMIT PAYMENT DETAILS"}
        </button>
      </form>
    </div>
  );
}
