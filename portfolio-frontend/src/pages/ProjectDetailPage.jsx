import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiArrowLeftLine,
  RiGithubLine,
  RiExternalLinkLine,
  RiFileTextLine,
  RiVideoLine,
  RiFileChartLine,
  RiCloseLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import { useContent } from "../context/ContentContext";
import { img } from "../utils/images";
import Footer from "../components/Footer";
import LoadingScreen from "../components/LoadingScreen";

const categoryStyle = {
  aiml: "bg-teal-400 text-ink-900 border-teal-300",
  fullstack: "bg-[#7B61FF] text-white border-[#9B87FF]",
  software: "bg-amber-500 text-ink-900 border-amber-400",
  embedded: "bg-rose-500 text-white border-rose-400",
};

const categoryLabel = {
  aiml: "AI / ML",
  fullstack: "Full Stack",
  software: "Software",
  embedded: "Embedded",
};

const LINK_META = {
  demo: { label: "Live Demo", icon: RiExternalLinkLine },
  repo: { label: "Repository", icon: RiGithubLine },
  docs: { label: "Documentation", icon: RiFileTextLine },
  video: { label: "Demo Video", icon: RiVideoLine },
  paper: { label: "Research Paper", icon: RiFileChartLine },
};

function GalleryLightbox({ images, index, onClose, onNav }) {
  if (index == null) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-ink-950/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute top-5 right-5 w-10 h-10 grid place-items-center rounded-full bg-ink-800 border border-ink-600 hover:text-amber-400"
      >
        <RiCloseLine size={20} />
      </button>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNav(-1);
            }}
            aria-label="Previous image"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center rounded-full bg-ink-800/80 border border-ink-600 hover:border-teal-400/50"
          >
            <RiArrowLeftSLine size={22} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNav(1);
            }}
            aria-label="Next image"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center rounded-full bg-ink-800/80 border border-ink-600 hover:border-teal-400/50"
          >
            <RiArrowRightSLine size={22} />
          </button>
        </>
      )}
      <img
        src={img(images[index])}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[92vw] object-contain rounded-xl"
      />
      <p className="absolute bottom-6 text-xs font-mono text-muted">
        {index + 1} / {images.length}
      </p>
    </motion.div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { content, loading } = useContent();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const project = (content.projects || []).find((p) => p.id === id);

  if (loading) return <LoadingScreen />;

  if (!project) {
    return (
      <div className="min-h-screen grid place-items-center section-pad text-center">
        <div>
          <p className="eyebrow mb-3">Not Found</p>
          <h1 className="font-display text-3xl font-semibold mb-4">
            Project not found.
          </h1>
          <Link
            to="/"
            className="text-teal-300 hover:text-teal-200 inline-flex items-center gap-2"
          >
            <RiArrowLeftLine /> Back to portfolio
          </Link>
        </div>
      </div>
    );
  }

  const gallery = project.gallery?.length
    ? project.gallery
    : project.image
      ? [project.image]
      : [];
  const linkEntries = Object.entries(project.links || {}).filter(
    ([, url]) => url,
  );

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-ink-900/90 backdrop-blur-md border-b border-ink-700">
        <div className="section-pad h-16 flex items-center">
          <Link
            to="/"
            onClick={() =>
              setTimeout(
                () => document.getElementById("projects")?.scrollIntoView(),
                50,
              )
            }
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-teal-300 transition-colors"
          >
            <RiArrowLeftLine /> Back to portfolio
          </Link>
        </div>
      </header>

      <div className="section-pad max-w-4xl mx-auto pt-8">
        <div className="aspect-[16/9] sm:aspect-[21/9] max-h-[180px] sm:max-h-[240px] md:max-h-[300px] w-full overflow-hidden rounded-2xl border border-ink-600 bg-ink-800">
          <img
            src={img(project.image)}
            alt={project.title}
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      <div className="section-pad max-w-4xl mx-auto py-12">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${categoryStyle[project.category]}`}
          >
            {categoryLabel[project.category]}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-ink-800 text-muted border border-ink-600">
            {project.status}
          </span>
          {project.duration && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-ink-800 text-muted border border-ink-600">
              {project.duration}
            </span>
          )}
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight">
          {project.title}
        </h1>
        {project.subtitle && (
          <p className="text-teal-300 mt-2">{project.subtitle}</p>
        )}

        <p className="text-muted leading-relaxed mt-6 text-base sm:text-lg max-w-3xl">
          {project.longDescription || project.description}
        </p>

        <div className="flex flex-wrap gap-3 mt-8">
          {linkEntries.map(([type, url]) => {
            const meta = LINK_META[type] || {
              label: type,
              icon: RiExternalLinkLine,
            };
            const Icon = meta.icon;
            const primary = type === "demo";
            return (
              <a
                key={type}
                href={url}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-colors ${
                  primary
                    ? "bg-teal-400 text-ink-900 hover:bg-teal-300"
                    : "border border-ink-600 text-paper hover:border-amber-500 hover:text-amber-400"
                }`}
              >
                <Icon /> {meta.label}
              </a>
            );
          })}
        </div>

        {project.metrics?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-10">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-ink-600 bg-ink-800/40 px-4 py-4 text-center"
              >
                <p className="font-display text-2xl font-semibold text-teal-300">
                  {m.value}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted mt-1">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {gallery.length > 0 && (
          <section className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-wider text-amber-400 mb-4">
              Gallery
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="aspect-[4/3] rounded-xl overflow-hidden border border-ink-600 hover:border-teal-400/50 transition-colors"
                >
                  <img
                    src={img(g)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {project.highlights?.length > 0 && (
          <section className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-wider text-amber-400 mb-4">
              Key Features
            </h2>
            <ul className="space-y-2.5">
              {project.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-sm sm:text-base text-paper/90"
                >
                  <span className="text-teal-400 mt-1">▸</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.challenges?.length > 0 && (
          <section className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-wider text-amber-400 mb-4">
              Challenges
            </h2>
            <ul className="space-y-2.5">
              {project.challenges.map((c, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-sm sm:text-base text-paper/90"
                >
                  <span className="text-rose-400 mt-1">▸</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(project.architecture || project.architectureDiagram) && (
          <section className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-wider text-amber-400 mb-4">
              Architecture
            </h2>
            {project.architectureDiagram && (
              <div className="rounded-2xl border border-ink-600 bg-ink-800/40 p-3 sm:p-4 mb-4">
                <img
                  src={img(project.architectureDiagram)}
                  alt={`${project.title} architecture diagram`}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
            {project.architecture && (
              <p className="text-sm sm:text-base text-muted leading-relaxed whitespace-pre-line">
                {project.architecture}
              </p>
            )}
          </section>
        )}

        {project.timeline?.length > 0 && (
          <section className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-wider text-amber-400 mb-4">
              Development Timeline
            </h2>
            <ul className="space-y-3 border-l border-ink-600 pl-5">
              {project.timeline.map((t, i) => (
                <li key={i} className="text-sm sm:text-base">
                  <span className="text-teal-300 font-mono text-xs sm:text-sm">
                    {t.date}
                  </span>
                  <span className="text-paper/90"> — {t.milestone}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.futureImprovements?.length > 0 && (
          <section className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-wider text-amber-400 mb-4">
              Future Improvements
            </h2>
            <ul className="space-y-2.5">
              {project.futureImprovements.map((f, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-sm sm:text-base text-paper/90"
                >
                  <span className="text-amber-400 mt-1">▸</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.techStack?.length > 0 && (
          <section className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-wider text-amber-400 mb-4">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full text-sm border border-ink-600 bg-ink-800/60 text-paper/90"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        <div className="mt-16 pt-8 border-t border-ink-700">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-teal-300 transition-colors"
          >
            <RiArrowLeftLine /> Back to all projects
          </Link>
        </div>
      </div>

      <Footer />

      <AnimatePresence>
        {lightboxIndex != null && (
          <GalleryLightbox
            images={gallery}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNav={(dir) =>
              setLightboxIndex(
                (i) => (i + dir + gallery.length) % gallery.length,
              )
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}
