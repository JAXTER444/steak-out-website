export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white/80">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p className="text-white/60">© {new Date().getFullYear()} Steak-Out</p>
        <a
          href="mailto:steakout@protonmail.com"
          className="text-white/90 hover:text-[#EE101A] transition-colors"
        >
          steakout@protonmail.com
        </a>
      </div>
    </footer>
  );
}
