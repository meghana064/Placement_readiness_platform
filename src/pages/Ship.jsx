import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { allPassed, resetChecklist } from "../lib/testChecklist";
import { Lock } from "lucide-react";

export default function Ship() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(allPassed());
  }, []);

  const handleReset = () => {
    resetChecklist();
    setUnlocked(false);
    window.location.href = "/prp/07-test";
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-lg mx-auto space-y-6">
          <h1 className="text-2xl font-semibold text-slate-900">Ship</h1>
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <div className="flex items-center gap-2 text-amber-800">
                <Lock className="w-5 h-5 flex-shrink-0" />
                <CardTitle className="text-amber-900">Locked</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-700">
                Complete all 10 tests on the Test checklist before shipping.
              </p>
              <Link
                to="/prp/07-test"
                className="inline-flex items-center font-medium text-primary hover:underline"
              >
                Go to Test checklist →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-slate-900">Ship</h1>
        <Card>
          <CardHeader>
            <CardTitle>Ready to ship</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">
              All tests passed. You can ship.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Reset checklist
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
