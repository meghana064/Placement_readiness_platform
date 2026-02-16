import { getPresentCategories } from "./skills";

/**
 * Readiness score 0–100:
 * Start 35.
 * +5 per detected category (max 30, i.e. 6 categories).
 * +10 if company provided.
 * +10 if role provided.
 * +10 if JD length > 800 chars.
 * Cap at 100.
 */
export function getReadinessScore(company, role, jdText, extractedSkills) {
  let score = 35;

  const categories = getPresentCategories(extractedSkills);
  score += Math.min(categories.length * 5, 30);

  if (company && String(company).trim()) score += 10;
  if (role && String(role).trim()) score += 10;
  if (jdText && String(jdText).trim().length > 800) score += 10;

  return Math.min(100, Math.max(0, score));
}
