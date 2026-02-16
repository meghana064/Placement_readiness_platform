import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/Card";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const SKILL_DATA = [
  { subject: "DSA", value: 75, fullMark: 100 },
  { subject: "System Design", value: 60, fullMark: 100 },
  { subject: "Communication", value: 80, fullMark: 100 },
  { subject: "Resume", value: 85, fullMark: 100 },
  { subject: "Aptitude", value: 70, fullMark: 100 },
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ACTIVE_DAYS = [0, 1, 2, 3]; // Mon–Thu have activity

const ASSESSMENTS = [
  { title: "DSA Mock Test", when: "Tomorrow, 10:00 AM" },
  { title: "System Design Review", when: "Wed, 2:00 PM" },
  { title: "HR Interview Prep", when: "Friday, 11:00 AM" },
];

function OverallReadiness() {
  const score = 72;
  const max = 100;
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score / max);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Readiness</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-200"
            />
            <circle
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="text-primary transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-slate-900">{score}</span>
            <span className="text-sm text-slate-500 mt-0.5">Readiness Score</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkillBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={SKILL_DATA}>
              <PolarGrid />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 12, fill: "rgb(71, 85, 105)" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "rgb(148, 163, 184)" }}
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="hsl(245, 58%, 51%)"
                fill="hsl(245, 58%, 51%)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function ContinuePractice() {
  const completed = 3;
  const total = 10;
  const pct = (completed / total) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Practice</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-medium text-slate-900">Dynamic Programming</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-sm text-slate-600 whitespace-nowrap">
            {completed}/{total} completed
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <button
          type="button"
          className="px-4 py-2 rounded-lg font-medium text-white bg-primary hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </CardFooter>
    </Card>
  );
}

function WeeklyGoals() {
  const solved = 12;
  const target = 20;
  const pct = (solved / target) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-700">
            Problems Solved: {solved}/{target} this week
          </p>
          <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          {WEEK_DAYS.map((day, i) => (
            <div
              key={day}
              className="flex flex-col items-center flex-1 min-w-0"
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex-shrink-0 ${
                  ACTIVE_DAYS.includes(i)
                    ? "bg-primary border-primary"
                    : "border-slate-200 bg-slate-50"
                }`}
              />
              <span className="text-xs text-slate-500 mt-1 truncate w-full text-center">
                {day}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingAssessments() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Upcoming Assessments</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {ASSESSMENTS.map((item) => (
            <li
              key={item.title}
              className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-slate-100 last:border-0 last:pb-0 first:pt-0"
            >
              <span className="font-medium text-slate-900">{item.title}</span>
              <span className="text-sm text-slate-500">{item.when}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
        <p className="mt-1 text-slate-600">
          Welcome to your placement prep dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OverallReadiness />
        <SkillBreakdown />
        <ContinuePractice />
        <WeeklyGoals />
        <UpcomingAssessments />
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <Link
                to="/dashboard/analyze"
                className="inline-flex items-center px-4 py-2 rounded-lg font-medium text-white bg-primary hover:opacity-90 transition-opacity"
              >
                Analyze a Job Description
              </Link>
              <Link
                to="/dashboard/history"
                className="inline-flex items-center px-4 py-2 rounded-lg font-medium border border-slate-200 text-slate-700 hover:border-primary hover:text-primary transition-colors"
              >
                View analysis history
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
