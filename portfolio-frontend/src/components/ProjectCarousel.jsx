import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiSparkling2Line,
  RiArrowRightLine,
} from "react-icons/ri";
import { img } from "../utils/images";

const categoryStyle = {
  aiml: "border-teal-400/30 bg-teal-400/10 text-teal-300",
  fullstack: "border-[#9B87FF]/30 bg-[#7B61FF]/10 text-[#B7A9FF]",
  software: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  embedded: "border-rose-400/30 bg-rose-500/10 text-rose-300",
};

export default function ProjectCarousel({ projects }) {
  const featured = projects.filter((p) => p.featured);
  const count = featured.length;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (index) => setCurrent(((index % count) + count) % count),
    [count],
  );
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (paused || count <= 1) return;
    timerRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % count),
      6000,
    );
    return () => clearInterval(timerRef.current);
  }, [paused, count]);

  if (count === 0) return null;

  // Signed circular distance from the current slide, in [-count/2, count/2].
  function offsetOf(index) {
    let diff = index - current;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  }

  function handleDragEnd(_, info) {
    const threshold = 60;
    if (info.offset.x < -threshold || info.velocity.x < -400) next();
    else if (info.offset.x > threshold || info.velocity.x > 400) prev();
  }

  return (
    <div
      className="relative mb-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative mx-auto h-[280px] w-full max-w-5xl sm:h-[340px] md:h-[400px]"
        style={{ perspective: "1400px" }}
      >
        {featured.map((project, i) => {
          const offset = offsetOf(i);
          const abs = Math.abs(offset);
          const isCenter = offset === 0;
          const visible = abs <= 2;

          return (
            <motion.div
              key={project.id}
              className={`absolute left-1/2 top-1/2 w-[86%] max-w-3xl sm:w-[78%] ${
                isCenter ? "z-30" : abs === 1 ? "z-20" : "z-10"
              } ${!visible ? "pointer-events-none" : ""}`}
              initial={false}
              animate={{
                x: `calc(-50% + ${offset * 42}%)`,
                y: "-50%",
                scale: isCenter ? 1 : abs === 1 ? 0.82 : 0.68,
                rotateY: offset * -22,
                opacity: visible ? (isCenter ? 1 : abs === 1 ? 0.55 : 0.2) : 0,
                filter: isCenter ? "blur(0px)" : "blur(1.5px)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              style={{ transformStyle: "preserve-3d" }}
              drag={isCenter ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={handleDragEnd}
              onClick={() => {
                if (!isCenter) goTo(i);
              }}
            >
              <div
                className={`relative aspect-[16/9] overflow-hidden rounded-2xl border sm:aspect-[21/10] ${
                  isCenter
                    ? "border-teal-400/40 shadow-glow"
                    : "border-ink-700 cursor-pointer"
                }`}
              >
                <img
                  src={img(project.image)}
                  alt={`${project.title} banner`}
                  draggable={false}
                  className="pointer-events-none h-full w-full select-none object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/40 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 sm:p-8">
                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-widest backdrop-blur-md ${categoryStyle[project.category] || categoryStyle.software}`}
                  >
                    <RiSparkling2Line size={12} />
                    Featured
                  </span>
                  <h3 className="font-display text-xl font-bold text-paper sm:text-2xl md:text-3xl">
                    {project.title}
                  </h3>
                  <p className="line-clamp-1 max-w-xl text-xs leading-relaxed text-muted sm:text-sm">
                    {project.description}
                  </p>
                  {isCenter && (
                    <Link
                      to={`/projects/${project.id}`}
                      className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-teal-400 to-[#7B61FF] px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-ink-900 transition-shadow duration-300 hover:shadow-glow sm:text-sm"
                    >
                      View Case Study
                      <RiArrowRightLine
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        size={16}
                      />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous project"
            className="absolute left-0 top-1/2 z-40 hidden -translate-y-1/2 items-center justify-center rounded-full bg-ink-900/80 border border-ink-600 h-11 w-11 text-paper/70 backdrop-blur-md transition-all duration-300 hover:border-teal-400/40 hover:text-teal-300 hover:shadow-glow sm:flex md:-left-2 lg:-left-6"
          >
            <RiArrowLeftSLine size={20} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next project"
            className="absolute right-0 top-1/2 z-40 hidden -translate-y-1/2 items-center justify-center rounded-full bg-ink-900/80 border border-ink-600 h-11 w-11 text-paper/70 backdrop-blur-md transition-all duration-300 hover:border-teal-400/40 hover:text-teal-300 hover:shadow-glow sm:flex md:-right-2 lg:-right-6"
          >
            <RiArrowRightSLine size={20} />
          </button>
        </>
      )}

      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2.5">
          {featured.map((project, i) => (
            <button
              key={project.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}: ${project.title}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 bg-gradient-to-r from-teal-400 to-[#7B61FF] shadow-glow"
                  : "w-2 bg-ink-600 hover:bg-ink-500"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
