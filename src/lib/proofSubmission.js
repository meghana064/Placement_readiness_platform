const STEPS_KEY = "prp_step_completion";
const SUBMISSION_KEY = "prp_final_submission";

export const STEP_IDS = [
  "step1",
  "step2",
  "step3",
  "step4",
  "step5",
  "step6",
  "step7",
  "step8",
];

export const STEP_LABELS = [
  "Landing & Get Started",
  "Analyze JD & Validation",
  "Results & Skill Extraction",
  "History & Persistence",
  "Company Intel & Round Mapping",
  "Interactive Score & Export",
  "Test Checklist (10/10)",
  "Ship Unlocked",
];

function loadSteps() {
  try {
    const s = localStorage.getItem(STEPS_KEY);
    if (!s) return {};
    const parsed = JSON.parse(s);
    return typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveSteps(obj) {
  try {
    localStorage.setItem(STEPS_KEY, JSON.stringify(obj));
  } catch (e) {
    console.warn("Step completion save failed", e);
  }
}

function loadSubmission() {
  try {
    const s = localStorage.getItem(SUBMISSION_KEY);
    if (!s) return { lovableUrl: "", githubUrl: "", deployedUrl: "" };
    const parsed = JSON.parse(s);
    return {
      lovableUrl: String(parsed.lovableUrl ?? "").trim(),
      githubUrl: String(parsed.githubUrl ?? "").trim(),
      deployedUrl: String(parsed.deployedUrl ?? "").trim(),
    };
  } catch {
    return { lovableUrl: "", githubUrl: "", deployedUrl: "" };
  }
}

function saveSubmission(obj) {
  try {
    localStorage.setItem(SUBMISSION_KEY, JSON.stringify(obj));
  } catch (e) {
    console.warn("Submission save failed", e);
  }
}

/**
 * Basic URL validation: must start with http:// or https:// and have a host.
 */
export function validateUrl(value) {
  const v = String(value ?? "").trim();
  if (!v) return { valid: false, message: "Required" };
  try {
    const u = new URL(v);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return { valid: false, message: "URL must use http or https" };
    }
    if (!u.hostname) return { valid: false, message: "Invalid URL" };
    return { valid: true, message: "" };
  } catch {
    return { valid: false, message: "Enter a valid URL" };
  }
}

export function getSteps() {
  return loadSteps();
}

export function setStep(stepId, completed) {
  const next = { ...loadSteps(), [stepId]: !!completed };
  saveSteps(next);
  return next;
}

export function getSubmission() {
  return loadSubmission();
}

export function setSubmission(partial) {
  const current = loadSubmission();
  const next = { ...current, ...partial };
  saveSubmission(next);
  return next;
}

/**
 * Shipped ONLY when: all 8 steps completed, all 10 tests passed, all 3 links valid.
 */
export function isShipped(allPassedFn) {
  const steps = loadSteps();
  const allStepsComplete = STEP_IDS.every((id) => steps[id] === true);
  const sub = loadSubmission();
  const lovableOk = validateUrl(sub.lovableUrl).valid;
  const githubOk = validateUrl(sub.githubUrl).valid;
  const deployedOk = validateUrl(sub.deployedUrl).valid;
  const allLinksProvided = lovableOk && githubOk && deployedOk;
  const testsPassed = allPassedFn();
  return allStepsComplete && testsPassed && allLinksProvided;
}
