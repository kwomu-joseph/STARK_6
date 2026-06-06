import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../context/AuthContext";

function DashboardLayout({ title, children }) {
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-800">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-10">
        <div className="dashboard-card mb-8 flex flex-col gap-6 border-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-500 p-8 text-white shadow-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35rem] text-indigo-100">
              INTERNSHIP LOGGING AND EVALUATION SYSTEM
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-white/15 px-5 py-4 backdrop-blur-md">
              <p className="text-xs uppercase tracking-wider text-indigo-100">Logged in as</p>
              <p className="mt-1 text-lg font-semibold capitalize text-white">
                {user?.name || user?.username}
              </p>
            </div>
            <NotificationBell />
          </div>
        </div>

        <div className="space-y-6">{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;