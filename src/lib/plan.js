/**
 * 7-day plan. Template-based, adapted to detected skills.
 */
export function getPlan(extractedSkills) {
  const { byCategory, hasAny } = extractedSkills || { byCategory: {}, hasAny: false };
  const hasDSA = byCategory.coreCS?.skills?.some((s) => /DSA|Data Structures|Algorithms/i.test(s)) ?? false;
  const hasWeb = Object.keys(byCategory).includes("web");
  const hasReact = byCategory.web?.skills?.some((s) => /React/i.test(s)) ?? false;
  const hasData = Object.keys(byCategory).includes("data");
  const hasCloud = Object.keys(byCategory).includes("cloudDevOps");

  const day1_2 = hasAny
    ? [
        "Revise core CS: OOP, DBMS, OS, Networks (key concepts only).",
        "Brush up basics of data structures (arrays, linked lists, stacks, queues).",
        "Note down weak topics for Day 7 revision.",
      ]
    : ["Revise core CS and CS fundamentals.", "Note weak areas for later."];

  const day3_4 = hasDSA
    ? [
        "Solve 3–5 DSA problems (arrays/strings).",
        "Solve 2–3 tree/graph problems.",
        "Revise complexity analysis and common patterns.",
      ]
    : [
        "Practice coding basics and problem-solving.",
        "Revise core CS concepts.",
      ];

  const day5 = [
    "Align 2–3 projects with JD requirements.",
    "Update resume bullets to match JD keywords.",
  ];
  if (hasReact) day5.push("Revise React concepts and one project using it.");
  if (hasData) day5.push("Prepare to explain database design in projects.");
  if (hasCloud) day5.push("Prepare deployment/DevOps talking points.");

  const day6 = [
    "Practice mock tech questions (out loud).",
    "Prepare 5–8 'Tell me about a time when...' stories.",
  ];

  const day7 = [
    "Revision: weak areas from Day 1–2.",
    "Quick recap of DSA patterns and project stories.",
    "Rest and avoid new topics.",
  ];

  return [
    { day: "Day 1–2", title: "Basics + Core CS", items: day1_2 },
    { day: "Day 3–4", title: "DSA + Coding practice", items: day3_4 },
    { day: "Day 5", title: "Project + Resume alignment", items: day5 },
    { day: "Day 6", title: "Mock interview questions", items: day6 },
    { day: "Day 7", title: "Revision + Weak areas", items: day7 },
  ];
}
