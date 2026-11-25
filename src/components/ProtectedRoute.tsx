import type { ReactNode } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  if (!localStorage.getItem("token")) return <Navigate to="/login" />;
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <div>
      <header className="flex justify-between items-center bg-blue-600 text-white p-4">
        <span className="font-bold">MentoriaUTEC</span>
        <button onClick={logout} className="bg-white text-blue-600">
          Cerrar sesión
        </button>
      </header>
      <main className="max-w-3xl mx-auto p-4">{children}</main>
    </div>
  );
}
