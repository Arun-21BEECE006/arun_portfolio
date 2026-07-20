import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiAwardLine,
  RiEyeLine,
  RiDownload2Line,
  RiFileCopyLine,
  RiCheckLine,
  RiCloseLine,
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

function CertificateCard({ cert, index }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCredentialId = async () => {
    try {
      await navigator.clipboard.writeText(cert.credentialId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — ignore silently
    }
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          duration: 0.5,
          delay: (index % 3) * 0.1,
          ease: "easeOut",
        }}
        whileHover={{ y: -5 }}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-600 bg-ink-800/40 hover:border-teal-400/40 transition-colors duration-300"
      >
        <div className="relative aspect-[10/7] overflow-hidden bg-ink-700">
          {cert.image ? (
            <img
              src={img(cert.image)}
              alt={cert.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-muted text-sm">
              No image
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
          <h3 className="font-display text-base md:text-lg font-semibold leading-snug">
            {cert.title}
          </h3>

          {cert.issuer && (
            <p className="flex items-center gap-2 text-sm text-muted">
              <RiAwardLine className="shrink-0 text-teal-400" size={16} />
              <span>
                Issued by{" "}
                <span className="font-medium text-teal-300">{cert.issuer}</span>
              </span>
            </p>
          )}

          {(cert.issueDate || cert.credentialId) && (
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted">
              {cert.issueDate && (
                <span className="rounded-md border border-[#9B87FF]/30 bg-[#7B61FF]/10 px-2 py-1 text-[#C9BFFF]">
                  {cert.issueDate}
                </span>
              )}
              {cert.credentialId && (
                <button
                  type="button"
                  onClick={copyCredentialId}
                  title="Copy credential ID"
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 transition-colors ${
                    copied
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                      : "border-ink-600 bg-ink-900/40 hover:border-teal-400/40 hover:text-teal-300"
                  }`}
                >
                  {copied ? (
                    <RiCheckLine size={12} />
                  ) : (
                    <RiFileCopyLine size={12} />
                  )}
                  <span className="max-w-[10rem] truncate">
                    {copied ? "Copied!" : cert.credentialId}
                  </span>
                </button>
              )}
            </div>
          )}

          {cert.summary && (
            <p className="text-xs md:text-sm text-muted leading-relaxed">
              {cert.summary}
            </p>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-ink-700 pt-4 text-xs font-medium">
            {cert.image && (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3.5 py-1.5 text-teal-300 transition-all hover:bg-teal-400/20"
              >
                <RiEyeLine size={14} />
                View
              </button>
            )}
            {cert.image && (
              <a
                href={img(cert.image)}
                download
                className="inline-flex items-center gap-1.5 rounded-full border border-[#9B87FF]/30 bg-[#7B61FF]/10 px-3.5 py-1.5 text-[#C9BFFF] transition-all hover:bg-[#7B61FF]/20"
              >
                <RiDownload2Line size={14} />
                Download
              </a>
            )}
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            src={img(cert.image)}
            alt={cert.title}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function Certifications() {
  const { content } = useContent();
  const certifications = content.certifications || [];

  return (
    <section id="certifications" className="section-pad py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="eyebrow mb-3 inline-block">Certifications</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Credentials & Learning
          </h2>
          <p className="text-muted mt-4">
            Verified certifications that back a habit of continuous, hands-on
            learning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {certifications.map((cert, index) => (
            <CertificateCard key={cert.id} cert={cert} index={index} />
          ))}
        </div>

        {certifications.length === 0 && (
          <p className="text-sm text-muted text-center">
            No certifications added yet.
          </p>
        )}
      </div>
    </section>
  );
}
