import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, XCircle, Trash2, X, Info } from 'lucide-react';

// ─── Toast Notification (Success / Error / Info) ─────────────────────────────
interface ToastProps {
  show: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}

export function AdminToast({ show, type, message, onClose }: ToastProps) {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const config = {
    success: { icon: CheckCircle2, bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', bar: 'bg-emerald-400' },
    error:   { icon: XCircle,      bg: 'bg-rose-500/10',    border: 'border-rose-500/30',    text: 'text-rose-400',    bar: 'bg-rose-400' },
    info:    { icon: Info,         bg: 'bg-gold/10',        border: 'border-gold/30',        text: 'text-gold',        bar: 'bg-gold' },
  }[type];

  const Icon = config.icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -30, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -30, x: '-50%' }}
          className={`fixed top-6 left-1/2 z-[200] ${config.bg} ${config.border} border backdrop-blur-xl rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl shadow-black/40 min-w-[340px] max-w-[500px]`}
        >
          <div className={`p-2 rounded-xl ${config.bg}`}>
            <Icon size={20} className={config.text} />
          </div>
          <p className="text-sm text-white/90 font-medium flex-1">{message}</p>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <X size={16} />
          </button>
          {/* Animated progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 3.5, ease: 'linear' }}
            className={`absolute bottom-0 left-0 h-[2px] w-full ${config.bar} origin-left rounded-b-2xl`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Confirmation Modal (Delete / Destructive Actions) ───────────────────────
interface ConfirmModalProps {
  show: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminConfirmModal({
  show,
  title = 'Confirmer la suppression',
  message,
  confirmLabel = 'Supprimer',
  cancelLabel = 'Annuler',
  type = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const isDanger = type === 'danger';

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[210] w-[90%] max-w-[440px]"
          >
            <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/60">
              {/* Icon */}
              <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${isDanger ? 'bg-rose-500/10' : 'bg-amber-500/10'}`}>
                {isDanger ? (
                  <Trash2 size={28} className="text-rose-400" />
                ) : (
                  <AlertTriangle size={28} className="text-amber-400" />
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-serif text-center text-white mb-2">{title}</h3>

              {/* Message */}
              <p className="text-sm text-white/50 text-center leading-relaxed mb-8">{message}</p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3.5 rounded-xl border border-white/[0.08] text-white/60 text-sm font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    isDanger
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                  }`}
                >
                  {isDanger && <Trash2 size={14} />}
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Hook pour simplifier l'utilisation ──────────────────────────────────────
export function useAdminToast() {
  const [toast, setToast] = React.useState<{ show: boolean; type: 'success' | 'error' | 'info'; message: string }>({
    show: false,
    type: 'success',
    message: '',
  });

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ show: true, type, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  return { toast, showToast, hideToast };
}

export function useAdminConfirm() {
  const [confirm, setConfirm] = React.useState<{ show: boolean; title: string; message: string; type: 'danger' | 'warning'; onConfirm: () => void }>({
    show: false,
    title: '',
    message: '',
    type: 'danger',
    onConfirm: () => {},
  });

  const showConfirm = (opts: { title?: string; message: string; type?: 'danger' | 'warning'; onConfirm: () => void }) => {
    setConfirm({
      show: true,
      title: opts.title || 'Confirmer la suppression',
      message: opts.message,
      type: opts.type || 'danger',
      onConfirm: opts.onConfirm,
    });
  };

  const hideConfirm = () => {
    setConfirm(prev => ({ ...prev, show: false }));
  };

  return { confirm, showConfirm, hideConfirm };
}
