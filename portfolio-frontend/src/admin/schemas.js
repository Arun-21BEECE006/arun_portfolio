// Field schemas driving the generic admin forms. `type` controls which
// input renders and how the value is serialized to/from plain JS:
//  - text / url        → plain string
//  - textarea          → plain string (multi-line)
//  - select             → plain string, constrained to `options`
//  - boolean            → checkbox ⇄ true/false
//  - list               → comma-separated string ⇄ string[]
//  - lines              → newline-separated string ⇄ string[]
//  - kvlines            → "Label: Value" per line ⇄ {label,value}[]
//  - pipelines          → "Date | Milestone" per line ⇄ {date,milestone}[]
//  - imageUpload        → single-image upload/picker ⇄ string (rendered separately)
//  - gallery            → multi-image upload/picker ⇄ string[] (rendered separately)

export const collectionSchemas = {
  projects: {
    label: "Projects",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "subtitle", label: "Subtitle", type: "text" },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: ["aiml", "fullstack", "software", "embedded"],
        default: "software",
      },
      {
        name: "featured",
        label: "Featured (shown in carousel)",
        type: "boolean",
        default: false,
      },
      { name: "tags", label: "Tags (comma-separated)", type: "list" },
      { name: "description", label: "Short Description", type: "textarea" },
      {
        name: "longDescription",
        label: "Full Description (case study intro)",
        type: "textarea",
      },
      {
        name: "duration",
        label: "Duration (e.g. March 2026 – April 2026)",
        type: "text",
      },
      {
        name: "highlights",
        label: "Key Features (one per line)",
        type: "lines",
      },
      { name: "challenges", label: "Challenges (one per line)", type: "lines" },
      { name: "architecture", label: "Architecture Notes", type: "textarea" },
      {
        name: "futureImprovements",
        label: "Future Improvements (one per line)",
        type: "lines",
      },
      { name: "timeline", label: "Development Timeline", type: "pipelines" },
      { name: "metrics", label: "Performance Metrics", type: "kvlines" },
      {
        name: "techStack",
        label: "Tech Stack (comma-separated)",
        type: "list",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["Live", "Ongoing", "Complete"],
        default: "Live",
      },
      { name: "links.demo", label: "Live Demo URL", type: "url" },
      { name: "links.repo", label: "GitHub Repo URL", type: "url" },
      { name: "links.docs", label: "Documentation URL", type: "url" },
      { name: "links.video", label: "Demo Video URL", type: "url" },
      { name: "links.paper", label: "Research Paper URL", type: "url" },
      // ── Images: three separate, independent images ──
      {
        name: "image",
        label:
          "Cover Image — shown on project cards, the featured carousel, and the top of the case study page",
        type: "imageUpload",
        folder: "projects",
      },
      {
        name: "architectureDiagram",
        label:
          "Architecture Diagram — shown ONLY in the case study's Architecture section",
        type: "imageUpload",
        folder: "projects",
      },
      {
        name: "gallery",
        label:
          "Gallery — extra screenshots shown ONLY in the case study's Gallery section (upload as many as you like)",
        type: "gallery",
        folder: "projects",
      },
    ],
  },
  skillOrbs: {
    label: "Skills",
    fields: [
      {
        name: "id",
        label: "Slug ID (lowercase, no spaces, e.g. cloud-devops)",
        type: "text",
        required: true,
      },
      { name: "label", label: "Category Label", type: "text", required: true },
      {
        name: "accent",
        label: "Accent Color",
        type: "select",
        options: ["amber", "teal"],
        default: "teal",
      },
      {
        name: "icon",
        label: "Icon",
        type: "select",
        options: [
          "layout",
          "server",
          "brain",
          "camera",
          "database",
          "cloud",
          "code",
          "cpu",
        ],
        default: "code",
      },
      { name: "skills", label: "Technologies (comma-separated)", type: "list" },
    ],
  },
  experience: {
    label: "Experience",
    fields: [
      {
        name: "type",
        label: "Type",
        type: "select",
        options: ["fulltime", "internship"],
        default: "internship",
      },
      { name: "title", label: "Role / Title", type: "text", required: true },
      { name: "company", label: "Company", type: "text", required: true },
      {
        name: "period",
        label: "Period (e.g. Jan 2025 – Present)",
        type: "text",
      },
      { name: "location", label: "Location", type: "text" },
      {
        name: "points",
        label: "Responsibilities (one per line)",
        type: "lines",
      },
      {
        name: "technologies",
        label: "Technologies (comma-separated)",
        type: "list",
      },
    ],
  },
  certifications: {
    label: "Certifications",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "issuer", label: "Issued By", type: "text" },
      { name: "issueDate", label: "Issue Date (e.g. 2024-08)", type: "text" },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "credentialId", label: "Credential ID", type: "text" },
      { name: "verifyUrl", label: "Verify URL", type: "url" },
      {
        name: "image",
        label:
          "Certificate Preview Image — shown on the card and in the View/Download lightbox",
        type: "imageUpload",
        folder: "certifications",
      },
    ],
  },
  conferences: {
    label: "Conferences",
    fields: [
      {
        name: "title",
        label: "Title / Paper Name",
        type: "text",
        required: true,
      },
      { name: "event", label: "Conference / Event Name", type: "text" },
      { name: "date", label: "Date", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "organizer", label: "Organizer", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "link", label: "Certificate Link", type: "url" },
      { name: "slidesUrl", label: "Presentation Slides URL", type: "url" },
      { name: "paperUrl", label: "Research Paper URL", type: "url" },
      {
        name: "image",
        label: "Cover Photo — shown on the card itself",
        type: "imageUpload",
        folder: "conferences",
      },
      {
        name: "gallery",
        label:
          "Photo Gallery — extra photos shown as thumbnails below (separate from the cover photo)",
        type: "gallery",
        folder: "conferences",
      },
    ],
  },
  achievements: {
    label: "Achievements (Trophy Cabinet)",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "subtitle", label: "Subtitle", type: "text" },
      { name: "detail", label: "Detail", type: "textarea" },
      {
        name: "icon",
        label: "Icon",
        type: "select",
        options: [
          "trophy",
          "award",
          "target",
          "graduation-cap",
          "medal",
          "badge-check",
        ],
        default: "trophy",
      },
      { name: "link", label: "Verify / Reference Link", type: "url" },
    ],
  },
};

