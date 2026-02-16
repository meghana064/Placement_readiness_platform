import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { getAnalysisById, getAllHistory, updateAnalysis } from "../lib/history";
import { extractedSkillsToByCategory, SKILL_KEYS } from "../lib/analysisSchema";
import { Link } from "react-router-dom";

function flattenSkillsFromFlat(extractedSkills) {
  const out = [];
  for (const k of SKILL_KEYS) {
    const arr = extractedSkills?.[k];
    if (Array.isArray(arr)) for (const s of arr) out.push({ skill: s, label: k });
  }
  return out;
}

function formatPlanAsText(plan7Days) {
  if (!plan7Days?.length) return "";
  return plan7Days
    .map(({ day, focus, tasks }) => {
      const lines = (tasks || []).map((i) => `  • ${i}`).join("\n");
      return `${day}: ${focus}\n${lines}`;
    })
    .join("\n\n");
}

function formatChecklistAsText(checklist) {
  if (!checklist?.length) return "";
  return checklist
    .map(({ roundTitle, items }) => {
      const lines = (items || []).map((i) => `  • ${i}`).join("\n");
      return `${roundTitle}\n${lines}`;
    })
    .join("\n\n");
}

function formatQuestionsAsText(questions) {
  if (!questions?.length) return "";
  return questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
}

