let cache = { data: null, fetchedAt: 0 };
const TTL_MS = 60 * 60 * 1000; // 1 hour

// Real daily contribution data is ONLY available from GitHub's authenticated
// GraphQL API — the public REST API has no endpoint for this. If no
// GITHUB_TOKEN is configured, this returns null rather than inventing data.
async function fetchContributionCalendar(username, token) {
  if (!token) return null;

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "portfolio-backend",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  if (!res.ok) return null;
  const json = await res.json();
  const calendar =
    json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) return null;

  return {
    total: calendar.totalContributions,
    weeks: calendar.weeks.map((w) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
      })),
    ),
  };
}

async function fetchGithubStats(username) {
  if (
    cache.data &&
    Date.now() - cache.fetchedAt < TTL_MS &&
    cache.data.username === username
  ) {
    return cache.data;
  }

  const headers = {
    "User-Agent": "portfolio-backend",
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const [userRes, reposRes, contributions] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers },
    ),
    fetchContributionCalendar(username, process.env.GITHUB_TOKEN),
  ]);

  if (!userRes.ok) {
    if (userRes.status === 403 || userRes.status === 429) {
      throw new Error(
        "GitHub API rate limit reached for this server's IP. This is temporary (resets hourly) — add a GITHUB_TOKEN env var for a much higher limit, or just wait.",
      );
    }
    throw new Error(`GitHub user lookup failed (${userRes.status})`);
  }
  const user = await userRes.json();
  const repos = reposRes.ok ? await reposRes.json() : [];

  const languageCounts = {};
  let totalStars = 0;
  const pinned = [];

  for (const repo of Array.isArray(repos) ? repos : []) {
    totalStars += repo.stargazers_count || 0;
    if (repo.language)
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
  }

  const languageTotal =
    Object.values(languageCounts).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({
      name,
      percent: Math.round((count / languageTotal) * 100),
    }));

  const topRepos = [...(Array.isArray(repos) ? repos : [])]
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      description: r.description || "",
      language: r.language || "",
      stars: r.stargazers_count || 0,
      url: r.html_url,
    }));

  const data = {
    username,
    profileUrl: user.html_url,
    repositories: user.public_repos ?? 0,
    followers: user.followers ?? 0,
    stars: totalStars,
    languages,
    topRepos,
    contributions, // real data if GITHUB_TOKEN is set, otherwise null — never fabricated
    source: "live", // signals to the frontend this is real, fetched data
  };

  cache = { data, fetchedAt: Date.now() };
  return data;
}

module.exports = { fetchGithubStats };
