import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace/>;
}