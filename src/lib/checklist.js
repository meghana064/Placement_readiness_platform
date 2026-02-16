import { SKILL_CATEGORIES } from "./skills";

const ROUND_1_BASE = [
  "Revise quantitative aptitude (percentages, ratios, time & work).",
  "Practice logical reasoning and puzzles.",
  "Brush up basic grammar and verbal ability.",
  "Review fundamental CS concepts (binary, number systems).",
  "Time yourself on sample aptitude tests.",
];

const ROUND_2_BASE = [
  "Revise arrays, strings, and two-pointer techniques.",
  "Practice 5–10 medium DSA problems (arrays, trees).",
  "Review time/space complexity for common patterns.",
  "Revise OOP concepts (encapsulation, inheritance, polymorphism).",
  "Brush up DBMS (normalization, indexes, transactions).",
  "Review OS (scheduling, memory, deadlock).",
  "Revise networking basics (TCP/IP, HTTP).",
];

const ROUND_3_BASE = [
  "Prepare 2–3 project stories with STAR format.",
  "Align resume points with JD keywords.",
  "Prepare to explain tech stack choices.",
  "Practice explaining system design at high level.",
  "Review past projects and your role in them.",
  "Prepare questions to ask the interviewer.",
];

const ROUND_4_BASE = [
  "Prepare self-introduction (1–2 min).",
  "Prepare 'Why this company?' and 'Why this role?'.",
  "List 3 strengths and 2 weaknesses with examples.",
  "Prepare behavioral examples (conflict, leadership, failure).",
  "Research company values and recent news.",
  "Practice salary and availability discussion (if applicable).",
];

function pickItems(base, count, extraFromSkill = []) {
  const pool = [...base, ...extraFromSkill];
  return pool.slice(0, Math.min(count, pool.length));
}

/**
 * Round-wise preparation checklist. 5–8 items per round based on extracted skills.
 */
export function getChecklist(extractedSkills) {
  const { byCategory, hasAny } = extractedSkills || { byCategory: {}, hasAny: false };
  const hasDSA = byCategory.coreCS?.skills?.some((s) => /DSA|Data Structures|Algorithms/i.test(s)) ?? false;
  const hasOOP = byCategory.coreCS?.skills?.some((s) => /OOP|Object/i.test(s)) ?? false;
  const hasDBMS = byCategory.coreCS?.skills?.some((s) => /DBMS|Database/i.test(s)) ?? false;
  const hasWeb = Object.keys(byCategory).includes("web");
  const hasData = Object.keys(byCategory).includes("data");
  const hasCloud = Object.keys(byCategory).includes("cloudDevOps");
  const hasTesting = Object.keys(byCategory).includes("testing");

  const round2Extra = [];
  if (hasDSA) round2Extra.push("Focus on DSA patterns: sliding window, binary search, trees.");
  if (hasOOP) round2Extra.push("Prepare OOP design questions and real-world examples.");
  if (hasDBMS) round2Extra.push("Revise SQL joins, indexing, and query optimization.");
  if (hasWeb) round2Extra.push("Revise web fundamentals (HTTP, cookies, security).");

  const round3Extra = [];
  if (hasWeb) round3Extra.push("Prepare to discuss frontend/backend projects and trade-offs.");
  if (hasData) round3Extra.push("Be ready to explain database choices in your projects.");
  if (hasCloud) round3Extra.push("Prepare to discuss deployment and DevOps in projects.");
  if (hasTesting) round3Extra.push("Prepare to explain testing strategy in your projects.");

  return [
    {
      round: "Round 1: Aptitude / Basics",
      items: pickItems(ROUND_1_BASE, hasAny ? 6 : 5),
    },
    {
      round: "Round 2: DSA + Core CS",
      items: pickItems(ROUND_2_BASE, hasAny ? 8 : 6, round2Extra),
    },
    {
      round: "Round 3: Tech interview (projects + stack)",
      items: pickItems(ROUND_3_BASE, hasAny ? 8 : 6, round3Extra),
    },
    {
      round: "Round 4: Managerial / HR",
      items: pickItems(ROUND_4_BASE, 6),
    },
  ];
}
