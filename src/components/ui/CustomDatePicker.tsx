import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  variant?: 'default' | 'compact';
}

export default function CustomDatePicker({ value, onChange, placeholder = "Sélectionner une date", minDate, maxDate, variant = 'default' }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
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

  // Sync current month view when value changes externally
  useEffect(() => {
    if (value) {
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  // Adjust so Monday is the first day of the week (0 = Monday, 6 = Sunday)
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const dayNames = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const y = currentMonth.getFullYear();
    const m = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const isDayDisabled = (day: number) => {
    const checkDateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (minDate && checkDateStr < minDate) return true;
    if (maxDate && checkDateStr > maxDate) return true;
    return false;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return placeholder;
    const parts = dateString.split('-');
    if (parts.length !== 3) return placeholder;
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="relative w-full" ref={ref}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="relative group cursor-pointer"
      >
        <CalendarIcon 
          className={`absolute transition-colors z-10 -translate-y-1/2 ${
            variant === 'compact' ? 'left-4 size-4 top-1/2' : 'left-6 size-[18px] top-1/2'
          } ${isOpen || value ? 'text-gold' : 'text-white/40 group-hover:text-gold/50'}`} 
        />
        <div 
          className={`w-full transition-all select-none outline-none ${
            variant === 'compact' 
              ? `bg-white/[0.03] border rounded-xl py-3 px-4 pl-10 text-sm font-semibold ${
                  isOpen ? 'border-gold/30 shadow-[0_0_15px_rgba(188,155,93,0.1)]' : 'border-white/[0.05] hover:border-white/20'
                }`
              : `bg-[#0A0A0A] border rounded-2xl p-6 pl-16 italic ${
                  isOpen ? 'border-gold shadow-[0_0_15px_rgba(188,155,93,0.15)]' : 'border-white/10 hover:border-white/30'
                }`
          } ${value ? 'text-white' : 'text-white/40'}`}
        >
          {formatDate(value)}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 mt-4 w-full sm:w-[320px] bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button 
                type="button"
                onClick={handlePrevMonth} 
                className="p-2 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="font-serif text-lg text-white capitalize tracking-wide select-none">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button 
                type="button"
                onClick={handleNextMonth} 
                className="p-2 hover:bg-white/5 rounded-full text-white/60 hover:text-white transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-4 text-center select-none">
              {dayNames.map(day => (
                <div key={day} className="text-[10px] uppercase tracking-widest text-white/50 font-bold">{day}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startingDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                
                const y = currentMonth.getFullYear();
                const m = String(currentMonth.getMonth() + 1).padStart(2, '0');
                const d = String(day).padStart(2, '0');
                const currentDateStr = `${y}-${m}-${d}`;
                
                const isSelected = value === currentDateStr;
                const disabled = isDayDisabled(day);
                
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={disabled}
                    onClick={(e) => handleDateSelect(day, e)}
                    className={`aspect-square flex items-center justify-center rounded-full text-sm transition-all ${
                      isSelected 
                        ? 'bg-gold text-[#0A0A0A] font-bold shadow-lg shadow-gold/20 scale-105' 
                        : disabled
                          ? 'text-white/10 cursor-not-allowed pointer-events-none'
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
