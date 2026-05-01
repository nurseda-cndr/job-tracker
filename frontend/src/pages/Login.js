import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("seeker");

  const login = async () => {
    const res = await fetch("http://localhost:5000/applications/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, role }),
    });

    const data = await res.json();

    // ❌ hata varsa
    if (!res.ok) {
      alert(data.error);
      return;
    }

    // Role metnindeki boşlukları temizle (DB'den boşluklu dönebilir)
    const safeRole = data.user.role ? data.user.role.trim().toLowerCase() : "";
    const safeUser = { ...data.user, role: safeRole };

    // ✅ SADECE BACKEND'DEN GELENİ KAYDET
    localStorage.setItem("user", JSON.stringify(safeUser));

    // ✅ ROLE GÖRE YÖNLENDİR
    if (safeRole === "employer") {
      window.location.href = "/employer";
    } else {
      window.location.href = "/home";
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #2c2c2c, #1a1a1a)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "40px",
          borderRadius: "15px",
          width: "320px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#2e7d32" }}>
          Giriş Yap
        </h2>

        <input
          placeholder="Kullanıcı adı"
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Şifre"
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
            backgroundColor: "white",
            cursor: "pointer",
          }}
        >
          <option value="seeker">İş Arayan (Seeker)</option>
          <option value="employer">İş Veren (Employer)</option>
        </select>

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#2e7d32",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1b5e20")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2e7d32")}
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );
}

export default Login;