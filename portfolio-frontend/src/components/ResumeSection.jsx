import { motion } from "framer-motion";
import {
  RiDownload2Line,
  RiPrinterLine,
  RiExternalLinkLine,
  RiCalendarLine,
} from "react-icons/ri";
import { useContent } from "../context/ContentContext";
import { img } from "../utils/images";
import PdfViewer from "./PdfViewer";

function useLiveCounters(content) {
  const technologies = new Set();
  (content.skillOrbs || []).forEach((orb) =>
    orb.skills?.forEach((s) => technologies.add(s)),
  );
  const profile = content.profile || {};

  return [
    {
      label: "Projects",
      value: profile.projectsCountOverride || (content.projects || []).length,
    },
    {
      label: "Technologies",
      value: profile.technologiesCountOverride || technologies.size,
    },
    {
      label: "Certifications",
      value:
        profile.certificationsCountOverride ||
        (content.certifications || []).length,
    },
    ...(profile.experienceYears
      ? [{ label: "Years Experience", value: profile.experienceYears }]
      : []),
  ];
}

export default function ResumeSection() {
  const { content } = useContent();
  const resume = content.resume || {};
  const resumeUrl = img(resume.file);
  const counters = useLiveCounters(content);

  const openAndPrint = () => {
    const win = window.open(resumeUrl, "_blank");
    try {
      win?.addEventListener("load", () => win.print());
    } catch {
      // Cross-origin PDFs can't be scripted from here — the browser's own
      // PDF viewer still offers a print button once it opens.
    }
  };

  if (!resumeUrl) return null;

  return (
    <section
      id="resume"
      className="section-pad py-24 lg:py-32 bg-ink-950/50 border-y border-ink-700"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="eyebrow mb-3 inline-block">Resume</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            One page, everything that matters.
          </h2>
        </div>

        {counters.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {counters.map((c) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                className="rounded-xl border border-ink-600 bg-ink-800/40 px-4 py-3 text-center"
              >
                <p className="font-display text-2xl font-semibold text-teal-300">
                  {c.value}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-muted mt-1">
                  {c.label}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        <div className="rounded-2xl border border-ink-600 bg-ink-800/40 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-ink-700">
            {resume.lastUpdated && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-ink-600 text-xs text-muted">
                <RiCalendarLine /> Last updated {resume.lastUpdated}
              </span>
            )}
            <div className="flex flex-wrap items-center gap-2 ml-auto">
              <a
                href={resumeUrl}
                download
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-teal-400 text-ink-900 text-sm font-semibold hover:bg-teal-300 transition-colors whitespace-nowrap"
              >
                <RiDownload2Line size={15} /> Download
              </a>
              <button
                onClick={openAndPrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-ink-600 text-sm hover:border-amber-500 hover:text-amber-400 transition-colors whitespace-nowrap"
              >
                <RiPrinterLine size={15} /> Print
              </button>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                title="Open in new tab"
                aria-label="Open resume in new tab"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-ink-600 text-sm hover:border-teal-400 hover:text-teal-300 transition-colors whitespace-nowrap"
              >
                <RiExternalLinkLine size={15} /> Open
              </a>
            </div>
          </div>

          {/* Laptop/desktop: the browser's native PDF viewer works fine and
              is simpler, so just use it directly with fit-width sizing. */}
          <div className="hidden lg:block bg-ink-950 aspect-[8.5/5]">
            <iframe
              src={`${resumeUrl}#view=FitH`}
              title="Resume"
              className="w-full h-full"
            />
          </div>

          {/* Mobile & tablet: many mobile browsers (notably Android Chrome)
              show a generic "tap to open" card instead of actually
              previewing an embedded PDF, so we render it ourselves with
              PDF.js there instead — same box size, consistent look. */}
          <div className="lg:hidden bg-ink-950 aspect-[8.5/5]">
            <PdfViewer url={resumeUrl} className="w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
