import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Nos chambres', to: '/#suites', isHash: true },
  { name: 'Nos offres', to: '/experience' },
  { name: 'Boutique', to: '/boutique' },
  { name: 'Cartes cadeaux', to: '/cartes-cadeaux' },
  { name: 'Contact', to: '/#contact', isHash: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>

      <nav className={`fixed top-8 left-1/2 -translate-x-1/2 w-[95%] max-w-[1400px] z-[110] transition-all duration-700 ${scrolled ? 'bg-gold/30 backdrop-blur-3xl py-0 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] rounded-full border border-noir/5' : 'bg-transparent py-2'}`}>
        <div className="container-wide flex items-center justify-between px-10">
          {/* Logo */}
          <Link to="/" className="relative z-[110] group">
            <img
              src="/logo.png"
              alt="Maison Love Rooms"
              className={`h-18 scale-150 md:h-24 md:scale-130 w-auto transition-all duration-700 scale-110 md:scale-125 ${scrolled ? 'brightness-0' : (isOpen ? 'bg-transparent' : '')}`}
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.name} link={link} scrolled={scrolled} />
            ))}
            <div className={`h-4 w-px mx-2 transition-colors duration-700 ${scrolled ? 'bg-noir/10' : 'bg-white/20'}`} />
            <Link to="/checkout" className={`${scrolled ? 'bg-noir text-white shadow-lg' : 'bg-white/20 backdrop-blur-md border border-white/30 text-white'} px-8 py-3 rounded-full text-[13px] tracking-[0.3em] font-bold hover:bg-gold hover:text-noir transition-all duration-500`}>
              Réserver
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden relative z-[130] p-2 transition-colors ${scrolled || isOpen ? (isOpen ? 'text-white' : 'text-noir') : 'text-white'} hover:text-gold`}
          >
            {isOpen ? <X size={32} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Moved outside <nav> for full-screen coverage */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-[#0A0A0A]/95 backdrop-blur-xl z-[200] flex flex-col pt-8 pb-12 px-8 overflow-x-hidden overflow-y-auto"
          >
            {/* Header inside Mobile Menu */}
            <div className="flex items-center justify-between mb-12 relative z-20 pt-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="block">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-20 scale-150 md:h-24 w-auto"
                />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white hover:text-gold transition-colors bg-white/5 rounded-full"
              >
                <X size={28} />
              </button>
            </div>

            {/* Background Decorative Pattern (Subtle) */}
            <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 right-0 w-64 h-64 border border-white rounded-full -mr-32" />
              <div className="absolute bottom-1/4 left-0 w-96 h-96 border border-white rounded-full -ml-48" />
            </div>

            <div className="flex flex-col items-center justify-center gap-8 flex-1 relative z-10 py-10">
              {NAV_LINKS.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="w-full text-center"
                >
                  <NavLink link={link} onClick={() => setIsOpen(false)} isMobile />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-auto relative z-10 w-full"
            >
              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="bg-gold text-noir w-full text-center py-5 rounded-xl flex items-center justify-center gap-4 group font-bold tracking-[0.3em] text-[14px] shadow-2xl shadow-gold/20"
              >
                <span>Réserver un séjour</span>
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ link, onClick, isMobile, scrolled }: { link: any, onClick?: () => void, isMobile?: boolean, key?: any, scrolled?: boolean }) {
  const isHash = link.isHash;
  const Comp = isHash ? 'a' : Link;
  const props = isHash ? { href: link.to } : { to: link.to };

  return (
    <Comp
      {...props}
      onClick={onClick}
      className={`relative group inline-block overflow-hidden transition-colors ${isMobile ? 'text-4xl font-serif italic py-2 text-white' : `text-[14px] font-serif tracking-[0.2em] ${scrolled ? 'text-noir hover:text-gold' : 'text-white hover:text-gold'}`}`}
    >
      <span className="relative z-10">{link.name}</span>
      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-500" />
    </Comp>
  );
}
