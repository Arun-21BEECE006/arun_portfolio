// Rule-based knowledge base and retrieval logic for the AI Portfolio
// Assistant — answers only from live portfolio content, never hallucinates.
// `content` is the object from ContentContext: { profile, projects,
// skillOrbs, experience, certifications, achievements, conference }.

function buildVocabulary(content) {
  const words = new Set();
  const add = (text) => {
    if (!text) return;
    text
      .toLowerCase()
      .split(/[^a-z0-9+.]+/i)
      .filter((w) => w.length > 2)
      .forEach((w) => words.add(w));
  };

  const { profile, projects, skillOrbs, experience, certifications, achievements, conferences } = content;

  add(profile.name);
  add(profile.tagline);
  profile.bio?.forEach(add);
  add(profile.location);
  profile.roles?.forEach(add);

  projects?.forEach((p) => {
    add(p.title);
    add(p.subtitle);
    add(p.description);
    p.tags?.forEach(add);
    p.techStack?.forEach(add);
    p.highlights?.forEach(add);
  });

  skillOrbs?.forEach((s) => {
    add(s.label);
    s.skills?.forEach(add);
  });

  experience?.forEach((e) => {
    add(e.title);
    add(e.company);
    e.points?.forEach(add);
  });

  certifications?.forEach((c) => {
    add(c.title);
    add(c.issuer);
    add(c.summary);
  });

  achievements?.forEach((a) => {
    add(a.title);
    add(a.subtitle);
    add(a.detail);
  });

  conferences?.forEach((c) => add(c.title));

  [
    "project", "projects", "resume", "cv", "contact", "email", "reach",
    "github", "linkedin", "certificate", "certificates", "certification",
    "conference", "achievement", "achievements", "award", "skill", "skills",
    "tech", "stack", "experience", "work", "job", "internship", "education",
    "about", "hire", "who", "role", "engineer", "company", "fulltime",
  ].forEach((w) => words.add(w));

  return words;
}

const REFUSAL =
  "I am Arun Kumar's Portfolio AI Assistant. I can only answer questions related to Arun's experience, projects, skills, certifications, achievements, education, and professional profile.";

function tokenize(q) {
  return q
    .toLowerCase()
    .split(/[^a-z0-9+.]+/i)
    .filter((w) => w.length > 2);
}

function findProjectMatch(q, projects) {
  const query = q.toLowerCase();
  return projects?.find(
    (p) =>
      query.includes(p.title.toLowerCase()) ||
      query.includes(String(p.id).replace(/-/g, " ")) ||
      p.title
        .toLowerCase()
        .split(/\s+/)
        .some((w) => w.length > 3 && query.includes(w))
  );
}

