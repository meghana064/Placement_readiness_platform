const STORAGE_KEY = "prp_test_checklist";

const TEST_IDS = [
  "jd_required_validation",
  "short_jd_warning",
  "skills_extraction_groups",
  "round_mapping_changes",
  "score_deterministic",
  "skill_toggles_update_score",
  "changes_persist_refresh",
  "history_saves_loads",
  "export_buttons_copy",
  "no_console_errors",
];

function loadRaw() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return {};
    const parsed = JSON.parse(s);
    return typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveRaw(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {
    console.warn("Test checklist save failed", e);
  }
}

/**
 * Get current checklist state. Returns { [testId]: true | false }.
 */
export function getChecklist() {
  return loadRaw();
}

/**
 * Set one item. Persists to localStorage.
 */
export function setChecklistItem(testId, checked) {
  const next = { ...loadRaw(), [testId]: !!checked };
  saveRaw(next);
  return next;
}

/**
 * Reset all items to unchecked.
 */
export function resetChecklist() {
  saveRaw({});
  return {};
}

/**
 * True only if all 10 tests are checked.
 */
export function allPassed() {
  const state = loadRaw();
  return TEST_IDS.every((id) => state[id] === true);
}

export { TEST_IDS };
