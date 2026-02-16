const STORAGE_KEY = "placement_readiness_history";
import { normalizeEntry } from "./analysisSchema";

function loadRaw() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function saveRaw(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.warn("History save failed", e);
  }
}

function generateId() {
  return `pr-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Save analysis to history in canonical schema. Returns the saved entry.
 */
export function saveAnalysis(entry) {
  const now = new Date().toISOString();
  const id = generateId();
  const createdAt = entry.createdAt ?? now;

  const full = {
    id,
    createdAt,
    company: entry.company != null ? String(entry.company) : "",
    role: entry.role != null ? String(entry.role) : "",
    jdText: entry.jdText != null ? String(entry.jdText) : "",
    extractedSkills: entry.extractedSkills ?? {},
    roundMapping: Array.isArray(entry.roundMapping) ? entry.roundMapping : [],
    checklist: Array.isArray(entry.checklist) ? entry.checklist : [],
    plan7Days: Array.isArray(entry.plan7Days) ? entry.plan7Days : [],
    questions: Array.isArray(entry.questions) ? entry.questions : [],
    baseScore: typeof entry.baseScore === "number" ? entry.baseScore : Number(entry.readinessScore) || 0,
    skillConfidenceMap: entry.skillConfidenceMap && typeof entry.skillConfidenceMap === "object" ? entry.skillConfidenceMap : {},
    finalScore: typeof entry.finalScore === "number" ? entry.finalScore : (typeof entry.baseScore === "number" ? entry.baseScore : Number(entry.readinessScore) || 0),
    updatedAt: now,
    ...(entry.companyIntel != null && { companyIntel: entry.companyIntel }),
  };

  const entries = loadRaw();
  entries.unshift(full);
  saveRaw(entries);
  return normalizeEntry(full);
}

/**
 * All history entries, newest first. Normalizes each; skips corrupted.
 * Returns { entries: normalized[], corruptedCount: number }.
 */
export function getAllHistory() {
  const raw = loadRaw();
  const entries = [];
  let corruptedCount = 0;
  for (const e of raw) {
    try {
      entries.push(normalizeEntry(e));
    } catch {
      corruptedCount += 1;
    }
  }
  return { entries, corruptedCount };
}

/**
 * Get one entry by id, normalized. Returns undefined if not found or corrupted.
 */
export function getAnalysisById(id) {
  const raw = loadRaw();
  const entry = raw.find((e) => e.id === id);
  if (!entry) return undefined;
  try {
    return normalizeEntry(entry);
  } catch {
    return undefined;
  }
}

/**
 * Update an existing history entry. Persists to localStorage.
 * Returns the updated normalized entry or null if not found.
 */
export function updateAnalysis(id, updates) {
  const entries = loadRaw();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const merged = { ...entries[idx], ...updates };
  entries[idx] = merged;
  saveRaw(entries);
  try {
    return normalizeEntry(merged);
  } catch {
    return merged;
  }
}
