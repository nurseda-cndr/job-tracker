import { useState } from "react";
import { Search, Loader2, CheckCircle, AlertCircle, Zap, ShieldCheck } from "lucide-react";

function JobAnalyzer() {
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeJob = async () => {
    if (!jobText.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/applications/analyze-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobText }),
      });

      const data = await res.json();
      try {
        setResult(JSON.parse(data.result));
      } catch {
        setResult({ advice: data.result, score: 0 }); // Fallback
      }
    } catch (err) {
      console.error(err);
      alert("Analiz sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ color: "#0f172a", fontSize: "1.75rem", fontWeight: "800", margin: 0, display: "flex", alignItems: "center", gap: "12px" }}>
          <ShieldCheck size={32} color="#3b82f6" /> Akıllı İş Analizi
        </h1>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "1rem" }}>İş ilanını analiz edin ve profilinizle uyumunu ölçün</p>
      </div>

      <div style={{ display: "grid", gap: "30px" }}>
        {/* INPUT CARD */}
        <div style={cardStyle}>
          <label style={labelStyle}>İş İlanı Detayları</label>
          <textarea
            placeholder="İş tanımını, gereksinimleri ve beklentileri buraya yapıştırın..."
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            style={textareaStyle}
          />
          <button 
            onClick={analyzeJob} 
            disabled={loading || !jobText.trim()}
            style={actionBtnStyle(loading || !jobText.trim())}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                İlan Analiz Ediliyor...
              </>
            ) : (
              <>
                <Search size={18} />
                İlanı Analiz Et
              </>
            )}
          </button>
        </div>

        {/* RESULT CARD */}
        {result && (
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px" }}>
              <h2 style={{ fontSize: "1.25rem", color: "#1e293b", margin: 0, fontWeight: "700" }}>Analiz Özeti</h2>
              {result.score > 0 && (
                <div style={scoreBadgeStyle(result.score)}>
                  <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>UYUM SKORU</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "900" }}>%{result.score}</div>
                </div>
              )}
            </div>

            <div style={{ display: "grid", gap: "25px" }}>
              {result.matching_skills?.length > 0 && (
                <section>
                  <div style={sectionHeaderStyle("#10b981")}>
                    <CheckCircle size={18} /> Eşleşen Yetenekler
                  </div>
                  <div style={listContainerStyle}>
                    {result.matching_skills.map((s, i) => (
                      <div key={i} style={listItemStyle}>
                        <CheckCircle size={16} color="#10b981" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {result.missing_skills?.length > 0 && (
                <section>
                  <div style={sectionHeaderStyle("#ef4444")}>
                    <AlertCircle size={18} /> Eksik Yetenekler
                  </div>
                  <div style={listContainerStyle}>
                    {result.missing_skills.map((s, i) => (
                      <div key={i} style={listItemStyle}>
                        <AlertCircle size={16} color="#ef4444" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <div style={sectionHeaderStyle("#3b82f6")}>
                  <Zap size={18} /> Stratejik Tavsiyeler
                </div>
                <div style={adviceBoxStyle}>
                  {result.advice}
                </div>
              </section>
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
  color: "#334155",
  marginBottom: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const textareaStyle = {
  width: "100%",
  height: "200px",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  fontSize: "0.95rem",
  outline: "none",
  resize: "none",
  boxSizing: "border-box",
  lineHeight: "1.6"
};

const actionBtnStyle = (disabled) => ({
  width: "100%",
  padding: "16px",
  backgroundColor: disabled ? "#94a3b8" : "#3b82f6",
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
  marginTop: "20px",
  transition: "all 0.2s"
});

const scoreBadgeStyle = (score) => {
  const color = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  return {
    background: color,
    color: "white",
    padding: "12px 20px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: `0 8px 20px ${color}44`
  };
};

const sectionHeaderStyle = (color) => ({
  fontSize: "0.85rem",
  fontWeight: "800",
  color: color,
  textTransform: "uppercase",
  letterSpacing: "1px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "15px"
});

const listContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px"
};

const listItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "0.85rem",
  color: "#475569",
  background: "#f8fafc",
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #f1f5f9"
};

const adviceBoxStyle = {
  padding: "20px",
  background: "#f0f9ff",
  color: "#0c4a6e",
  borderRadius: "16px",
  lineHeight: "1.6",
  fontSize: "0.95rem",
  borderLeft: "4px solid #3b82f6"
};

export default JobAnalyzer;