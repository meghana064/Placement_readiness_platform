/**
 * Canonical analysis entry schema and normalizer.
 * All history entries are normalized to this shape on read; new saves use it on write.
 */

export const SKILL_KEYS = ["coreCS", "languages", "web", "data", "cloud", "testing", "other"];

const DEFAULT_OTHER_SKILLS = ["Communication", "Problem solving", "Basic coding", "Projects"];

const CATEGORY_LABELS = {
  coreCS: "Core CS",
  languages: "Languages",
  web: "Web",
  data: "Data",
  cloud: "Cloud/DevOps",
  testing: "Testing",
  other: "Other",
};

/** Default extractedSkills when none detected */
export function getDefaultSkills() {
  return {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloud: [],
    testing: [],
    other: [...DEFAULT_OTHER_SKILLS],
  };
}

/** Map old byCategory to flat schema. cloudDevOps -> cloud. */
export function toFlatSkills(byCategory) {
  const flat = getDefaultSkills();
  if (!byCategory || typeof byCategory !== "object") return flat;

  const map = {
    coreCS: "coreCS",
    languages: "languages",
    web: "web",
    data: "data",
    cloudDevOps: "cloud",
    testing: "testing",
  };

  for (const [key, val] of Object.entries(byCategory)) {
    const target = map[key] || null;
    const arr = Array.isArray(val) ? val : val?.skills;
    if (target && Array.isArray(arr) && arr.length) {
      flat[target] = [...arr];
    }
  }

  const hasAny = SKILL_KEYS.some((k) => flat[k].length > 0);
  if (!hasAny) flat.other = [...DEFAULT_OTHER_SKILLS];
  return flat;
}

/** Normalize roundMapping to [{ roundTitle, focusAreas, whyItMatters }] */
function normalizeRoundMapping(rm) {
  if (!Array.isArray(rm)) return [];
  return rm.map((r) => {
    const title = r.roundTitle ?? r.title ?? r.round ?? "";
    const areas = Array.isArray(r.focusAreas) ? r.focusAreas : (r.title ? [r.title] : []);
    return {
      roundTitle: title,
      focusAreas: areas.length ? areas : [title],
      whyItMatters: r.whyItMatters ?? r.whyMatters ?? "",
    };
  });
}

/** Normalize checklist to [{ roundTitle, items }] */
function normalizeChecklist(cl) {
  if (!Array.isArray(cl)) return [];
  return cl.map((c) => ({
    roundTitle: c.roundTitle ?? c.round ?? "",
    items: Array.isArray(c.items) ? c.items : [],
  }));
}

/** Normalize plan to [{ day, focus, tasks }] */
function normalizePlan7Days(plan) {
  if (!Array.isArray(plan)) return [];
  return plan.map((p) => ({
    day: p.day ?? "",
    focus: p.focus ?? p.title ?? "",
    tasks: Array.isArray(p.tasks) ? p.tasks : Array.isArray(p.items) ? p.items : [],
  }));
}

/** Normalize extractedSkills to flat schema */
function normalizeExtractedSkills(es) {
  if (!es) return getDefaultSkills();
  if (Array.isArray(es.coreCS)) {
    const flat = { ...getDefaultSkills() };
    for (const k of SKILL_KEYS) {
      if (Array.isArray(es[k])) flat[k] = [...es[k]];
    }
    const hasAny = SKILL_KEYS.some((k) => flat[k].length > 0);
    if (!hasAny) flat.other = [...DEFAULT_OTHER_SKILLS];
    return flat;
  }
  return toFlatSkills(es.byCategory);
}

/**
 * Normalize a raw history entry to canonical schema. Throws if entry is invalid.
 */
export function normalizeEntry(entry) {
  if (!entry || typeof entry !== "object" || !entry.id) throw new Error("Invalid entry");

  const extractedSkills = normalizeExtractedSkills(entry.extractedSkills);
  const roundMapping = normalizeRoundMapping(entry.roundMapping);
  const checklist = normalizeChecklist(entry.checklist);
  const plan7Days = normalizePlan7Days(entry.plan ?? entry.plan7Days);
  const questions = Array.isArray(entry.questions) ? entry.questions : [];
  const baseScore = typeof entry.baseScore === "number" ? entry.baseScore : Number(entry.readinessScore) || 0;
  const skillConfidenceMap = entry.skillConfidenceMap && typeof entry.skillConfidenceMap === "object" ? entry.skillConfidenceMap : {};
  const knowCount = Object.values(skillConfidenceMap).filter((v) => v === "know").length;
  const allSkills = SKILL_KEYS.flatMap((k) => (extractedSkills[k] || []).map((s) => s));
  const practiceCount = Math.max(0, allSkills.length - knowCount);
  const finalScore = typeof entry.finalScore === "number"
    ? entry.finalScore
    : Math.min(100, Math.max(0, baseScore + knowCount * 2 - practiceCount * 2));

  return {
    id: String(entry.id),
    createdAt: entry.createdAt ?? new Date().toISOString(),
    company: entry.company != null ? String(entry.company) : "",
    role: entry.role != null ? String(entry.role) : "",
    jdText: entry.jdText != null ? String(entry.jdText) : "",
    extractedSkills,
    roundMapping,
    checklist,
    plan7Days,
    questions,
    baseScore,
    skillConfidenceMap,
    finalScore,
    updatedAt: entry.updatedAt ?? entry.createdAt ?? new Date().toISOString(),
    ...(entry.companyIntel != null && { companyIntel: entry.companyIntel }),
  };
}

/** Build byCategory view from flat extractedSkills for UI (Key skills section) */
export function extractedSkillsToByCategory(extractedSkills) {
  const byCategory = {};
  for (const k of SKILL_KEYS) {
    const arr = extractedSkills?.[k];
    if (Array.isArray(arr) && arr.length) {
      byCategory[k] = { label: CATEGORY_LABELS[k] ?? k, skills: arr };
    }
  }
  return byCategory;
}
