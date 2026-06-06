import { Link } from "react-router-dom";
import DashboardLayout from "../../Components/DashboardLayout";

function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-100">ADMINISTRATOR CONTROL</h2>
          <p className="mt-2 text-sm text-gray-100">
            To view all the users(students and supervisors, click the buttton below. 
            You can also assign students to supervisors from the users page.)
          </p>
          <Link
            to="/admin/users"
            className="mt-5 inline-flex rounded-lg bg-white/15 backdrop-blur-md px-4 py-2 font-semibold text-white transition hover:bg-red-800"
          >
            Go to Users Page
          </Link>
        </div>

        <div className="rounded-xl border border-red-100 bg-gradient-to-r from-indigo-600 to-blue-500 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-red-100">WORKFLOW ASSIGNMENT</h2>
          <p className="mt-2 text-sm text-red-100">
            The administrator dashboard allows you to assign the students to the right supervisors. 
            You can view all the students and supervisors in the users page, and assign students to supervisors from there.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;