import { Link } from "react-router-dom";
import { Code2, Video, BarChart3 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Hero */}
      <header className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
          Ace Your Placement
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-xl">
          Practice, assess, and prepare for your dream job
        </p>
        <Link
          to="/dashboard"
          className="mt-8 inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-white bg-primary hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
      </header>

      {/* Features grid */}
      <section className="px-6 py-16 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Code2 className="w-6 h-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Practice Problems
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Solve curated problems and strengthen your coding skills.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Video className="w-6 h-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Mock Interviews
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Simulate real interviews with timed sessions and feedback.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Track Progress
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Monitor your growth with clear metrics and insights.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-200">
        © {new Date().getFullYear()} Placement Readiness Platform. All rights reserved.
      </footer>
    </div>
  );
}
