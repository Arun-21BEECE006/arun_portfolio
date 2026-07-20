import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RiGithubLine, RiArrowRightLine } from "react-icons/ri";
import { useContent } from "../context/ContentContext";
import { img } from "../utils/images";
import ProjectCarousel from "./ProjectCarousel";

const filters = [
  { id: "all", label: "All" },
  { id: "aiml", label: "AI / ML" },
  { id: "fullstack", label: "Full Stack" },
  { id: "software", label: "Software" },
  { id: "embedded", label: "Embedded" },
];

const statusStyle = {
  Live: "bg-white text-teal-600 border-teal-300",
  Ongoing: "bg-white text-amber-600 border-amber-300",
  Complete: "bg-white text-[#6D4FE0] border-[#9B87FF]",
};

export default function Projects() {
  const { content } = useContent();
  const projects = content.projects;
  const [filter, setFilter] = useState("all");
  const visible =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section-pad py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">
        <ProjectCarousel projects={projects} />

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <p className="eyebrow mb-3">Projects</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              Things I've shipped.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider border transition-colors ${
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => {
              const visibleTags = p.tags.slice(0, 4);
              const extraTagCount = p.tags.length - visibleTags.length;
              const visibleTech = p.techStack?.slice(0, 4) || [];
              const extraTechCount =
                (p.techStack?.length || 0) - visibleTech.length;

              return (
                <motion.article
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="group rounded-2xl border border-ink-600 bg-ink-800/40 overflow-hidden flex flex-col hover:border-ink-500 hover:-translate-y-1 transition-all duration-300"
                >
                  <Link to={`/projects/${p.id}`} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-ink-800">
                      <img
                        src={img(p.image)}
                        alt={p.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/10 to-transparent" />

                      <span
                        className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border backdrop-blur-md ${
                          statusStyle[p.status] || statusStyle.Live
                        }`}
                      >
                        {p.status}
                      </span>

                      <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-1.5 p-3">
                        {visibleTags.map((t) => (
                          <span
                            key={t}
                            className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-ink-900/80 border border-ink-600 text-paper/80 backdrop-blur-md"
                          >
                            {t}
                          </span>
                        ))}
                        {extraTagCount > 0 && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#7B61FF]/20 border border-[#9B87FF]/40 text-[#C9BFFF]">
                            +{extraTagCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <Link to={`/projects/${p.id}`}>
                      <h3 className="font-display font-semibold text-lg text-teal-300 hover:text-teal-200 transition-colors mb-2">
                        {p.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">
                      {p.description}
                    </p>

                    {visibleTech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {visibleTech.map((t) => (
                          <span
                            key={t}
                            className="px-2.5 py-1 rounded-full text-[11px] border border-ink-600 bg-ink-900/50 text-paper/80"
                          >
                            {t}
                          </span>
                        ))}
                        {extraTechCount > 0 && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] border border-[#9B87FF]/40 bg-[#7B61FF]/15 text-[#C9BFFF]">
                            +{extraTechCount}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-ink-700">
                      <Link
                        to={`/projects/${p.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-teal-400 text-ink-900 text-xs font-semibold uppercase tracking-wider hover:bg-teal-300 transition-colors"
                      >
                        Case Study <RiArrowRightLine size={14} />
                      </Link>
                      {p.links?.repo && (
                        <a
                          href={p.links.repo}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${p.title} repository`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-9 h-9 grid place-items-center rounded-full border border-ink-600 text-muted hover:text-paper hover:border-ink-500 transition-colors"
                        >
                          <RiGithubLine size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
