import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { RiExternalLinkLine } from "react-icons/ri";
import { useContent } from "../context/ContentContext";
import { getAchievementIcon } from "../utils/icons";

function TrophyEntry({ achievement, index }) {
  const Icon = getAchievementIcon(achievement.icon);
  const left = index % 2 === 0;

  return (
    <div
      className={`relative flex items-start gap-5 pl-14 md:w-1/2 md:pl-0 ${
        left
          ? "md:mr-auto md:flex-row-reverse md:pr-14 md:text-right"
          : "md:ml-auto md:pl-14"
      }`}
    >
      <motion.div
        initial={{ scale: 0, rotate: -60 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
        className={`absolute left-0 top-1 z-10 md:top-2 ${left ? "md:left-auto md:-right-6" : "md:-left-6"}`}
      >
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 via-[#7B61FF] to-amber-400 p-[2px] shadow-glow">
          <div className="w-full h-full rounded-full bg-ink-900 grid place-items-center">
            <Icon className="text-teal-300" size={18} />
          </div>
        </div>
      </motion.div>

      <motion.a
        href={achievement.link || undefined}
        target={achievement.link ? "_blank" : undefined}
        rel="noreferrer"
        initial={{ opacity: 0, y: 30, x: left ? -16 : 16 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -3 }}
        className="block w-full rounded-2xl border border-ink-600 bg-ink-800/40 p-5 sm:p-6 hover:border-teal-400/40 transition-colors"
      >
        <div
          className={`flex items-start gap-2 ${left ? "md:flex-row-reverse" : ""}`}
        >
          <div className="flex-1">
            <p className="font-mono text-[11px] uppercase tracking-wider text-amber-400 mb-1">
              {achievement.subtitle}
            </p>
            <h3 className="font-display font-semibold text-base sm:text-lg">
              {achievement.title}
            </h3>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              {achievement.detail}
            </p>
          </div>
          {achievement.link && (
            <RiExternalLinkLine
              className="text-muted mt-1 shrink-0"
              size={16}
            />
          )}
        </div>
      </motion.a>
    </div>
  );
}

export default function Achievements() {
  const { content } = useContent();
  const achievements = content.achievements || [];
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  });
  const spineProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    mass: 0.5,
  });

  return (
    <section
      id="achievements"
      className="section-pad py-24 lg:py-32 bg-ink-950/50 border-y border-ink-700"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <p className="eyebrow mb-3">Trophy Cabinet</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Wins, ranks, and recognitions.
          </h2>
        </div>

        <div ref={timelineRef} className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-ink-600 md:-translate-x-1/2" />
          <motion.div
            style={{ scaleY: spineProgress, x: "-50%" }}
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[3px] origin-top rounded-full bg-gradient-to-b from-teal-400 via-[#7B61FF] to-amber-400 shadow-glow"
          />
          <div className="space-y-10 md:space-y-14">
            {achievements.map((a, i) => (
              <TrophyEntry key={a.id} achievement={a} index={i} />
            ))}
          </div>
        </div>

        {achievements.length === 0 && (
          <p className="text-sm text-muted">No achievements added yet.</p>
        )}
      </div>
    </section>
  );
}
