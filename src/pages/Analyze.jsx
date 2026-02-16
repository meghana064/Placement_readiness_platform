import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { extractSkills } from "../lib/skills";
import { getChecklist } from "../lib/checklist";
import { getPlan } from "../lib/plan";
import { getQuestions } from "../lib/questions";
import { getReadinessScore } from "../lib/readinessScore";
import { getCompanyIntel } from "../lib/companyIntel";
import { getRoundMapping } from "../lib/roundMapping";
import { toFlatSkills, getDefaultSkills } from "../lib/analysisSchema";
import { saveAnalysis } from "../lib/history";

const JD_MIN_LENGTH = 200;

export default function Analyze() {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);

  const jdTooShort = jdText.trim().length > 0 && jdText.trim().length < JD_MIN_LENGTH;

  function handleSubmit(e) {
    e.preventDefault();
    if (!jdText?.trim()) return;
    setLoading(true);

    let extractedSkills = extractSkills(jdText);
    if (!extractedSkills.hasAny) {
      extractedSkills.byCategory = { other: { label: "Other", skills: ["Communication", "Problem solving", "Basic coding", "Projects"] } };
      extractedSkills.hasAny = true;
    }

    const plan = getPlan(extractedSkills);
    const checklist = getChecklist(extractedSkills);
    const questions = getQuestions(extractedSkills);
    const baseScore = getReadinessScore(company, role, jdText, extractedSkills);

    const flatSkills = toFlatSkills(extractedSkills.byCategory);
    const hasAnySkill = Object.keys(flatSkills).some((k) => flatSkills[k].length > 0);
    const extractedSkillsCanonical = hasAnySkill ? flatSkills : getDefaultSkills();

    const companyIntel = company?.trim() ? getCompanyIntel(company, jdText) : null;
    const roundMappingRaw = companyIntel
      ? getRoundMapping(companyIntel.size, extractedSkills)
      : getRoundMapping("startup", extractedSkills);
    const roundMapping = roundMappingRaw.map((r) => ({
      roundTitle: r.roundTitle ?? r.title ?? r.round,
      focusAreas: r.focusAreas ?? [r.title ?? r.round],
      whyItMatters: r.whyItMatters ?? r.whyMatters ?? "",
    }));

    const checklistCanonical = checklist.map((c) => ({ roundTitle: c.round, items: c.items ?? [] }));
    const plan7Days = plan.map((p) => ({ day: p.day, focus: p.title, tasks: p.items ?? [] }));

    const saved = saveAnalysis({
      company,
      role,
      jdText: jdText.trim(),
      extractedSkills: extractedSkillsCanonical,
      roundMapping,
      checklist: checklistCanonical,
      plan7Days,
      questions,
      baseScore,
      readinessScore: baseScore,
      skillConfidenceMap: {},
      finalScore: baseScore,
      companyIntel,
    });

    setLoading(false);
    navigate(`/dashboard/results?id=${saved.id}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Analyze Job Description</h2>
        <p className="mt-1 text-slate-600">
          Paste a JD to extract skills, get a readiness score, and a tailored prep plan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1">
                Company (optional)
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full max-w-md rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g. Google, Microsoft"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">
                Role (optional)
              </label>
              <input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full max-w-md rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g. SDE 1, Frontend Developer"
              />
            </div>
            <div>
              <label htmlFor="jd" className="block text-sm font-medium text-slate-700 mb-1">
                Job description text <span className="text-slate-500 font-normal">(required)</span>
              </label>
              <textarea
                id="jd"
                rows={12}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                required
                minLength={1}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y min-h-[200px]"
                placeholder="Paste the full job description here..."
              />
              {jdTooShort && (
                <p className="mt-1.5 text-sm text-amber-700">
                  This JD is too short to analyze deeply. Paste full JD for better output.
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg font-medium text-white bg-primary hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Analyzing…" : "Analyze"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
