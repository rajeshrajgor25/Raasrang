"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-md glass-card p-8 rounded-2xl border border-gold/30">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center bg-black mx-auto mb-4 shadow-[0_0_15px_rgba(220,179,101,0.3)]">
            <span className="font-playfair text-gold font-bold text-xl">WCC</span>
          </div>
          <h1 className="text-3xl font-playfair font-bold text-gold uppercase tracking-widest">RANG RAAS</h1>
          <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest">Admin Portal</p>
        </div>

        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded text-sm text-center mb-6">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:border-gold outline-none transition-colors"
              placeholder="admin@wcc.com"
              required 
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:border-gold outline-none transition-colors"
              placeholder="••••••••"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gold text-black py-4 rounded-md font-bold text-lg hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {isLoading ? "AUTHENTICATING..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}
