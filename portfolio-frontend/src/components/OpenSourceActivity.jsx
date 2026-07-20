import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  RiGithubLine,
  RiStarLine,
  RiGitRepositoryLine,
  RiUserFollowLine,
  RiExternalLinkLine,
} from "react-icons/ri";
import { useContent } from "../context/ContentContext";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Real intensity levels, computed from actual contribution counts — not a
// fixed/fake scale. GitHub itself buckets into ~4-5 levels; we do the same.
function levelFor(count, max) {
  if (count === 0) return 0;
  if (max <= 4)
    return count >= max ? 4 : Math.max(1, Math.ceil((count / max) * 4));
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

const LEVEL_CLASSES = [
  "bg-ink-700",
  "bg-teal-900/70",
  "bg-teal-600/70",
  "bg-teal-400/80",
  "bg-teal-300",
];

function ContributionGraph({ contributions }) {
  if (!contributions?.weeks?.length) return null;

  const allDays = contributions.weeks.flat();
  const max = Math.max(...allDays.map((d) => d.count), 1);

  const monthLabels = [];
  let lastMonth = null;
  contributions.weeks.forEach((week, wi) => {
    const firstDay = week[0];
    if (!firstDay) return;
    const month = new Date(firstDay.date).getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ index: wi, label: MONTH_NAMES[month] });
      lastMonth = month;
    }
  });

  return (
    <div className="mb-10 rounded-2xl border border-ink-600 bg-ink-800/40 p-5 sm:p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-3 min-w-max">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          Contribution Graph — {contributions.total.toLocaleString()}{" "}
          contributions in the last year
        </p>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted">
          <span>Less</span>
          {LEVEL_CLASSES.map((c, i) => (
            <span key={i} className={`w-2.5 h-2.5 rounded-sm ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="min-w-max">
        <div
          className="relative h-4 mb-1"
          style={{ width: contributions.weeks.length * 13 }}
        >
          {monthLabels.map((m) => (
            <span
              key={m.index}
              className="absolute text-[10px] text-muted"
              style={{ left: m.index * 13 }}
            >
              {m.label}
            </span>
          ))}
        </div>
        <div
          className="grid grid-flow-col gap-[3px]"
          style={{ gridTemplateRows: "repeat(7, 10px)" }}
        >
          {contributions.weeks.map((week, wi) =>
            week.map((day, di) => (
              <span
                key={`${wi}-${di}`}
                title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
                className={`w-[10px] h-[10px] rounded-[2px] ${LEVEL_CLASSES[levelFor(day.count, max)]}`}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
}

export default function OpenSourceActivity() {
  const { content } = useContent();
  const username = content.profile?.socials?.github
    ?.split("/")
    .filter(Boolean)
    .pop();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!username) return;
    fetch(
      `${API_BASE}/api/github-stats?username=${encodeURIComponent(username)}`,
    )
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setStats)
      .catch(() => setError(true));
  }, [username]);

  // Fails quietly rather than showing a broken section — GitHub's public API
  // rate-limits are real and this is genuinely live data, not a static claim.
  if (error || !username) return null;

  return (
    <section
      id="open-source"
      className="section-pad py-24 lg:py-32 bg-ink-950/50 border-y border-ink-700"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <div className="max-w-xl">
            <p className="eyebrow mb-3">Open Source Activity</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              Live from GitHub.
            </h2>
          </div>
          <a
            href={stats?.profileUrl || content.profile.socials.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ink-600 text-sm hover:border-teal-400/40 hover:text-teal-300 transition-colors"
          >
            <RiGithubLine /> @{username}
          </a>
        </div>

        {!stats ? (
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-24 rounded-2xl border border-ink-700 bg-ink-800/30 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <ContributionGraph contributions={stats.contributions} />

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl border border-ink-600 bg-ink-800/40 p-5 text-center">
                <RiGitRepositoryLine
                  className="mx-auto mb-2 text-teal-300"
                  size={20}
                />
                <p className="font-display text-2xl font-semibold">
                  {stats.repositories}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-muted mt-1">
                  Repositories
                </p>
              </div>
              <div className="rounded-2xl border border-ink-600 bg-ink-800/40 p-5 text-center">
                <RiStarLine className="mx-auto mb-2 text-amber-400" size={20} />
                <p className="font-display text-2xl font-semibold">
                  {stats.stars}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-muted mt-1">
                  Stars Earned
                </p>
              </div>
              <div className="rounded-2xl border border-ink-600 bg-ink-800/40 p-5 text-center">
                <RiUserFollowLine
                  className="mx-auto mb-2 text-teal-300"
                  size={20}
                />
                <p className="font-display text-2xl font-semibold">
                  {stats.followers}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-muted mt-1">
                  Followers
                </p>
              </div>
            </div>

            {stats.languages?.length > 0 && (
              <div className="mb-8">
                <p className="font-mono text-xs uppercase tracking-wider text-muted mb-3">
                  Language mix (by repo count)
                </p>
                <div className="flex h-3 rounded-full overflow-hidden border border-ink-700">
                  {stats.languages.map((l, i) => (
                    <div
                      key={l.name}
                      style={{ width: `${l.percent}%` }}
                      className={i % 2 === 0 ? "bg-teal-400" : "bg-amber-500"}
                      title={`${l.name} — ${l.percent}%`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  {stats.languages.map((l) => (
                    <span key={l.name} className="text-xs text-muted">
                      {l.name}{" "}
                      <span className="text-paper/70">{l.percent}%</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {stats.topRepos?.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.topRepos.map((r) => (
                  <motion.a
                    key={r.name}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="rounded-xl border border-ink-600 bg-ink-800/30 p-4 hover:border-ink-500 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-mono text-sm text-teal-300 truncate">
                        {r.name}
                      </p>
                      <RiExternalLinkLine
                        className="text-muted shrink-0"
                        size={14}
                      />
                    </div>
                    {r.description && (
                      <p className="text-xs text-muted mt-1.5 line-clamp-3">
                        {r.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-[11px] text-muted">
                      {r.language && <span>{r.language}</span>}
                      <span className="inline-flex items-center gap-1">
                        <RiStarLine size={12} /> {r.stars}
                      </span>
                    </div>
                  </motion.a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
