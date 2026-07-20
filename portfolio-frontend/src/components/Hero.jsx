import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  RiGithubLine,
  RiLinkedinBoxLine,
  RiDownload2Line,
  RiArrowDownLine,
} from "react-icons/ri";
import { img } from "../utils/images";
import { useContent } from "../context/ContentContext";
import SignalSignature from "./SignalSignature";
import AISphere from "./AISphere";

function useTypedRoles(roles, speed = 55, pause = 1400) {
  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex % roles.length];
    let timeout;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      setDeleting(false);
      setRoleIndex((i) => i + 1);
    } else {
      timeout = setTimeout(
        () => {
          setText((t) =>
            deleting
              ? current.slice(0, t.length - 1)
              : current.slice(0, t.length + 1),
          );
        },
        deleting ? speed / 2 : speed,
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex, roles, speed, pause]);

  return text;
}

export default function Hero() {
  const { content } = useContent();
  const profile = content.profile;
  const typed = useTypedRoles(profile.roles);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-28 pb-16 section-pad bg-grid-pattern bg-grid"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-900/40 to-ink-900 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto w-full grid lg:grid-cols-[1.2fr,0.8fr] gap-12 items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow mb-4"
          >
            {profile.location}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight"
          >
            {profile.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 h-9 font-mono text-lg sm:text-xl text-teal-300"
          >
            <span>{typed}</span>
            <span className="inline-block w-[2px] h-5 bg-amber-400 ml-1 align-middle animate-pulse" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 max-w-xl text-muted text-base sm:text-lg leading-relaxed"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-5 py-3 rounded-full bg-teal-400 text-ink-900 font-semibold text-sm hover:bg-teal-300 transition-colors shadow-glow"
            >
              Let's talk
            </a>
            <a
              href={img(profile.resumeFile)}
              download
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-ink-600 text-paper text-sm hover:border-amber-500 hover:text-amber-400 transition-colors"
            >
              <RiDownload2Line /> Resume
            </a>
            <div className="flex items-center gap-1 ml-1">
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 grid place-items-center rounded-full border border-ink-600 text-muted hover:text-paper hover:border-ink-500 transition-colors"
                aria-label="GitHub"
              >
                <RiGithubLine size={18} />
              </a>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 grid place-items-center rounded-full border border-ink-600 text-muted hover:text-paper hover:border-ink-500 transition-colors"
                aria-label="LinkedIn"
              >
                <RiLinkedinBoxLine size={18} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-10 hidden sm:block"
          >
            <SignalSignature className="w-full max-w-lg h-16" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-teal-400/20 to-amber-500/10 blur-2xl" />

          <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto rounded-[2rem] border border-ink-600 bg-ink-800 overflow-hidden">
            <AISphere className="w-full h-full" />
          </div>

          <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl border border-ink-600 bg-ink-800/60 px-5 py-3 shadow-glow-amber w-fit mx-auto">
            <span className="font-mono text-2xl font-semibold text-amber-400">
              4
            </span>
            <span className="text-[11px] uppercase tracking-wider text-muted leading-tight text-left">
              Full-Stack
              <br />+ AI Builds
            </span>
          </div>

          <p className="mt-5 text-center text-[11px] font-mono text-muted uppercase tracking-wider">
            Move your cursor / finger over the sphere
          </p>
        </motion.div>
      </div>

      <button
        onClick={() =>
          document
            .getElementById("about")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted hover:text-teal-400 transition-colors animate-bounce"
        aria-label="Scroll to About"
      >
        <RiArrowDownLine size={22} />
      </button>
    </section>
  );
}
