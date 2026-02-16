/**
 * Round mapping engine: dynamic rounds based on company size and detected skills.
 * No external APIs. Returns array of { round, title, whyMatters }.
 */

function hasCategory(byCategory, key) {
  return Object.prototype.hasOwnProperty.call(byCategory || {}, key);
}

function hasDSA(byCategory) {
  if (!byCategory?.coreCS?.skills) return false;
  const s = byCategory.coreCS.skills.join(" ").toLowerCase();
  return /dsa|data structures|algorithms/.test(s);
}

function hasWeb(byCategory) {
  return hasCategory(byCategory, "web");
}

function hasReactOrNode(byCategory) {
  const skills = byCategory?.web?.skills ?? [];
  const lower = skills.join(" ").toLowerCase();
  return /react|node|express/.test(lower);
}

/**
 * Generate round flow as array of { round, title, whyMatters }.
 */
export function getRoundMapping(companySize, extractedSkills) {
  const byCategory = extractedSkills?.byCategory ?? {};
  const isEnterprise = companySize === "enterprise";
  const isMidSize = companySize === "mid-size";
  const dsa = hasDSA(byCategory);
  const web = hasWeb(byCategory);
  const reactOrNode = hasReactOrNode(byCategory);

  function row(round, title, focusAreas, whyMatters) {
    return { round, title, roundTitle: title, focusAreas: focusAreas ?? [title], whyItMatters: whyMatters };
  }

  if (isEnterprise && dsa) {
    return [
      row("Round 1", "Online Test (DSA + Aptitude)", ["DSA", "Aptitude"], "Filters for baseline problem-solving and quantitative ability before any human interview."),
      row("Round 2", "Technical (DSA + Core CS)", ["DSA", "Core CS"], "Validates depth in data structures, algorithms, and core CS fundamentals under time pressure."),
      row("Round 3", "Tech + Projects", ["Projects", "Tech"], "Connects your projects to the role and checks how you apply concepts in real scenarios."),
      row("Round 4", "HR", ["HR"], "Assesses fit, motivation, and communication before offer."),
    ];
  }

  if (isEnterprise) {
    return [
      row("Round 1", "Aptitude / Online Test", ["Aptitude"], "Standardized screening for logical and quantitative skills."),
      row("Round 2", "Technical (Core + Stack)", ["Core", "Stack"], "Tests fundamentals and role-relevant tech stack."),
      row("Round 3", "Projects & HR", ["Projects", "HR"], "Project discussion and culture fit in one flow."),
    ];
  }

  if ((isMidSize || companySize === "startup") && reactOrNode) {
    return [
      row("Round 1", "Practical coding", ["Coding"], "Hands-on task to see how you write and reason about code in a real scenario."),
      row("Round 2", "System discussion", ["System design"], "How you design or extend systems; trade-offs and stack choices."),
      row("Round 3", "Culture fit", ["Culture fit"], "Team fit, ownership, and how you work in smaller teams."),
    ];
  }

  if (web || dsa) {
    return [
      row("Round 1", "Coding / Aptitude", ["Coding", "Aptitude"], "Quick filter on problem-solving or basic aptitude."),
      row("Round 2", "Technical (Stack + DSA)", ["Stack", "DSA"], "Depth in role-relevant skills and core CS where applicable."),
      row("Round 3", "Projects & HR", ["Projects", "HR"], "Project walkthrough and fit."),
    ];
  }

  return [
    row("Round 1", "Aptitude / Basics", ["Aptitude"], "Screens for logical and quantitative readiness."),
    row("Round 2", "Technical", ["Technical"], "Core CS and role basics."),
    row("Round 3", "HR", ["HR"], "Fit and motivation."),
  ];
}
