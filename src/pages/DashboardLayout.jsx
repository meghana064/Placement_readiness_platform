import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  ClipboardList,
  BookOpen,
  User,
  Search,
  History,
  CheckSquare,
  Ship,
  FileCheck,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/practice", icon: Code2, label: "Practice" },
  { to: "/dashboard/assessments", icon: ClipboardList, label: "Assessments" },
  { to: "/dashboard/resources", icon: BookOpen, label: "Resources" },
  { to: "/dashboard/analyze", icon: Search, label: "Analyze JD" },
  { to: "/dashboard/history", icon: History, label: "History" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
  { to: "/prp/07-test", icon: CheckSquare, label: "Test" },
  { to: "/prp/08-ship", icon: Ship, label: "Ship" },
  { to: "/prp/proof", icon: FileCheck, label: "Proof" },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <nav className="p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "hover:bg-slate-100"
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex-shrink-0 px-6 flex items-center justify-between bg-white border-b border-slate-200">
          <h1 className="text-lg font-semibold text-slate-900">
            Placement Prep
          </h1>
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
