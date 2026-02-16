import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import {
  getSteps,
  setStep,
  getSubmission,
  setSubmission,
  isShipped,
  validateUrl,
  STEP_IDS,
  STEP_LABELS,
} from "../lib/proofSubmission";
import { allPassed } from "../lib/testChecklist";

const SUBMISSION_TEMPLATE = (lovable, github, deployed) => `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${lovable}
GitHub Repository: ${github}
Live Deployment: ${deployed}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`;

export default function Proof() {
  const [steps, setStepsState] = useState(getSteps());
  const [sub, setSubState] = useState(getSubmission());
  const [errors, setErrors] = useState({ lovableUrl: "", githubUrl: "", deployedUrl: "" });

  const shipped = isShipped(allPassed);

  const handleStepToggle = useCallback((stepId, completed) => {
    setStepsState(setStep(stepId, completed));
  }, []);

  const handleSubmissionChange = useCallback((field, value) => {
    const next = { ...sub, [field]: value };
    setSubState(next);
    setSubmission(next);
    const result = validateUrl(value);
    setErrors((e) => ({ ...e, [field]: result.valid ? "" : result.message }));
  }, [sub]);

  const handleBlur = useCallback((field) => {
    const value = sub[field];
    const result = validateUrl(value);
    setErrors((e) => ({ ...e, [field]: result.valid ? "" : result.message }));
  }, [sub]);

  useEffect(() => {
    setStepsState(getSteps());
    setSubState(getSubmission());
  }, []);

  const handleCopyFinalSubmission = useCallback(() => {
    const lovable = sub.lovableUrl || "(not set)";
    const github = sub.githubUrl || "(not set)";
    const deployed = sub.deployedUrl || "(not set)";
    const text = SUBMISSION_TEMPLATE(lovable, github, deployed);
    navigator.clipboard.writeText(text);
  }, [sub]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-slate-900">Proof & submission</h1>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-sm font-medium ${
                shipped ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-700"
              }`}
            >
              {shipped ? "Shipped" : "In Progress"}
            </span>
            <Link to="/prp/07-test" className="text-sm text-primary font-medium hover:underline">
              Test
            </Link>
            <Link to="/prp/08-ship" className="text-sm text-primary font-medium hover:underline">
              Ship
            </Link>
          </div>
        </div>

        {shipped && (
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="pt-6">
              <p className="text-slate-800 font-medium">You built a real product.</p>
              <p className="text-slate-700 mt-1">Not a tutorial. Not a clone.</p>
              <p className="text-slate-700">A structured tool that solves a real problem.</p>
              <p className="text-slate-800 font-medium mt-2">This is your proof of work.</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Step completion overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {STEP_IDS.map((id, i) => (
              <label key={id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={!!steps[id]}
                  onChange={(e) => handleStepToggle(id, e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-slate-900 font-medium">
                  {STEP_LABELS[i]}
                </span>
                <span className="text-sm text-slate-500">
                  {steps[id] ? "Completed" : "Pending"}
                </span>
              </label>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Artifact inputs (required for Ship status)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="lovable" className="block text-sm font-medium text-slate-700 mb-1">
                Lovable Project Link
              </label>
              <input
                id="lovable"
                type="url"
                value={sub.lovableUrl}
                onChange={(e) => handleSubmissionChange("lovableUrl", e.target.value)}
                onBlur={() => handleBlur("lovableUrl")}
                placeholder="https://..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.lovableUrl && (
                <p className="mt-1 text-sm text-amber-700">{errors.lovableUrl}</p>
              )}
            </div>
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-slate-700 mb-1">
                GitHub Repository Link
              </label>
              <input
                id="github"
                type="url"
                value={sub.githubUrl}
                onChange={(e) => handleSubmissionChange("githubUrl", e.target.value)}
                onBlur={() => handleBlur("githubUrl")}
                placeholder="https://github.com/..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.githubUrl && (
                <p className="mt-1 text-sm text-amber-700">{errors.githubUrl}</p>
              )}
            </div>
            <div>
              <label htmlFor="deployed" className="block text-sm font-medium text-slate-700 mb-1">
                Deployed URL
              </label>
              <input
                id="deployed"
                type="url"
                value={sub.deployedUrl}
                onChange={(e) => handleSubmissionChange("deployedUrl", e.target.value)}
                onBlur={() => handleBlur("deployedUrl")}
                placeholder="https://..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.deployedUrl && (
                <p className="mt-1 text-sm text-amber-700">{errors.deployedUrl}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Final submission export</CardTitle>
          </CardHeader>
          <CardContent>
            <button
              type="button"
              onClick={handleCopyFinalSubmission}
              className="px-4 py-2 rounded-lg font-medium text-white bg-primary hover:opacity-90 transition-opacity"
            >
              Copy Final Submission
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
