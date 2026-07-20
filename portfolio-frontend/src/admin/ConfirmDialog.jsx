import { AnimatePresence, motion } from "framer-motion";
import { RiErrorWarningLine } from "react-icons/ri";

// Controlled confirm dialog. Pass `open`, a message, and callbacks —
// renders nothing when `open` is false.
export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  danger = true,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 z-[90] bg-ink-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-ink-600 bg-ink-900 p-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className={`w-10 h-10 shrink-0 rounded-full grid place-items-center ${
                  danger
                    ? "bg-rose-500/15 text-rose-400"
                    : "bg-teal-400/15 text-teal-300"
                }`}
              >
                <RiErrorWarningLine size={20} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base">
                  {title}
                </h3>
                {message && (
                  <p className="text-sm text-muted mt-1.5 leading-relaxed">
                    {message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-full border border-ink-600 text-sm hover:border-ink-500 transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  danger
                    ? "bg-rose-500 text-white hover:bg-rose-400"
                    : "bg-teal-400 text-ink-900 hover:bg-teal-300"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
