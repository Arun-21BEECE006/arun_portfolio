import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiMapPinLine,
  RiCheckboxCircleLine,
  RiArrowDownSLine,
  RiBriefcaseLine,
} from "react-icons/ri";
import { useContent } from "../context/ContentContext";

const filters = [
  { id: "all", label: "All" },
  { id: "fulltime", label: "Full-Time" },
  { id: "internship", label: "Internships" },
];

function ExperienceCard({ item, index, expanded, onToggle }) {
  const panelId = `experience-panel-${item.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative pl-14 sm:pl-16"
    >
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          delay: 0.1 + index * 0.08,
          type: "spring",
          stiffness: 240,
          damping: 16,
        }}
        className="absolute left-0 top-6 z-10"
      >
        <div
          className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 ${
            item.type === "fulltime" ? "border-amber-400" : "border-teal-400"
          } bg-ink-900 shadow-glow`}
        >
          <RiBriefcaseLine
            className={
              item.type === "fulltime" ? "text-amber-400" : "text-teal-300"
            }
            size={18}
          />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={`overflow-hidden rounded-2xl border bg-ink-800/40 transition-shadow duration-300 ${
          expanded
            ? "border-teal-400/40 shadow-glow"
            : "border-ink-600 hover:border-ink-500"
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left sm:px-7 sm:py-6"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h3 className="font-display text-lg font-semibold sm:text-xl">
                {item.company}
              </h3>
              <span
                className={`rounded-full border px-3 py-0.5 font-mono text-[11px] tracking-wide ${
                  item.type === "fulltime"
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                    : "border-teal-400/40 bg-teal-400/10 text-teal-300"
                }`}
              >
                {item.period}
              </span>
            </div>
            <p className="mt-1.5 text-sm sm:text-base font-medium text-[#B7A9FF]">
              {item.title}
            </p>
            {item.location && (
              <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-muted">
                <RiMapPinLine size={14} className="text-muted/70" />
                {item.location}
              </p>
            )}
          </div>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink-600 bg-ink-900/50 text-muted"
          >
            <RiArrowDownSLine size={18} />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              id={panelId}
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-ink-700 px-5 pb-6 pt-5 sm:px-7">
                <ul className="flex flex-col gap-3">
                  {(item.points || []).map((p, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.08 + i * 0.06 }}
                      className="flex items-start gap-3 text-sm leading-relaxed text-paper/80"
                    >
                      <RiCheckboxCircleLine
                        className="mt-0.5 shrink-0 text-teal-400"
                        size={16}
                      />
                      {p}
                    </motion.li>
                  ))}
                </ul>

                {item.technologies?.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.technologies.map((tech, i) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, delay: 0.15 + i * 0.04 }}
                        className="rounded-full border border-[#9B87FF]/30 bg-[#7B61FF]/10 px-3 py-1 text-xs font-medium text-[#C9BFFF]"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function Experience() {
  const { content } = useContent();
  const experience = content.experience || [];
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(experience[0]?.id ?? null);
  const visible =
    filter === "all" ? experience : experience.filter((e) => e.type === filter);

  return (
    <section
      id="experience"
      className="section-pad py-24 lg:py-32 bg-ink-950/50 border-y border-ink-700"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">Experience</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              Full-time work & hands-on training.
            </h2>
          </div>
          <div className="flex flex-nowrap gap-2 overflow-x-auto no-scrollbar shrink-0">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider border transition-colors ${
                  filter === f.id
                    ? "bg-paper text-ink-900 border-paper"
                    : "text-muted border-ink-600 hover:text-paper hover:border-ink-500"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative space-y-6">
          <div className="absolute left-[1.375rem] sm:left-6 top-2 bottom-2 w-px bg-ink-600" />
          <AnimatePresence mode="popLayout">
            {visible.map((e, i) => (
              <ExperienceCard
                key={e.id}
                item={e}
                index={i}
                expanded={expandedId === e.id}
                onToggle={() =>
                  setExpandedId((cur) => (cur === e.id ? null : e.id))
                }
              />
            ))}
          </AnimatePresence>
        </div>

        {visible.length === 0 && (
          <p className="text-sm text-muted pl-14">
            No entries in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
