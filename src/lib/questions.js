/**
 * 10 likely interview questions based on detected skills.
 */
const QUESTION_POOL = [
  {
    key: "sql",
    match: (byCategory) => byCategory.data || (byCategory.coreCS?.skills?.some((s) => /DBMS|SQL|Database/i.test(s))),
    question: "Explain indexing in databases and when it helps.",
  },
  {
    key: "react",
    match: (byCategory) => byCategory.web?.skills?.some((s) => /React/i.test(s)),
    question: "Explain state management options in React (local state, Context, Redux).",
  },
  {
    key: "dsa",
    match: (byCategory) => byCategory.coreCS?.skills?.some((s) => /DSA|Data Structures|Algorithms/i.test(s)),
    question: "How would you optimize search in sorted data? When is binary search applicable?",
  },
  {
    key: "oop",
    match: (byCategory) => byCategory.coreCS?.skills?.some((s) => /OOP|Object/i.test(s)),
    question: "Explain polymorphism and give a real-world example.",
  },
  {
    key: "os",
    match: (byCategory) => byCategory.coreCS?.skills?.some((s) => /OS|Operating/i.test(s)),
    question: "Explain process vs thread and when you would use multithreading.",
  },
  {
    key: "networks",
    match: (byCategory) => byCategory.coreCS?.skills?.some((s) => /Network|TCP|HTTP/i.test(s)),
    question: "Explain the difference between TCP and UDP. When is each used?",
  },
  {
    key: "node",
    match: (byCategory) => byCategory.web?.skills?.some((s) => /Node|Express/i.test(s)),
    question: "How does Node.js handle asynchronous I/O? Explain event loop briefly.",
  },
  {
    key: "rest",
    match: (byCategory) => byCategory.web?.skills?.some((s) => /REST|API/i.test(s)),
    question: "What are REST principles? How would you design a RESTful API for a given resource?",
  },
  {
    key: "docker",
    match: (byCategory) => byCategory.cloudDevOps,
    question: "Explain what Docker does and why containers are useful in development and deployment.",
  },
  {
    key: "system_design",
    match: () => true,
    question: "How would you design a URL shortener (high-level components and data flow)?",
  },
  {
    key: "resume",
    match: () => true,
    question: "Walk me through your resume and the project you are most proud of.",
  },
  {
    key: "behavioral",
    match: () => true,
    question: "Describe a situation where you had a conflict with a teammate. How did you resolve it?",
  },
  {
    key: "graphql",
    match: (byCategory) => byCategory.web?.skills?.some((s) => /GraphQL/i.test(s)),
    question: "When would you choose GraphQL over REST? What are the trade-offs?",
  },
  {
    key: "mongodb",
    match: (byCategory) => byCategory.data?.skills?.some((s) => /Mongo|NoSQL/i.test(s)),
    question: "When would you choose a NoSQL database over a relational one?",
  },
  {
    key: "testing",
    match: (byCategory) => byCategory.testing,
    question: "How do you approach writing tests for a new feature? Unit vs integration.",
  },
];

/**
 * Return up to 10 questions based on detected skills. Prefer skill-specific; fill with generic.
 */
export function getQuestions(extractedSkills) {
  const byCategory = extractedSkills?.byCategory ?? {};
  const specific = [];
  const generic = [];

  for (const item of QUESTION_POOL) {
    if (item.match(byCategory)) {
      if (item.key === "system_design" || item.key === "resume" || item.key === "behavioral") {
        generic.push(item.question);
      } else {
        specific.push(item.question);
      }
    }
  }

  const combined = [...specific, ...generic];
  const unique = [...new Set(combined)];
  return unique.slice(0, 10);
}
