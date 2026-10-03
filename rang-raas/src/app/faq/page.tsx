"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const faqs = [
  {
    question: "When and where is RANG RAAS happening?",
    answer: "RANG RAAS – Pre-Navratri Garba Night will be held on Saturday, 10 October 2026, from 7:00 PM to 10:00 PM at Ranbhoomi, Marambal Pada Road, Jatty Road, near Sai Baba Mandir, Virar West, Maharashtra 401301."
  },
  {
    question: "What are the ticket prices?",
    answer: "Early Bird Pass: ₹249\n\nRegular Pass: ₹299\n\nEarly Bird passes may be available in limited quantity."
  },
  {
    question: "What is included with the pass?",
    answer: "Your pass gives you entry to RANG RAAS featuring:\n\n• Live DJ\n• Garba\n• Dandiya vibes\n• Snacks & water\n• Ice-breaker games"
  },
  {
    question: "How can I book my pass?",
    answer: "Click “Book Passes”, select your pass type and quantity, enter your details, and proceed to payment."
  },
  {
    question: "How do I make the payment?",
    answer: "Payment is made through UPI. A payment QR code will be displayed with your booking amount.\n\nYou can scan the QR using Google Pay, PhonePe, Paytm, or another compatible UPI app.\n\nAfter making the payment, submit your UTR / Transaction ID and payment screenshot."
  },
  {
    question: "Does the QR automatically verify my payment?",
    answer: "No.\n\nAfter you make the UPI payment, the event team manually verifies the transaction.\n\nYour booking is confirmed after successful payment verification."
  },
  {
    question: "When will I receive my E-Pass?",
    answer: "After your payment is successfully verified, your E-Pass will be generated and sent to your registered email address."
  },
  {
    question: "I booked multiple passes. Will I receive multiple PDFs?",
    answer: "No.\n\nMultiple tickets from the same booking are included in one E-Pass PDF.\n\nEach individual ticket has its own unique Ticket ID and QR code.\n\nFor example, if you purchase 4 passes, your E-Pass PDF will contain 4 individual tickets with 4 unique QR codes."
  },
  {
    question: "Can I show the E-Pass on my phone at the entrance?",
    answer: "Yes.\n\nYou can show the QR code on your phone at the entrance.\n\nWe recommend keeping your E-Pass downloaded and ready before reaching the venue."
  },
  {
    question: "Can I use one QR code for multiple people?",
    answer: "No.\n\nEach ticket has a unique QR code and must be scanned individually at the entrance."
  },
  {
    question: "What happens if my QR code is scanned twice?",
    answer: "Each ticket can only be checked in once.\n\nIf the same ticket is scanned again, the system will show that the ticket has already been checked in."
  },
  {
    question: "Do I need to carry an ID?",
    answer: "Yes.\n\nPlease carry a valid photo ID matching the name on your ticket."
  },
  {
    question: "Can I transfer my ticket to someone else?",
    answer: "Ticket transfers are not available unless specifically approved by the event organizers."
  },
  {
    question: "Are tickets refundable or cancellable?",
    answer: "Please review the applicable event cancellation and refund policy before purchasing.\n\nIf the event has a specific refund policy configured in the admin settings, display that policy here instead of hardcoding conflicting information."
  },
  {
    question: "What should I do if I don't receive my E-Pass email?",
    answer: "First check your Spam, Junk, or Promotions folder.\n\nIf you still cannot find your E-Pass, contact the RANG RAAS event team with your Booking ID and registered email address."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white selection:bg-[#D9A441]/30 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 border-b border-[#D9A441]/20">
          <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center opacity-30 mix-blend-screen"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#071426]/80 to-[#0A1830]/70"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-[#F4C95D] italic tracking-wider drop-shadow-[0_0_20px_rgba(217,164,65,0.4)]">
              FREQUENTLY ASKED QUESTIONS
            </h1>
            <p className="text-lg md:text-xl font-medium tracking-wide text-[#FFF7E6]">
              Everything you need to know before joining<br />
              <span className="text-[#D9A441] font-bold">RANG RAAS – Pre-Navratri Garba Night.</span>
            </p>
            <div className="flex justify-center pt-4">
              <div className="w-24 h-1 rounded-full bg-gradient-to-r from-transparent via-[#D9A441] to-transparent"></div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-[#071426]/80 border border-[#D9A441]/30 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(217,164,65,0.05)] hover:border-[#D9A441]/60 transition-colors"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441] group"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="font-semibold text-lg md:text-xl text-[#FFF7E6] pr-8 group-hover:text-[#F4C95D] transition-colors">
                      {faq.question}
                    </span>
                    <span className="flex-shrink-0 text-[#D9A441]">
                      {isOpen ? <Minus size={24} /> : <Plus size={24} />}
                    </span>
                  </button>
                  
                  <div 
                    id={`faq-answer-${index}`}
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="pt-2 text-gray-300 space-y-4 whitespace-pre-wrap leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Still Have Questions CTA */}
          <div className="mt-24 text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-[#F4C95D] tracking-wider uppercase">
              Still have questions?
            </h2>
            <p className="text-lg text-gray-300">We&apos;re happy to help.</p>
            <div className="flex justify-center mt-6">
              <a 
                href="https://www.instagram.com/weekendculture.club?stkn=cDBjZG4zZGEycjIz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-full border border-white/10 hover:border-[#D9A441]/50 transition-all group shadow-[0_0_20px_rgba(217,164,65,0.1)] hover:shadow-[0_0_20px_rgba(217,164,65,0.3)]"
              >
                <Image src="/Instagram.png" alt="Instagram" width={24} height={24} className="group-hover:scale-110 transition-transform" />
                <span className="font-bold tracking-widest uppercase text-[#FFF7E6]">Follow us on Instagram</span>
              </a>
            </div>
          </div>

          {/* Event Details Reminder */}
          <div className="mt-16 bg-[#071426] border border-[#D9A441]/20 rounded-2xl p-8 md:p-12 text-center shadow-[0_0_30px_rgba(217,164,65,0.1)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D9A441]/5 to-transparent"></div>
            <div className="relative z-10 space-y-6">
              <h3 className="font-playfair text-3xl md:text-4xl font-bold text-[#F4C95D] tracking-wider italic">RANG RAAS</h3>
              <p className="text-lg md:text-xl font-medium tracking-widest uppercase text-[#FFF7E6]">Pre-Navratri Garba Night</p>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 text-gray-300 my-8">
                <span>Saturday, 10 October 2026</span>
                <span className="hidden md:inline text-[#D9A441]">•</span>
                <span>7:00 PM – 10:00 PM</span>
                <span className="hidden md:inline text-[#D9A441]">•</span>
                <span>Ranbhoomi, Virar West</span>
              </div>

              <Link 
                href="/passes"
                className="inline-block bg-gradient-to-r from-[#D9A441] to-[#F4C95D] text-[#020817] px-10 py-4 rounded-full font-bold text-lg hover:from-[#F4C95D] hover:to-[#FFD978] transition-all shadow-[0_0_20px_rgba(217,164,65,0.4)] hover:shadow-[0_0_30px_rgba(217,164,65,0.6)] uppercase tracking-wider hover:scale-105"
              >
                Book Passes
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
