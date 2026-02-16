/**
 * Skill categories and keywords for JD parsing (case-insensitive).
 * If no category matches, we still show "General fresher stack".
 */

export const SKILL_CATEGORIES = {
  coreCS: {
    label: "Core CS",
    keywords: ["DSA", "OOP", "DBMS", "OS", "Networks", "Data Structures", "Algorithms", "Computer Networks", "Operating System"],
  },
  languages: {
    label: "Languages",
    keywords: ["Java", "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "Go", "Golang"],
  },
  web: {
    label: "Web",
    keywords: ["React", "Next.js", "Node.js", "Express", "REST", "GraphQL", "Angular", "Vue"],
  },
  data: {
    label: "Data",
    keywords: ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "NoSQL"],
  },
  cloudDevOps: {
    label: "Cloud/DevOps",
    keywords: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux", "K8s"],
  },
  testing: {
    label: "Testing",
    keywords: ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest", "Jest", "Testing"],
  },
};

const CATEGORY_KEYS = Object.keys(SKILL_CATEGORIES);

/**
 * Extract skills from JD text (case-insensitive). Returns { byCategory, hasAny }.
 */
export function extractSkills(jdText) {
  if (!jdText || typeof jdText !== "string") {
    return { byCategory: {}, hasAny: false };
  }
  const normalized = jdText.trim();
  const lower = normalized.toLowerCase();
  const byCategory = {};

  for (const key of CATEGORY_KEYS) {
    const { label, keywords } = SKILL_CATEGORIES[key];
    const found = [];
    for (const kw of keywords) {
      const kwLower = kw.toLowerCase();
      if (lower.includes(kwLower)) found.push(kw);
    }
    if (found.length) byCategory[key] = { label, skills: found };
  }

  const hasAny = Object.keys(byCategory).length > 0;
  return { byCategory, hasAny };
}

/**
 * Get a flat list of category labels that have at least one skill (for score).
 * Accepts both legacy byCategory and canonical flat schema.
 */
export function getPresentCategories(extractedSkills) {
  if (!extractedSkills) return [];
  if (extractedSkills.byCategory && typeof extractedSkills.byCategory === "object")
    return Object.keys(extractedSkills.byCategory);
  const flatKeys = ["coreCS", "languages", "web", "data", "cloud", "testing", "other"];
  return flatKeys.filter((k) => Array.isArray(extractedSkills[k]) && extractedSkills[k].length > 0);
}
