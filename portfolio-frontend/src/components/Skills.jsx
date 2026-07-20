import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiArrowDownSLine } from "react-icons/ri";
import { useContent } from "../context/ContentContext";
import { getSkillIcon } from "../utils/icons";

const accentMap = {
  amber: {
    text: "text-amber-400",
    activeBorder: "border-amber-400",
    glow: "shadow-glow-amber",
    dot: "bg-amber-500",
  },
  teal: {
    text: "text-teal-300",
    activeBorder: "border-teal-400",
    glow: "shadow-glow",
    dot: "bg-teal-400",
  },
};

export default function Skills() {
  const { content } = useContent();
  const skillOrbs = content.skillOrbs;
  const [active, setActive] = useState(skillOrbs[0]?.id);
  const panelRef = useRef(null);
  const activeOrb = skillOrbs.find((o) => o.id === active) || skillOrbs[0];
  const c = accentMap[activeOrb.accent];

  const handleSelect = (id) => {
    setActive(id);
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  return (
    <section id="skills" className="section-pad py-24 lg:py-32 bg-ink-950/50 border-y border-ink-700">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3">Skills</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Pick a category, see the stack.
          </h2>
          <p className="text-muted mt-4 leading-relaxed">
            Eight categories spanning full-stack engineering, applied AI/ML, and the
            embedded roots underneath it all. Tap one below to see it expand.
          </p>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 mb-2">
          {skillOrbs.map((orb) => {
            const oc = accentMap[orb.accent];
            const isActive = active === orb.id;
            const Icon = getSkillIcon(orb.icon);
            return (
              <button
                key={orb.id}
                onClick={() => handleSelect(orb.id)}
                aria-pressed={isActive}
                className={`group relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 px-3 text-center transition-all duration-300 ${
                  isActive
                    ? `${oc.activeBorder} bg-ink-800 ${oc.glow} scale-[1.04]`
                    : "border-ink-600 bg-ink-800/30 hover:border-ink-500"
                }`}
              >
                <Icon className={isActive ? oc.text : "text-muted group-hover:text-paper"} size={22} />
                <span
                  className={`font-mono text-[11px] sm:text-xs uppercase tracking-wider leading-tight ${
                    isActive ? oc.text : "text-muted group-hover:text-paper"
                  }`}
                >
                  {orb.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="skill-orb-indicator"
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${oc.dot}`}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center mb-4">
          <RiArrowDownSLine className={`${c.text} animate-bounce`} size={22} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeOrb.id}
            ref={panelRef}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl border-2 ${c.activeBorder} bg-ink-800/50 p-6 sm:p-8 scroll-mt-24`}
          >
            <div className="flex items-center gap-2 mb-5">
              <span className={`w-2 h-2 rounded-full ${c.dot}`} />
              <h3 className={`font-mono text-xs uppercase tracking-wider ${c.text}`}>
                Showing: {activeOrb.label}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeOrb.skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-full text-xs sm:text-sm border border-ink-600 text-paper/90 bg-ink-900/50"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
