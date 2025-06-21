import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";

const App = () => {
  // Verifica se o usuário está logado (exemplo: verifica se há um token no localStorage)
  const isAuthenticated = !!localStorage.getItem("accessToken");

  return (
    <Routes>
      {/* Bloqueia usuários logados de acessarem /auth */}
      <Route path="auth/*" element={isAuthenticated ? <Navigate to="/admin/principal" replace /> : <AuthLayout />} />

      {/* Bloqueia usuários não logados de acessarem /admin */}
      <Route path="admin/*" element={isAuthenticated ? <AdminLayout /> : <Navigate to="/auth/sign-in" replace />} />


      {/* Redireciona a raiz para o Admin se logado, senão para Login */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/admin" : "/auth/sign-in"} replace />} />
    </Routes>
  );
};

export default App;
