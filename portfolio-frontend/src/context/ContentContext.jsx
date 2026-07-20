import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../lib/api";
import * as staticData from "../data/portfolio";

const FALLBACK = {
  profile: staticData.profile,
  skillOrbs: staticData.skillOrbs,
  projects: staticData.projects,
  experience: staticData.experience,
  certifications: staticData.certifications,
  achievements: staticData.achievements,
  conferences: staticData.conference
    ? [{ ...staticData.conference, id: "conf-1" }]
    : [],
  resume: {
    file: staticData.profile.resumeFile || "resume.pdf",
    lastUpdated: "",
  },
};

const ContentContext = createContext({
  content: FALLBACK,
  loading: true,
  usingFallback: true,
  refresh: () => {},
});

export function ContentProvider({ children }) {
  const [content, setContent] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await api.getContent();
      setContent(data);
      setUsingFallback(false);
    } catch {
      // Backend unreachable (not running / not deployed yet) — the site
      // still works fully off the bundled static data.
      setContent(FALLBACK);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ContentContext.Provider
      value={{ content, loading, usingFallback, refresh }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
