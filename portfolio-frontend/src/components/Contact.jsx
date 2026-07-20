import { useState } from "react";
import { motion } from "framer-motion";
import { RiMailLine, RiGithubLine, RiLinkedinBoxLine, RiTwitterFill, RiFacebookBoxFill, RiCheckLine, RiErrorWarningLine } from "react-icons/ri";
import { useContent } from "../context/ContentContext";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function Contact() {
  const { content } = useContent();
  const profile = content.profile;
  const socialIcons = [
    { key: "github", icon: RiGithubLine, href: profile.socials.github },
    { key: "linkedin", icon: RiLinkedinBoxLine, href: profile.socials.linkedin },
    { key: "twitter", icon: RiTwitterFill, href: profile.socials.twitter },
    { key: "facebook", icon: RiFacebookBoxFill, href: profile.socials.facebook },
  ];
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(`${API_BASE}/api/sendEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("send failed");

      fetch(`${API_BASE}/api/thankYouMail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).catch(() => {});

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section-pad py-24 lg:py-32">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.8fr,1.2fr] gap-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow mb-3">Contact</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-5">
            Let's build something.
          </h2>
          <p className="text-muted leading-relaxed mb-8">
            Open to Software Engineer and AI/ML Engineer roles, internships, and
            interesting collaborations. Drop a message and I'll get back to you.
          </p>

          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-3 text-paper hover:text-teal-300 transition-colors mb-8"
          >
            <span className="w-10 h-10 grid place-items-center rounded-full border border-ink-600">
              <RiMailLine />
            </span>
            <span className="font-mono text-sm">{profile.email}</span>
          </a>

          <div className="flex gap-3">
            {socialIcons.map(({ key, icon: Icon, href }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={key}
                className="w-11 h-11 grid place-items-center rounded-full border border-ink-600 text-muted hover:text-paper hover:border-ink-500 transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-ink-600 bg-ink-800/40 p-6 sm:p-8"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              value={form.name}
              onChange={update("name")}
              type="text"
              placeholder="Your name"
              className="bg-ink-900 border border-ink-600 rounded-xl px-4 py-3 text-sm focus:border-teal-400 outline-none transition-colors"
            />
            <input
              value={form.email}
              onChange={update("email")}
              type="email"
              placeholder="Your email"
              className="bg-ink-900 border border-ink-600 rounded-xl px-4 py-3 text-sm focus:border-teal-400 outline-none transition-colors"
            />
          </div>
          <input
            value={form.subject}
            onChange={update("subject")}
            type="text"
            placeholder="Subject"
            className="mt-4 w-full bg-ink-900 border border-ink-600 rounded-xl px-4 py-3 text-sm focus:border-teal-400 outline-none transition-colors"
          />
          <textarea
            value={form.message}
            onChange={update("message")}
            rows={5}
            placeholder="Your message"
            className="mt-4 w-full bg-ink-900 border border-ink-600 rounded-xl px-4 py-3 text-sm focus:border-teal-400 outline-none transition-colors resize-none"
          />

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-5 w-full sm:w-auto px-6 py-3 rounded-full bg-teal-400 text-ink-900 font-semibold text-sm hover:bg-teal-300 disabled:opacity-60 transition-colors"
          >
            {status === "sending" ? "Sending…" : "Send Message"}
          </button>

          {status === "success" && (
            <p className="mt-4 flex items-center gap-2 text-sm text-teal-300">
              <RiCheckLine /> Message sent — thank you! I'll reply soon.
            </p>
          )}
          {status === "error" && (
            <p className="mt-4 flex items-center gap-2 text-sm text-amber-400">
              <RiErrorWarningLine /> Please fill every field, or try again in a moment.
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
