import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children?: React.ReactNode;
}) {
  const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return children ? children : <Outlet />;
}