export function Footer() {
  return (
    <footer className="border-t border-gold mt-auto glass-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <p className="mb-2 font-playfair text-gold text-2xl font-semibold tracking-wider">Weekend Culture Club</p>
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Rang Raas. All rights reserved.</p>
          </div>
          
          <a 
            href="https://www.instagram.com/weekendculture.club?stkn=cDBjZG4zZGEycjIz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full transition-colors border border-white/5"
          >
            <img src="/Instagram.png" alt="Instagram" className="w-6 h-6 object-contain" />
            <span className="text-gray-200 font-medium tracking-wide">@weekendculture.club</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
