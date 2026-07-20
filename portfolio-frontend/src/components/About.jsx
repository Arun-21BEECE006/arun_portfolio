import { motion } from "framer-motion";
import { img } from "../utils/images";
import { useContent } from "../context/ContentContext";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function About() {
  const { content } = useContent();
  const profile = content.profile;
  return (
    <section id="about" className="section-pad py-24 lg:py-32">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.85fr,1.15fr] gap-14 items-start">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={reveal}
          className="relative"
        >
          <div className="relative aspect-[4/5] max-h-[480px] rounded-2xl overflow-hidden border border-ink-600 bg-ink-800">
            <img
              src={img(profile.avatar || "avatar-9.png")}
              alt={profile.name}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {profile.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-ink-600 bg-ink-800/60 px-4 py-3"
              >
                <p className="font-display text-2xl font-semibold text-teal-300">
                  {s.value}
                </p>
                <p className="text-xs text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={reveal}
        >
          <p className="eyebrow mb-3">About</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
            Signal in, systems out.
          </h2>
          <div className="space-y-4 text-muted leading-relaxed text-[15px] sm:text-base">
            {profile.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <a
            href={img(profile.resumeFile)}
            download
            className="inline-flex items-center gap-2 mt-8 px-5 py-3 rounded-full bg-amber-500 text-ink-900 font-semibold text-sm hover:bg-amber-400 transition-colors"
          >
            Download Resume
          </a>
        </motion.div>
      </div>
    </section>
  );
}
