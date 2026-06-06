import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Authentication/login";
import Signup from "../pages/Authentication/Signup";
import UserFeedback from "../pages/Student/UserFeedback";
import StudentDashboard from "../pages/Student/StudentDashboard";
import SupervisorDashboard from "../pages/Supervisor/SupervisorDashboard";
import AssignedStudents from "../pages/Supervisor/AssignedStudents";
import SupervisorEvaluation from "../pages/Supervisor/SupervisorEvaluation";
import AdminDashboard from "../pages/Administrator/AdminDashboard";
import Users from "../pages/Administrator/Users";
import SubmitLog from "../pages/Student/SubmitLog";
import WeeklyLogs from "../pages/Student/WeeklyLogs";
import InternshipDetails from "../pages/Student/InternshipDetails";
import Opportunities from "../pages/Administrator/Opportunities";
import Reports from "../pages/Administrator/Reports";
import Settings from "../pages/Administrator/Settings";
import ProtectedRoute from "./ProtectedRoute";
import StatusHistory from "../pages/Administrator/Statushistory";
import StudentGrades from "../pages/Student/StudentGrades";
import { getRoleRoute } from "../utils/roleRoutes";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={user ? getRoleRoute(user.role) : "/login"} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/weeklylogs" element={<ProtectedRoute requiredRole="student"><WeeklyLogs /></ProtectedRoute>} />
        <Route path="/submitlog" element={<ProtectedRoute requiredRole="student"><SubmitLog /></ProtectedRoute>} />
        <Route path="/submitlog/:draftId" element={<ProtectedRoute requiredRole="student"><SubmitLog /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/supervisor" element={<ProtectedRoute requiredRole="supervisor"><SupervisorDashboard /></ProtectedRoute>} />
        <Route path="/supervisor/assigned-students" element={<ProtectedRoute requiredRole="supervisor"><AssignedStudents /></ProtectedRoute>} />
        <Route path="/supervisor/feedback" element={<ProtectedRoute requiredRole="supervisor"><SupervisorEvaluation /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><Users /></ProtectedRoute>} />
        <Route path="/student/feedback" element={<ProtectedRoute requiredRole="student"><UserFeedback /></ProtectedRoute>} />
        <Route path="/student/internshipdetails" element={<ProtectedRoute requiredRole="student"><InternshipDetails /></ProtectedRoute>} />
        <Route path="/admin/opportunities" element={<ProtectedRoute requiredRole="admin"><Opportunities /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin"><Reports /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><Settings /></ProtectedRoute>} />
        <Route path="/admin/statushistory" element={<StatusHistory />} />
        <Route path="/student/studentgrades" element={<StudentGrades />}/>
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
