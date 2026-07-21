import { useEffect, useState } from "react";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";
import { nav } from "../data/portfolio";
import { useContent } from "../context/ContentContext";

export default function Nav() {
  const { content } = useContent();
  const profile = content.profile;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleClick = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-ink-900/85 backdrop-blur-md border-b border-ink-700"
          : "bg-transparent"
      }`}
    >
      <div className="section-pad flex items-center justify-between h-16 lg:h-20">
        <button
          onClick={() => handleClick("home")}
          className="font-display font-semibold text-lg tracking-tight text-paper"
        >
          Arun<span className="text-teal-400">.</span>
        </button>

        <nav className="hidden lg:flex items-center gap-1 font-mono text-xs uppercase tracking-wider">
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                active === item.id
                  ? "text-ink-900 bg-teal-400"
                  : "text-muted hover:text-paper"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <a
          href={`mailto:${profile.email}`}
          className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/50 text-amber-400 font-mono text-xs uppercase tracking-wider hover:bg-amber-500/10 transition-colors"
        >
          Hire Me
        </a>

        <button
          className="lg:hidden text-2xl text-paper"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <RiCloseLine /> : <RiMenuLine />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-ink-900/97 backdrop-blur-md border-t border-ink-700 px-6 py-4 flex flex-col gap-1 max-h-[calc(100dvh-4rem)] overflow-y-auto">
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`text-left px-4 py-3 rounded-lg font-mono text-sm uppercase tracking-wider ${
                active === item.id
                  ? "bg-teal-400/10 text-teal-300"
                  : "text-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className="mt-2 text-center px-4 py-3 rounded-lg border border-amber-500/50 text-amber-400 font-mono text-sm uppercase tracking-wider"
          >
            Hire Me
          </a>
        </div>
      )}
    </header>
  );
}