// Returns { text, action?: { type: 'scroll'|'link'|'resume', target } }
export function answerQuery(rawQuery, content) {
  const { profile, projects, skillOrbs, experience, certifications, achievements, conferences } = content;
  const q = rawQuery.trim();
  if (!q) return { text: "Ask me anything about Arun's experience, projects, or skills." };
  const lower = q.toLowerCase();

  if (/\b(resume|cv)\b/.test(lower)) {
    return { text: "Opening Arun's resume — you can view or download it now.", action: { type: "resume" } };
  }
  if (/\bgithub\b/.test(lower)) {
    return {
      text: `Opening Arun's GitHub profile: ${profile.socials.github}`,
      action: { type: "link", target: profile.socials.github },
    };
  }
  if (/\blinkedin\b/.test(lower)) {
    return {
      text: `Opening Arun's LinkedIn profile: ${profile.socials.linkedin}`,
      action: { type: "link", target: profile.socials.linkedin },
    };
  }
  if (/\bcontact\b|\breach\b|\bemail\b|\bphone\b/.test(lower)) {
    return {
      text: `You can reach Arun at ${profile.email}, or use the contact form — scrolling you there now.`,
      action: { type: "scroll", target: "contact" },
    };
  }
  if (/\bproject(s)?\b/.test(lower) && !findProjectMatch(lower, projects)) {
    const list = (projects || [])
      .slice(0, 6)
      .map((p) => `• ${p.title} — ${p.subtitle || p.tags?.join(", ")}`)
      .join("\n");
    return {
      text: `Here are some of Arun's projects:\n${list}\n\nScrolling you to the full Projects section.`,
      action: { type: "scroll", target: "projects" },
    };
  }
  if (/\bcertificat/.test(lower)) {
    const list = (certifications || []).map((c) => `• ${c.title} — ${c.issuer}`).join("\n");
    return { text: `Arun's certifications:\n${list}`, action: { type: "scroll", target: "certifications" } };
  }
  if (/\bconference\b|\bpaper\b|\bpublication/.test(lower)) {
    const list = (conferences || []).map((c) => `• "${c.title}" — ${c.event}, ${c.date}`).join("\n");
    return {
      text: list ? `Arun's conference papers:\n${list}` : "I couldn't find that information in Arun's portfolio.",
      action: { type: "scroll", target: "conferences" },
    };
  }
  if (/\bachievement|\baward|\bhackathon|\bcodeathon|\brank\b/.test(lower)) {
    const list = (achievements || []).map((a) => `• ${a.title} — ${a.subtitle}`).join("\n");
    return { text: `Arun's achievements:\n${list}`, action: { type: "scroll", target: "achievements" } };
  }
  if (/\bskill|\btech stack|\btechnolog/.test(lower)) {
    const list = (skillOrbs || []).map((s) => `• ${s.label}: ${s.skills.slice(0, 4).join(", ")}…`).join("\n");
    return { text: `Arun's skill categories:\n${list}`, action: { type: "scroll", target: "skills" } };
  }
  if (/\bexperience\b|\binternship|\bwork(ed)?\b|\bjob\b|\bcompan(y|ies)\b|\bfull.?time\b/.test(lower)) {
    const list = (experience || [])
      .map((e) => `• ${e.title} @ ${e.company} (${e.period})${e.type === "fulltime" ? " — Full-Time" : " — Internship"}`)
      .join("\n");
    return { text: `Arun's experience:\n${list}`, action: { type: "scroll", target: "experience" } };
  }

  const project = findProjectMatch(lower, projects);
  if (project) {
    const stack = project.techStack?.length ? `\nTech stack: ${project.techStack.join(", ")}` : "";
    const link = project.links?.demo || project.links?.repo;
    return {
      text: `${project.title} — ${project.subtitle || ""}\n\n${project.description}${stack}`,
      action: link ? { type: "link", target: link } : { type: "scroll", target: "projects" },
    };
  }

  if (/\babout\b|\bwho is arun\b|\btell me about arun\b|\bsummary\b|\bprofile\b/.test(lower)) {
    return { text: `${profile.tagline}\n\n${profile.bio[0]}`, action: { type: "scroll", target: "about" } };
  }
  if (/\bcurrent role\b|\bwhat does arun do\b|\bwhat is arun\b/.test(lower)) {
    return { text: `Arun works as a ${profile.roles.join(" / ")}, based in ${profile.location}.` };
  }
  if (/\beducation\b|\bcollege\b|\bdegree\b|\buniversity\b/.test(lower)) {
    return {
      text: profile.bio.find((b) => /college|university|degree|engineering/i.test(b)) ||
        "I couldn't find that information in Arun's portfolio.",
      action: { type: "scroll", target: "about" },
    };
  }

  const vocab = buildVocabulary(content);
  const tokens = tokenize(lower);
  const overlap = tokens.filter((t) => vocab.has(t));
  if (overlap.length > 0) {
    return {
      text: `${profile.tagline}\n\nAsk me about Arun's projects, skills, experience, certifications, achievements, or how to contact him for more specifics.`,
      action: { type: "scroll", target: "about" },
    };
  }

  return { text: REFUSAL };
}

export const quickActions = [
  { label: "About Me", query: "Tell me about Arun" },
  { label: "Projects", query: "Show projects" },
  { label: "Experience", query: "Show work experience" },
  { label: "Skills", query: "Show technical skills" },
  { label: "Certificates", query: "Show certificates" },
  { label: "Achievements", query: "Show achievements" },
  { label: "Resume", query: "Download resume" },
  { label: "GitHub", query: "Open GitHub" },
  { label: "LinkedIn", query: "Open LinkedIn" },
  { label: "Contact", query: "How can I contact Arun?" },
];

export const welcomeMessage =
  "Hi! 👋 I'm Arun Kumar's AI Portfolio Assistant.\n\nI can help you explore Arun's:\n• Experience\n• Projects\n• Skills\n• Certificates\n• Achievements\n• Resume\n• GitHub\n• Contact Information\n\nAsk me anything related to Arun.";
