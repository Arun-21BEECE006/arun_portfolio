import { profile } from "../data/portfolio";

export default function Footer() {
  return (
    <footer className="section-pad py-8 border-t border-ink-700">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted font-mono">
        <p>© {new Date().getFullYear()} {profile.name}. Built with React & a lot of coffee.</p>
        <p>Designed &amp; engineered end-to-end.</p>
      </div>
    </footer>
  );
}
