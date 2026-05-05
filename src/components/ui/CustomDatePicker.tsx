import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CustomDatePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  // Adjust so Monday is the first day of the week (0 = Monday, 6 = Sunday)
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const dayNames = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    setIsOpen(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="relative w-full" ref={ref}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="relative group cursor-pointer"
      >
        <CalendarIcon className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors z-10 ${isOpen || selectedDate ? 'text-gold' : 'text-white/20 group-hover:text-gold/50'}`} size={18} />
        <div className={`w-full bg-[#0A0A0A] border rounded-2xl p-6 pl-16 italic outline-none transition-all select-none ${isOpen ? 'border-gold shadow-[0_0_15px_rgba(188,155,93,0.1)]' : 'border-white/10 hover:border-white/30'} ${selectedDate ? 'text-white' : 'text-white/30'}`}>
          {selectedDate ? formatDate(selectedDate) : "Sélectionner une date"}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-full left-0 mt-4 w-full sm:w-[320px] bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-colors">
                <ChevronLeft size={18} />
              </button>
              <span className="font-serif text-lg text-white capitalize tracking-wide">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button onClick={handleNextMonth} className="p-2 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-4 text-center">
              {dayNames.map(day => (
                <div key={day} className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{day}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startingDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentMonth.getMonth() && selectedDate?.getFullYear() === currentMonth.getFullYear();
                
                return (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    className={`aspect-square flex items-center justify-center rounded-full text-sm transition-all ${
                      isSelected 
                        ? 'bg-gold text-[#0A0A0A] font-bold shadow-lg shadow-gold/20 scale-105' 
                        : 'text-white/80 hover:bg-white/10 hover:text-gold'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
