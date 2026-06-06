import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) return null;

  const roleEmojis = {
  student: "🎓",
  supervisor: "🧑‍🏫",
  admin: "👔",};

  const emoji = roleEmojis[user.role] || "👤";

  const sections = {
    student: [
      ["Dashboard", "/student"],
      ["Weekly Logs", "/weeklylogs"],
      ["Submit Log", "/submitlog"],
      ["Internship", "/student/internshipdetails"],
      ["Feedback", "/student/feedback"],
      ["Student grades", "/admin/Studentgrades"],
    ],
    supervisor: [
      ["Dashboard", "/supervisor"],
      ["Assigned Students", "/supervisor/assigned-students"],
      ["Feedback", "/supervisor/feedback"],
    ],
    admin: [
      ["Dashboard", "/admin"],
      ["Users", "/admin/users"],
      ["Opportunities", "/admin/opportunities"],
      ["Reports", "/admin/reports"],
      ["Settings", "/admin/settings"],
      ["Status History", "/admin/Statushistory"],
    ],
  };
  const roleLabels = {
    student: "Student",
    supervisor: "Supervisor",
    admin: "Admin",
  };

  const currentRole = user.role?.toLowerCase();
  const roleLabel = roleLabels[currentRole] ?? "User";


  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sticky top-0 flex h-screen w-[290px] flex-col border-r border-slate-200 bg-white px-5 py-6">
      <div className="rounded-[30px] bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="mt-3 text-3xl font-black capitalize">
              {roleLabel}
            </h2>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl">
            {emoji}
          </div>
        </div>

      </div>

      <div className="mt-8 px-2 text-xs font-semibold uppercase tracking-[0.3rem] text-slate-400">
        Main Menu
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-2">
        {sections[user.role]?.map(([label, route]) => (
          <NavLink
            key={route}
            to={route}
            end
            className={({ isActive }) =>
              `group flex items-center rounded-2xl px-5 py-4 font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            <span className="h-2 w-2 rounded-full bg-current opacity-70"></span>
            <span className="ml-3">{label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-semibold text-slate-700 hover:bg-red-500 hover:text-white"
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
