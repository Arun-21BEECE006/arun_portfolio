import { useEffect, useState } from "react";
import { api, getToken, clearToken } from "../lib/api";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function Admin() {
  const [status, setStatus] = useState("checking"); // checking | authed | guest

  const checkToken = async () => {
    const token = getToken();
    if (!token) {
      setStatus("guest");
      return;
    }
    try {
      await api.verify();
      setStatus("authed");
    } catch {
      clearToken();
      setStatus("guest");
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-ink-900 grid place-items-center text-muted text-sm font-mono">
        Checking session…
      </div>
    );
  }

  if (status === "guest") {
    return <AdminLogin onSuccess={() => setStatus("authed")} />;
  }

  return <AdminDashboard onLogout={() => setStatus("guest")} />;
}
