"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createBooking } from "../actions/booking";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{10}$/, "Must be a valid 10-digit number"),
  email: z.string().email("Must be a valid email address"),
  city: z.string().optional(),
  gender: z.string().optional(),
  specialRequirements: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, { message: "You must accept the terms" }),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") === "regular" ? "Regular" : "Early Bird";
  const price = type === "Regular" ? 299 : 249;
  
  const initialQty = parseInt(searchParams.get("quantity") || "1", 10);
  const [quantity, setQuantity] = useState(isNaN(initialQty) ? 1 : initialQty);
  const totalAmount = price * quantity;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await createBooking({
        ...data,
        passType: type.toLowerCase(),
        quantity: quantity,
      });
      if (res.success) {
        router.push(`/payment?bookingId=${res.bookingId}`);
      } else {
        setError(res.error || "Failed to create booking");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-xl">
      {/* Selected Pass Summary */}
      <div className="bg-black/30 p-4 md:p-6 rounded-lg mb-8 border border-white/5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm text-gray-400 mb-1">Selected Pass</h3>
            <div className="font-semibold text-xl text-gold">{type}</div>
            <div className="text-sm text-gray-400 mt-1">₹{price} per ticket</div>
          </div>
          <button type="button" onClick={() => router.back()} className="text-sm text-gray-300 hover:text-white border border-white/20 px-3 py-1 rounded transition-colors">Edit Pass</button>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300 hidden md:inline">Quantity:</span>
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full border border-gold text-gold flex items-center justify-center disabled:opacity-30 hover:bg-gold/10 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="font-bold text-white w-4 text-center">{quantity}</span>
              <button 
                type="button"
                onClick={() => setQuantity(q => Math.min(10, q + 1))}
                disabled={quantity >= 10}
                className="w-8 h-8 rounded-full border border-gold text-gold flex items-center justify-center disabled:opacity-30 hover:bg-gold/10 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-xs text-gray-400 mr-2">Total</span>
            <span className="font-bold text-2xl">₹{totalAmount}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-semibold border-b border-white/10 pb-2 mb-4">Personal Information</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Full Name *</label>
            <input type="text" {...register("name")} placeholder="e.g. Rajesh Rajgor" />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Mobile Number *</label>
            <input type="tel" {...register("phone")} placeholder="9876543210" />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Email Address *</label>
          <input type="email" {...register("email")} placeholder="rajesh@example.com" />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">City (Optional)</label>
          <input type="text" {...register("city")} placeholder="e.g. Mumbai" />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Gender (Optional)</label>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="Male" {...register("gender")} className="accent-gold" />
              <span>Male</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="Female" {...register("gender")} className="accent-gold" />
              <span>Female</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="Other" {...register("gender")} className="accent-gold" />
              <span>Prefer not to say</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Special Requirements (Optional)</label>
          <textarea {...register("specialRequirements")} placeholder="Any special request?" rows={3}></textarea>
        </div>

        <div className="flex items-start gap-3 mt-6">
          <input type="checkbox" id="terms" {...register("termsAccepted")} className="mt-1 accent-gold w-4 h-4" />
          <label htmlFor="terms" className="text-sm text-gray-300">
            I agree to the <Link href="/terms" className="text-gold hover:underline">Terms & Conditions</Link> and Event Guidelines.
          </label>
        </div>
        {errors.termsAccepted && <p className="text-red-400 text-xs mt-1">{errors.termsAccepted.message}</p>}

        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded text-sm">{error}</div>}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gold text-black py-4 rounded-md font-bold text-lg hover:bg-gold-light transition-colors disabled:opacity-50 mt-8"
        >
          {isSubmitting ? "PROCESSING..." : "PROCEED TO PAYMENT \u2192"}
        </button>
      </form>
    </div>
  );
}
