import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { getChecklist, setChecklistItem, TEST_IDS } from "../lib/testChecklist";

const TESTS = [
  { id: TEST_IDS[0], label: "JD required validation works", hint: "Submit Analyze with empty JD; form should not submit or should show validation." },
  { id: TEST_IDS[1], label: "Short JD warning shows for <200 chars", hint: "Enter 1–199 characters in JD; the short-JD warning message should appear." },
  { id: TEST_IDS[2], label: "Skills extraction groups correctly", hint: "Paste a JD with DSA, React, SQL; Results should show skills grouped by category." },
  { id: TEST_IDS[3], label: "Round mapping changes based on company + skills", hint: "Analyze with company 'Amazon' + DSA vs company 'Startup' + React; round mapping should differ." },
  { id: TEST_IDS[4], label: "Score calculation is deterministic", hint: "Same JD + company + role should yield same base score on re-analyze." },
  { id: TEST_IDS[5], label: "Skill toggles update score live", hint: "On Results, toggle a skill to 'I know this'; score should increase by 2 immediately." },
  { id: TEST_IDS[6], label: "Changes persist after refresh", hint: "Toggle skills on Results, refresh page, reopen from History; toggles and score should be unchanged." },
  { id: TEST_IDS[7], label: "History saves and loads correctly", hint: "Run an analysis, open History; entry appears. Click it; Results show the same analysis." },
  { id: TEST_IDS[8], label: "Export buttons copy the correct content", hint: "Use Copy 7-day plan, Copy checklist, Copy questions; paste elsewhere and verify content." },
  { id: TEST_IDS[9], label: "No console errors on core pages", hint: "Open Landing, Dashboard, Analyze, Results, History; check DevTools Console for errors." },
];

export default function TestChecklist() {
  const [state, setState] = useState(getChecklist());

  const passedCount = TESTS.filter((t) => state[t.id]).length;
  const total = TESTS.length;
  const allPassed = passedCount === total;

  const handleToggle = useCallback((id, checked) => {
    const next = setChecklistItem(id, checked);
    setState(next);
  }, []);

  useEffect(() => {
    setState(getChecklist());
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-slate-900">Test checklist</h1>
          <Link
            to="/prp/08-ship"
            className="text-sm font-medium text-primary hover:underline"
          >
            Go to Ship →
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tests Passed: {passedCount} / {total}</CardTitle>
            {!allPassed && (
              <p className="text-sm text-amber-700 mt-1">Fix issues before shipping.</p>
            )}
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Placement Readiness tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {TESTS.map(({ id, label, hint }) => (
              <label
                key={id}
                className="flex gap-3 items-start cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={!!state[id]}
                  onChange={(e) => handleToggle(id, e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-slate-900 group-hover:text-slate-700">
                    {label}
                  </span>
                  {hint && (
                    <p className="text-sm text-slate-500 mt-0.5">How to test: {hint}</p>
                  )}
                </div>
              </label>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
