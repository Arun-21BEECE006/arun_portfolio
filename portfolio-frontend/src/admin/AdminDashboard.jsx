import { useState } from "react";
import {
  RiUser3Line,
  RiFolderLine,
  RiToolsLine,
  RiBriefcaseLine,
  RiVerifiedBadgeLine,
  RiTrophyLine,
  RiMicLine,
  RiFilePdf2Line,
  RiImageLine,
  RiLogoutBoxLine,
  RiExternalLinkLine,
} from "react-icons/ri";
import { useContent } from "../context/ContentContext";
import { clearToken } from "../lib/api";
import { collectionSchemas } from "./schemas";
import CollectionEditor from "./CollectionEditor";
import ProfileEditor from "./ProfileEditor";
import ResumeEditor from "./ResumeEditor";
import MediaLibrary from "./MediaLibrary";

const TABS = [
  { id: "profile", label: "Profile", icon: RiUser3Line },
  { id: "projects", label: "Projects", icon: RiFolderLine },
  { id: "skillOrbs", label: "Skills", icon: RiToolsLine },
  { id: "experience", label: "Experience", icon: RiBriefcaseLine },
  { id: "certifications", label: "Certifications", icon: RiVerifiedBadgeLine },
  { id: "conferences", label: "Conferences", icon: RiMicLine },
  { id: "achievements", label: "Trophy Cabinet", icon: RiTrophyLine },
  { id: "resume", label: "Resume", icon: RiFilePdf2Line },
  { id: "media", label: "Media Library", icon: RiImageLine },
];

export default function AdminDashboard({ onLogout }) {
  const { content, refresh, usingFallback } = useContent();
  const [tab, setTab] = useState("profile");

  const logout = () => {
    clearToken();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-ink-900">
      <header className="border-b border-ink-700 bg-ink-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-display font-semibold">Admin Dashboard</p>
            <p className="text-xs text-muted font-mono">
              Arun Kumar — Portfolio Content
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-teal-300 transition-colors"
            >
              <RiExternalLinkLine size={14} /> View site
            </a>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-ink-600 text-xs text-muted hover:text-rose-400 hover:border-rose-400/40 transition-colors"
            >
              <RiLogoutBoxLine size={14} /> Log out
            </button>
          </div>
        </div>
      </header>

      {usingFallback && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-400 text-xs text-center py-2 px-4">
          Could not reach the backend at VITE_BACKEND_URL — showing bundled
          fallback data. Changes here won't save until the backend is reachable.
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col md:flex-row gap-6 md:gap-8">
        <nav className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar md:overflow-visible md:w-56 shrink-0 -mx-4 px-4 sm:mx-0 sm:px-0">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-teal-400/15 text-teal-300 border border-teal-400/30"
                    : "text-muted hover:text-paper border border-transparent"
                }`}
              >
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </nav>

        <main className="flex-1 min-w-0">
          {tab === "profile" && (
            <ProfileEditor profile={content.profile} onChanged={refresh} />
          )}
          {tab === "resume" && (
            <ResumeEditor resume={content.resume} onChanged={refresh} />
          )}
          {tab === "media" && <MediaLibrary />}
          {collectionSchemas[tab] && (
            <CollectionEditor
              collectionKey={tab}
              schema={collectionSchemas[tab]}
              items={content[tab] || []}
              onChanged={refresh}
            />
          )}
        </main>
      </div>
    </div>
  );
}
