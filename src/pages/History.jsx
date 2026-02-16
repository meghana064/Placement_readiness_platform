import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { getAllHistory } from "../lib/history";

export default function History() {
  const { entries, corruptedCount } = getAllHistory();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Analysis history</h2>
        <p className="mt-1 text-slate-600">
          Past analyses are saved here. Click one to view full results.
        </p>
      </div>

      {corruptedCount > 0 && (
        <p className="text-sm text-amber-700">
          One saved entry couldn&apos;t be loaded. Create a new analysis.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Saved analyses</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-slate-500">No analyses yet. Run one from Analyze.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {entries.map((e) => (
                <li key={e.id}>
                  <Link
                    to={`/dashboard/results?id=${e.id}`}
                    className="flex flex-wrap items-center justify-between gap-2 py-4 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div>
                      <span className="font-medium text-slate-900">
                        {e.company || "—"} · {e.role || "—"}
                      </span>
                      <span className="text-slate-500 text-sm ml-2">
                        {new Date(e.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary">
                      Score: {e.finalScore}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Link to="/dashboard/analyze" className="inline-block text-primary font-medium hover:underline">
        New analysis
      </Link>
    </div>
  );
}
