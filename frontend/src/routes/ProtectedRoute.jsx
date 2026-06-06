import { Navigate } from "react-router-dom";

export const ROLES = {
  STUDENT: "student",
  WORKPLACE_SUPERVISOR: "workplace_supervisor",
  ACADEMIC_SUPERVISOR: "academic_supervisor",
  ADMIN: "internship_administrator",
};

function ProtectedRoute({ children, roles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (roles) {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(user.role)) {
      return <Navigate to={getDashboardByRole(user.role)} replace />;
    }
  }

  return children;
}

export function getDashboardByRole(role) {
  switch (role) {
    case ROLES.STUDENT:
      return "/student/dashboard";
    case ROLES.WORKPLACE_SUPERVISOR:
      return "/workplace-supervisor/dashboard";
    case ROLES.ACADEMIC_SUPERVISOR:
      return "/academic-supervisor/dashboard";
    case ROLES.ADMIN:
      return "/admin/dashboard";
    default:
      return "/";
  }
}

export default ProtectedRoute;