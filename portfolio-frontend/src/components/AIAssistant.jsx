import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiSparkling2Line,
  RiCloseLine,
  RiSendPlaneFill,
  RiRobot2Line,
} from "react-icons/ri";
import {
  answerQuery,
  quickActions,
  welcomeMessage,
} from "../data/assistantKnowledge";
import { useContent } from "../context/ContentContext";
import { img } from "../utils/images";

function runAction(action, profile) {
  if (!action) return;
  if (action.type === "scroll") {
    document
      .getElementById(action.target)
      ?.scrollIntoView({ behavior: "smooth" });
  } else if (action.type === "link") {
    window.open(action.target, "_blank", "noopener,noreferrer");
  } else if (action.type === "resume") {
    window.open(img(profile.resumeFile), "_blank", "noopener,noreferrer");
  }
}

export default function AIAssistant() {
  const { content } = useContent();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: welcomeMessage },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing, open]);

  // Prevent the page behind from scrolling while the panel is open on mobile.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const send = (text) => {
    const query = (text ?? input).trim();
    if (!query) return;
    setMessages((m) => [...m, { role: "user", text: query }]);
    setInput("");
    setTyping(true);

    setTimeout(
      () => {
        const { text: reply, action } = answerQuery(query, content);
        setMessages((m) => [...m, { role: "assistant", text: reply, action }]);
        setTyping(false);
        if (action) setTimeout(() => runAction(action, content.profile), 350);
      },
      500 + Math.random() * 400,
    );
  };

  return createPortal(
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open Arun's AI Portfolio Assistant"
        style={{
          bottom: "calc(1.25rem + env(safe-area-inset-bottom))",
          right: "calc(1.25rem + env(safe-area-inset-right))",
        }}
        className="fixed sm:bottom-8 sm:right-8 z-[9999] w-14 h-14 rounded-full bg-ink-800/80 backdrop-blur-md border border-teal-400/40 shadow-glow grid place-items-center"
      >
        <span className="absolute inset-0 rounded-full bg-teal-400/20 animate-ping" />
        {open ? (
          <RiCloseLine className="relative text-paper" size={22} />
        ) : (
          <RiSparkling2Line className="relative text-teal-300" size={22} />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop — dims the page and lets you tap outside to close, like a proper modal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[9998] bg-ink-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.25 }}
              style={{
                height: "min(560px, 85dvh)",
                maxHeight: "min(560px, 85dvh)",
                marginBottom: "env(safe-area-inset-bottom)",
              }}
              className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-8 sm:right-8 z-[9999] sm:w-[380px] rounded-t-3xl sm:rounded-3xl border border-ink-600 bg-ink-900/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 p-4 border-b border-ink-700 bg-ink-800/60 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-teal-400/30 to-amber-500/20 grid place-items-center border border-teal-400/30">
                    <RiRobot2Line className="text-teal-300" size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-sm truncate">
                      AI Portfolio Assistant
                    </p>
                    <p className="text-[11px] text-muted font-mono truncate">
                      Ask anything about Arun Kumar
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="shrink-0 w-8 h-8 grid place-items-center rounded-full text-muted hover:text-paper transition-colors sm:hidden"
                >
                  <RiCloseLine size={20} />
                </button>
              </div>

              <div
                ref={scrollRef}
                className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 no-scrollbar"
              >
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      m.role === "user"
                        ? "ml-auto bg-teal-400 text-ink-900 font-medium"
                        : "bg-ink-800 border border-ink-600 text-paper/90"
                    }`}
                  >
                    {m.text}
                  </motion.div>
                ))}
                {typing && (
                  <div className="bg-ink-800 border border-ink-600 rounded-2xl px-4 py-2.5 w-fit flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-teal-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-2 shrink-0">
                {quickActions.map((qa) => (
                  <button
                    key={qa.label}
                    onClick={() => send(qa.query)}
                    className="shrink-0 px-3 py-1.5 rounded-full border border-ink-600 text-[11px] font-mono uppercase tracking-wider text-muted hover:text-teal-300 hover:border-teal-400/40 transition-colors"
                  >
                    {qa.label}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                style={{
                  paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
                }}
                className="flex items-center gap-2 p-3 border-t border-ink-700 shrink-0"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Arun's projects, skills…"
                  className="flex-1 bg-ink-800 border border-ink-600 rounded-full px-4 py-2.5 text-sm focus:border-teal-400 outline-none transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  className="w-10 h-10 shrink-0 grid place-items-center rounded-full bg-teal-400 text-ink-900 hover:bg-teal-300 transition-colors"
                >
                  <RiSendPlaneFill size={16} />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
}
