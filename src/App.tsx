import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { getMe, type MeResponse } from "./services/api";
import { getToken, removeToken } from "./services/auth";
import Register from "./pages/Register";
import Redemption from "./pages/Redemption";
import Admin from "./pages/Admin";

function App() {
  const [customer, setCustomer] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [showRedemption, setShowRedemption] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  async function loadSession() {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getMe(token);
      setCustomer(response);
    } catch {
      removeToken();
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (window.location.pathname === "/admin") {
      setShowAdmin(true);
      setLoading(false);
      return;
    }

    loadSession();
  }, []);

  function handleLogout() {
    removeToken();
    setCustomer(null);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdf8]">
        <div className="text-center">
          <div className="text-4xl">☕</div>

          <p className="mt-3 font-semibold text-[#3b2418]">Cargando...</p>
        </div>
      </main>
    );
  }

  if (showAdmin) {
    return <Admin onBack={() => setShowAdmin(false)} />;
  }

  if (!customer) {
    if (showRegister) {
      return (
        <Register
          onRegister={loadSession}
          onLogin={() => setShowRegister(false)}
        />
      );
    }

    return (
      <Login onLogin={loadSession} onRegister={() => setShowRegister(true)} />
    );
  }
  
  if (showRedemption) {
    return (
      <Redemption
        onBack={() => {
          setShowRedemption(false);
          loadSession();
        }}
      />
    );
  }

  return (
    <Home
      customer={customer}
      onRedeem={() => setShowRedemption(true)}
      onLogout={handleLogout}
    />
  );
}

export default App;
