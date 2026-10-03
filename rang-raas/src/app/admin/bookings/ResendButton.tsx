"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export function ResendEpassButton({ bookingId, email, disabled }: { bookingId: string; email: string; disabled: boolean }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async () => {
    if (!confirm(`Resend E-Pass email to ${email}?`)) return;
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/resend-epass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      
      if (data.success) {
        alert("E-Pass email sent successfully!");
      } else {
        alert(data.error || "Failed to resend E-Pass.");
      }
    } catch (e) {
      alert("Error connecting to server.");
    } finally {
      setIsLoading(false);
    }
  };

  if (disabled) return null;

  return (
    <button 
      onClick={handleResend}
      disabled={isLoading}
      className="px-3 py-1 bg-gold/20 text-gold rounded hover:bg-gold/30 border border-gold/30 text-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
      title="Resend E-Pass Email"
    >
      <Mail size={14} /> {isLoading ? "..." : "Resend E-Pass"}
    </button>
  );
}
