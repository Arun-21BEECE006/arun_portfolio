import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiMapPinLine,
  RiCalendarLine,
  RiBuilding2Line,
  RiVerifiedBadgeLine,
  RiSlideshowLine,
  RiFileTextLine,
  RiCloseLine,
  RiZoomInLine,
} from "react-icons/ri";
import { useContent } from "../context/ContentContext";
import { img } from "../utils/images";

function Lightbox({ src, alt, onClose }) {
  if (!src) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] bg-ink-950/95 flex items-center justify-center p-4"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 w-10 h-10 grid place-items-center rounded-full bg-ink-800 border border-ink-600 hover:text-amber-400"
      >
        <RiCloseLine size={20} />
      </button>
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[92vw] object-contain rounded-xl"
      />
    </motion.div>
  );
}

function ConferenceCard({ conf, index }) {
  const [lightbox, setLightbox] = useState(null);
  const reversed = index % 2 === 1;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className={`grid grid-cols-1 lg:grid-cols-2 items-stretch overflow-hidden rounded-3xl border border-ink-600 bg-ink-800/40 hover:border-ink-500 transition-colors duration-300`}
      >
        <div
          className={`relative min-h-[220px] lg:min-h-[340px] overflow-hidden bg-ink-700 ${
            reversed ? "lg:order-2" : ""
          }`}
        >
          {conf.image ? (
            <button
              type="button"
              onClick={() =>
                setLightbox({ src: img(conf.image), alt: conf.title })
              }
              className="group/img block h-full w-full cursor-zoom-in"
              aria-label={`View photo of ${conf.title}`}
            >
              <img
                src={img(conf.image)}
                alt={conf.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover/img:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent lg:bg-gradient-to-r" />
              <span className="absolute bottom-3 right-3 w-8 h-8 grid place-items-center rounded-full bg-ink-900/70 border border-ink-600 text-paper/70 opacity-0 group-hover/img:opacity-100 transition-opacity">
                <RiZoomInLine size={14} />
              </span>
            </button>
          ) : (
            <div className="h-full w-full grid place-items-center text-muted text-sm">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center gap-3 p-6 md:p-8 lg:p-10">
          {conf.organizer && (
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#B7A9FF]">
              {conf.organizer}
            </span>
          )}

          <h3 className="font-display text-xl md:text-2xl font-bold leading-snug">
            {conf.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs md:text-sm text-muted">
            {conf.location && (
              <span className="inline-flex items-center gap-1.5">
                <RiMapPinLine className="text-teal-400" size={15} />
                {conf.location}
              </span>
            )}
            {conf.date && (
              <span className="inline-flex items-center gap-1.5">
                <RiCalendarLine className="text-[#B7A9FF]" size={15} />
                {conf.date}
              </span>
            )}
            {conf.event && (
              <span className="inline-flex items-center gap-1.5">
                <RiBuilding2Line className="text-emerald-400" size={15} />
                {conf.event}
              </span>
            )}
          </div>

          {conf.description && (
            <p className="text-sm md:text-base leading-relaxed text-muted">
              {conf.description}
            </p>
          )}

          {(conf.link || conf.slidesUrl || conf.paperUrl) && (
            <div className="flex flex-wrap gap-2.5 pt-1 text-xs font-medium">
              {conf.link && (
                <a
                  href={conf.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-teal-300 transition-all hover:bg-teal-400/20"
                >
                  <RiVerifiedBadgeLine size={14} />
                  Certificate
                </a>
              )}
              {conf.slidesUrl && (
                <a
                  href={conf.slidesUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#9B87FF]/30 bg-[#7B61FF]/10 px-4 py-2 text-[#C9BFFF] transition-all hover:bg-[#7B61FF]/20"
                >
                  <RiSlideshowLine size={14} />
                  Slides
                </a>
              )}
              {conf.paperUrl && (
                <a
                  href={conf.paperUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-emerald-300 transition-all hover:bg-emerald-400/20"
                >
                  <RiFileTextLine size={14} />
                  Research Paper
                </a>
              )}
            </div>
          )}

          {conf.gallery?.length > 1 && (
            <div className="flex flex-wrap gap-3 border-t border-ink-700 pt-4">
              {conf.gallery.map((g, gi) => (
                <button
                  key={gi}
                  type="button"
                  onClick={() =>
                    setLightbox({
                      src: img(g),
                      alt: `${conf.title} photo ${gi + 1}`,
                    })
                  }
                  className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-ink-600 hover:border-teal-400/50 transition-colors"
                >
                  <img
                    src={img(g)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.article>

      <AnimatePresence>
        {lightbox && (
          <Lightbox
            src={lightbox.src}
            alt={lightbox.alt}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function Conferences() {
  const { content } = useContent();
  const conferences = content.conferences || [];

  if (conferences.length === 0) return null;

  return (
    <section id="conferences" className="section-pad py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="eyebrow mb-3 inline-block">Conferences</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Talks & Research
          </h2>
          <p className="text-muted mt-4">
            Stages shared, papers presented, and rooms full of people who love
            hard problems.
          </p>
        </div>

        <div className="flex flex-col gap-8 md:gap-10">
          {conferences.map((conf, index) => (
            <ConferenceCard key={conf.id} conf={conf} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
