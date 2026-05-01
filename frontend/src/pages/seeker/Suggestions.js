import { useState } from "react";
import { Sparkles, Briefcase, Award, TrendingUp, Compass, Loader2, Send } from "lucide-react";

function Suggestions() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    skills: "",
    experience: "",
    interests: ""
  });
  const [suggestion, setSuggestion] = useState(null);

  const getSuggestions = async () => {
    if (!profile.skills) {
      alert("Lütfen yeteneklerinizi belirtin.");
      return;
    }

    setLoading(true);
    setSuggestion(null);

    try {
      // Önce profili kaydet
      await fetch("http://localhost:5000/applications/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      // AI önerileri al
      const res = await fetch("http://localhost:5000/applications/ai-suggestions");
      const data = await res.json();
      
      setSuggestion(data.suggestions);
    } catch (err) {
      console.error(err);
      alert("Öneriler alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ color: "#0f172a", fontSize: "1.75rem", fontWeight: "800", margin: 0, display: "flex", alignItems: "center", gap: "12px" }}>
          <Compass size={32} color="#3b82f6" /> AI Kariyer Danışmanı
        </h1>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "1rem" }}>Profilinize uygun kariyer yollarını ve fırsatları keşfedin</p>
      </div>

      <div style={{ display: "grid", gap: "30px" }}>
        {/* PROFILE FORM */}
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "1.1rem", color: "#1e293b", fontWeight: "700" }}>Profil Bilgileriniz</h3>
          <div style={{ display: "grid", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Yetenekler</label>
              <textarea
                placeholder="Örn: React, Node.js, Project Management, SQL..."
                value={profile.skills}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                style={textareaStyle}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={labelStyle}>Deneyim Seviyesi</label>
                <input
                  placeholder="Örn: 3 Yıl Frontend tecrübesi"
                  value={profile.experience}
                  onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>İlgi Alanları</label>
                <input
                  placeholder="Örn: FinTech, E-ticaret, AI"
                  value={profile.interests}
                  onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>
            <button 
              onClick={getSuggestions} 
              disabled={loading}
              style={actionBtnStyle(loading)}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Analiz Ediliyor...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Önerileri Oluştur
                </>
              )}
            </button>
          </div>
        </div>

        {/* SUGGESTIONS DISPLAY */}
        {suggestion && (
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px", color: "#3b82f6" }}>
              <Sparkles size={24} />
              <h2 style={{ fontSize: "1.25rem", color: "#1e293b", margin: 0, fontWeight: "700" }}>Size Özel Kariyer Tavsiyeleri</h2>
            </div>
            
            <div style={suggestionBoxStyle}>
              {suggestion.split("\n").map((line, i) => {
                if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
                  return (
                    <div key={i} style={listItemStyle}>
                      <div style={bulletStyle} />
                      <span style={{ color: "#475569" }}>{line.replace(/^[-*]\s*/, "")}</span>
                    </div>
                  );
                }
                if (line.trim() === "") return <div key={i} style={{ height: "10px" }} />;
                return (
                  <p key={i} style={{ margin: "5px 0", color: "#1e293b", lineHeight: "1.6", fontWeight: line.includes(":") ? "700" : "400" }}>
                    {line}
                  </p>
                );
              })}
            </div>

            <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
              <div style={statCardStyle}>
                <Briefcase size={20} color="#3b82f6" />
                <div style={statLabelStyle}>Uygun Roller</div>
                <div style={statValueStyle}>Analiz Edildi</div>
              </div>
              <div style={statCardStyle}>
                <TrendingUp size={20} color="#10b981" />
                <div style={statLabelStyle}>Pazar Trendi</div>
                <div style={statValueStyle}>Yüksek</div>
              </div>
              <div style={statCardStyle}>
                <Award size={20} color="#f59e0b" />
                <div style={statLabelStyle}>Gelişim</div>
                <div style={statValueStyle}>Sürekli</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* STYLES */

const cardStyle = {
  background: "white",
  padding: "32px",
  borderRadius: "24px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
  border: "1px solid #f1f5f9"
};

const labelStyle = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: "700",
  color: "#64748b",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const textareaStyle = {
  width: "100%",
  height: "100px",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  fontSize: "0.95rem",
  outline: "none",
  resize: "none",
  boxSizing: "border-box"
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  fontSize: "0.95rem",
  outline: "none",
  boxSizing: "border-box"
};

const actionBtnStyle = (disabled) => ({
  width: "100%",
  padding: "16px",
  backgroundColor: disabled ? "#94a3b8" : "#0f172a",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "1rem",
  fontWeight: "700",
  cursor: disabled ? "not-allowed" : "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  marginTop: "10px"
});

const suggestionBoxStyle = {
  background: "#f8fafc",
  padding: "25px",
  borderRadius: "16px",
  border: "1px solid #f1f5f9"
};

const listItemStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "8px",
  fontSize: "0.95rem"
};

const bulletStyle = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  backgroundColor: "#3b82f6",
  marginTop: "8px",
  flexShrink: 0
};

const statCardStyle = {
  background: "white",
  padding: "15px",
  borderRadius: "16px",
  border: "1px solid #f1f5f9",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "5px"
};

const statLabelStyle = {
  fontSize: "0.75rem",
  color: "#64748b",
  fontWeight: "600"
};

const statValueStyle = {
  fontSize: "0.9rem",
  fontWeight: "800",
  color: "#1e293b"
};

export default Suggestions;