export default function Results() {
  const [searchParams] = useSearchParams();
  const idFromUrl = searchParams.get("id");
  const [entry, setEntry] = useState(null);
  const [skillConfidenceMap, setSkillConfidenceMap] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let resolved = null;
    if (idFromUrl) {
      resolved = getAnalysisById(idFromUrl);
      if (!resolved) setNotFound(true);
    } else {
      const { entries } = getAllHistory();
      resolved = entries?.length ? entries[0] : null;
      if (!resolved) setNotFound(true);
    }
    setEntry(resolved);
    setSkillConfidenceMap(resolved?.skillConfidenceMap ?? {});
  }, [idFromUrl]);

  const baseScore = entry?.baseScore ?? 0;
  const allSkills = entry ? flattenSkillsFromFlat(entry.extractedSkills) : [];
  const knowCount = allSkills.filter((s) => skillConfidenceMap[s.skill] === "know").length;
  const practiceCount = allSkills.length - knowCount;
  const liveScore = Math.min(100, Math.max(0, baseScore + knowCount * 2 - practiceCount * 2));

  const persistConfidence = useCallback((newMap) => {
    if (!entry?.id) return;
    const know = Object.values(newMap).filter((v) => v === "know").length;
    const practice = Math.max(0, allSkills.length - know);
    const finalScore = Math.min(100, Math.max(0, baseScore + know * 2 - practice * 2));
    const updated = updateAnalysis(entry.id, {
      skillConfidenceMap: newMap,
      finalScore,
      updatedAt: new Date().toISOString(),
    });
    if (updated) setEntry(updated);
  }, [entry?.id, baseScore, allSkills.length]);

  const setSkillConfidence = useCallback((skill, value) => {
    const next = value === "know" ? "know" : "practice";
    setSkillConfidenceMap((prev) => {
      const newMap = { ...prev, [skill]: next };
      persistConfidence(newMap);
      return newMap;
    });
  }, [persistConfidence]);

  const byCategory = entry ? extractedSkillsToByCategory(entry.extractedSkills) : {};
  const categories = Object.entries(byCategory);

  const practiceSkills = allSkills.filter((s) => skillConfidenceMap[s.skill] !== "know");
  const top3Weak = practiceSkills.slice(0, 3).map((s) => s.skill);

  const handleCopyPlan = useCallback(() => {
    const text = formatPlanAsText(entry?.plan7Days);
    navigator.clipboard.writeText(text || "No plan.");
  }, [entry?.plan7Days]);

  const handleCopyChecklist = useCallback(() => {
    const text = formatChecklistAsText(entry?.checklist);
    navigator.clipboard.writeText(text || "No checklist.");
  }, [entry?.checklist]);

  const handleCopyQuestions = useCallback(() => {
    const text = formatQuestionsAsText(entry?.questions);
    navigator.clipboard.writeText(text || "No questions.");
  }, [entry?.questions]);

  const handleDownloadTxt = useCallback(() => {
    const parts = [
      "Placement Readiness – Analysis Export",
      "",
      "=== Readiness Score ===",
      String(liveScore),
      "",
      "=== Key skills (self-assessment) ===",
      ...allSkills.map((s) => `  ${s.skill}: ${skillConfidenceMap[s.skill] === "know" ? "I know this" : "Need practice"}`),
      "",
      "=== Round-wise checklist ===",
      formatChecklistAsText(entry?.checklist),
      "",
      "=== 7-day plan ===",
      formatPlanAsText(entry?.plan7Days),
      "",
      "=== 10 likely questions ===",
      formatQuestionsAsText(entry?.questions),
    ];
    const blob = new Blob([parts.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `placement-readiness-${entry?.company || "analysis"}-${entry?.id?.slice(-6) ?? "export"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [entry, liveScore, allSkills, skillConfidenceMap]);

  if (notFound && !entry) {
    return (
      <div className="space-y-6">
        <p className="text-slate-600">No analysis found. Run an analysis first.</p>
        <Link to="/dashboard/analyze" className="text-primary font-medium hover:underline">
          Go to Analyze
        </Link>
      </div>
    );
  }

  if (!entry) {
    return <p className="text-slate-600">Loading…</p>;
  }

  const { company, role, checklist, plan7Days, questions } = entry;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Analysis results</h2>
          <p className="mt-1 text-slate-600">
            {company && role ? `${role} at ${company}` : company || role || "Job description analysis"}
          </p>
        </div>
        <Link to="/dashboard/history" className="text-sm text-primary font-medium hover:underline">
          View history
        </Link>
      </div>

      {/* Company Intel – only when company was provided */}
      {entry.companyIntel && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Company intel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <p className="font-medium text-slate-900">{entry.companyIntel.companyName}</p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-slate-700">Industry:</span> {entry.companyIntel.industry}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-slate-700">Estimated size:</span> {entry.companyIntel.sizeLabel}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Typical hiring focus</p>
                <p className="text-sm text-slate-600">{entry.companyIntel.typicalHiringFocus}</p>
              </div>
              <p className="text-xs text-slate-500 italic">Demo Mode: Company intel generated heuristically.</p>
            </CardContent>
          </Card>

          {/* Round mapping – vertical timeline */}
          {entry.roundMapping?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Round mapping</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-0">
                  {entry.roundMapping.map((r, i) => (
                    <div key={r.roundTitle ?? i} className="flex gap-4 pb-6 last:pb-0">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center text-sm font-semibold text-primary">
                          {i + 1}
                        </div>
                        {i < entry.roundMapping.length - 1 && (
                          <div className="w-0.5 flex-1 min-h-[24px] bg-slate-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="font-medium text-slate-900">{r.roundTitle ?? r.title}</p>
                        <p className="text-sm text-slate-600 mt-1">{r.whyItMatters ?? r.whyMatters}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Round mapping only (no company) – still show if we have roundMapping */}
      {!entry.companyIntel && entry.roundMapping?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Round mapping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-0">
              {entry.roundMapping.map((r, i) => (
                <div key={r.roundTitle ?? i} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center text-sm font-semibold text-primary">
                      {i + 1}
                    </div>
                    {i < entry.roundMapping.length - 1 && (
                      <div className="w-0.5 flex-1 min-h-[24px] bg-slate-200 my-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="font-medium text-slate-900">{r.roundTitle ?? r.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{r.whyItMatters ?? r.whyMatters}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Readiness score (live) */}
      <Card>
        <CardHeader>
          <CardTitle>Readiness score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="hsl(245, 58%, 51%)"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - liveScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">{liveScore}</span>
              </div>
            </div>
            <p className="text-slate-600 text-sm">
              Base score {baseScore} (set at analysis). Final score updates with self-assessment (+2 per “I know”, −2 per “Need practice”). Clamped 0–100.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key skills extracted – interactive toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Key skills extracted</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-slate-500">No skills detected. General fresher stack assumed.</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {categories.map(([key, { label, skills }]) => (
                <div key={key}>
                  <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s) => {
                      const current = skillConfidenceMap[s] === "know" ? "know" : "practice";
                      return (
                        <div
                          key={s}
                          className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary"
                        >
                          <span>{s}</span>
                          <span className="text-slate-400">|</span>
                          <span className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => setSkillConfidence(s, "know")}
                              className={`rounded px-1.5 py-0.5 text-xs font-medium transition-colors ${
                                current === "know" ? "bg-primary text-white" : "hover:bg-primary/20"
                              }`}
                            >
                              I know this
                            </button>
                            <button
                              type="button"
                              onClick={() => setSkillConfidence(s, "practice")}
                              className={`rounded px-1.5 py-0.5 text-xs font-medium transition-colors ${
                                current === "practice" ? "bg-slate-600 text-white" : "hover:bg-slate-200"
                              }`}
                            >
                              Need practice
                            </button>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export tools */}
      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopyPlan}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
          >
            Copy 7-day plan
          </button>
          <button
            type="button"
            onClick={handleCopyChecklist}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
          >
            Copy round checklist
          </button>
          <button
            type="button"
            onClick={handleCopyQuestions}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
          >
            Copy 10 questions
          </button>
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
          >
            Download as TXT
          </button>
        </CardContent>
      </Card>

      {/* Round-wise checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Round-wise preparation checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(checklist || []).map(({ roundTitle, items }) => (
            <div key={roundTitle}>
              <p className="font-medium text-slate-900 mb-2">{roundTitle}</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
                {(items || []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 7-day plan */}
      <Card>
        <CardHeader>
          <CardTitle>7-day plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(plan7Days || []).map(({ day, focus, tasks }) => (
            <div key={day}>
              <p className="font-medium text-slate-900">
                {day}: {focus}
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm mt-1">
                {(tasks || []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 10 likely questions */}
      <Card>
        <CardHeader>
          <CardTitle>10 likely interview questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-slate-700">
            {(questions || []).map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Action Next */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Action next</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {top3Weak.length > 0 && (
            <p className="text-slate-700">
              <span className="font-medium text-slate-900">Top weak areas:</span>{" "}
              {top3Weak.join(", ")}
            </p>
          )}
          <p className="text-slate-700">
            <span className="font-medium text-slate-900">Suggested next step:</span> Start Day 1 plan now.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