export const profileSchema = {
  fields: [
    { name: "name", label: "Full Name", type: "text" },
    { name: "roles", label: "Roles (comma-separated)", type: "list" },
    { name: "location", label: "Location", type: "text" },
    { name: "tagline", label: "Tagline", type: "textarea" },
    { name: "bio", label: "Bio Paragraphs (one per line)", type: "lines" },
    { name: "email", label: "Email", type: "text" },
    {
      name: "experienceYears",
      label: "Years of Experience (leave blank to hide)",
      type: "text",
    },
    {
      name: "resumeFile",
      label: "Resume filename (in src/assets)",
      type: "text",
    },
    { name: "socials.github", label: "GitHub URL", type: "url" },
    { name: "socials.linkedin", label: "LinkedIn URL", type: "url" },
    { name: "socials.twitter", label: "Twitter/X URL", type: "url" },
    { name: "socials.facebook", label: "Facebook URL", type: "url" },
    {
      name: "projectsCountOverride",
      label:
        "Projects count override (leave blank to auto-count from your Projects)",
      type: "text",
    },
    {
      name: "technologiesCountOverride",
      label:
        "Technologies count override (leave blank to auto-count from your Skills)",
      type: "text",
    },
    {
      name: "certificationsCountOverride",
      label:
        "Certifications count override (leave blank to auto-count from your Certifications)",
      type: "text",
    },
  ],
};

export const resumeSchema = {
  fields: [
    {
      name: "lastUpdated",
      label: "Last Updated (e.g. 2026-07-20)",
      type: "text",
    },
  ],
};
