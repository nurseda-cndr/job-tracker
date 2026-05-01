import { useState } from "react";
import { FileText, Upload, CheckCircle, AlertTriangle, Loader2, Sparkles, Target, Zap, Lightbulb } from "lucide-react";

function CV() {
  const [file, setFile] = useState(null);
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const analyzeCV = async () => {
    if (!file) {
      setError("Lütfen bir CV dosyası seçin.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("jobText", jobText);

    try {
      const res = await fetch("http://localhost:5000/applications/upload-cv", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Sunucu hatası");
      }

      setResult(data.result);
    } catch (err) {
      console.error(err);
      setError("Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ color: "#0f172a", fontSize: "1.75rem", fontWeight: "800", margin: 0, display: "flex", alignItems: "center", gap: "12px" }}>
          <FileText size={32} color="#3b82f6" /> AI Destekli CV Analizi
        </h1>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "1rem" }}>Özgeçmişinizi iş ilanlarına göre optimize edin</p>
      </div>

      <div style={{ display: "grid", gap: "30px" }}>
        {/* INPUT SECTION */}
        <div style={card}>
          <div style={{ marginBottom: "25px" }}>
            <label style={label}>1. CV Dosyanızı Yükleyin (.pdf)</label>
            <div style={uploadZone(file)}>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={fileInput}
                id="cv-upload"
              />
              <label htmlFor="cv-upload" style={uploadLabel}>
                <Upload size={32} color={file ? "#10b981" : "#94a3b8"} style={{ marginBottom: "12px" }} />
                <div style={{ fontWeight: "600", color: file ? "#10b981" : "#475569" }}>
                  {file ? file.name : "Dosyayı seçmek için tıklayın"}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "4px" }}>
                  Sadece PDF formatı desteklenir
                </div>
              </label>
            </div>
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={label}>2. Hedef İş İlanı Açıklaması (Opsiyonel)</label>
            <textarea
              placeholder="Analiz için hedeflediğiniz iş ilanını buraya yapıştırabilirsiniz..."
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              style={textarea}
            />
          </div>

          <button 
            onClick={analyzeCV} 
            disabled={loading || !file}
            style={analyzeBtn(loading || !file)}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Analiz Ediliyor...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                CV'yi Analiz Et
              </>
            )}
          </button>

          {error && (
            <div style={errorBox}>
              <AlertTriangle size={18} />
              {error}
            </div>
          )}
        </div>

        {/* RESULTS SECTION */}
        {result && (
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px" }}>
              <h2 style={{ fontSize: "1.25rem", color: "#1e293b", margin: 0, fontWeight: "700" }}>Analiz Sonucu</h2>
              <div style={scoreBadge(result.score)}>
                <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>UYUM SKORU</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "900" }}>%{result.score}</div>
              </div>
            </div>

            <div style={{ display: "grid", gap: "25px" }}>
              <section>
                <div style={sectionHeader("#10b981")}>
                  <Zap size={18} /> Güçlü Yönler
                </div>
                <div style={listContainer}>
                  {result.strengths?.map((s, i) => (
                    <div key={i} style={listItem}>
                      <CheckCircle size={16} color="#10b981" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div style={sectionHeader("#ef4444")}>
                  <Target size={18} /> Gelişim Alanları
                </div>
                <div style={listContainer}>
                  {result.weaknesses?.map((w, i) => (
                    <div key={i} style={listItem}>
                      <AlertTriangle size={16} color="#ef4444" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div style={sectionHeader("#3b82f6")}>
                  <Lightbulb size={18} /> Kariyer Önerileri
                </div>
                <div style={adviceBox}>
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

const card = {
  background: "white",
  padding: "32px",
  borderRadius: "24px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
  border: "1px solid #f1f5f9"
};

const label = {
  display: "block",
  fontSize: "0.95rem",
  fontWeight: "700",
  color: "#334155",
  marginBottom: "12px"
};

const uploadZone = (hasFile) => ({
  border: `2px dashed ${hasFile ? "#10b981" : "#e2e8f0"}`,
  borderRadius: "16px",
  padding: "40px 20px",
  textAlign: "center",
  background: hasFile ? "#f0fdf4" : "#f8fafc",
  transition: "all 0.2s ease",
  cursor: "pointer",
  position: "relative"
});

const fileInput = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  opacity: 0,
  cursor: "pointer"
};

const uploadLabel = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer"
};

const textarea = {
  width: "100%",
  height: "120px",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  fontSize: "0.95rem",
  outline: "none",
  resize: "none",
  boxSizing: "border-box"
};

const analyzeBtn = (disabled) => ({
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
  transition: "all 0.2s"
});

const errorBox = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "15px",
  padding: "12px",
  background: "#fef2f2",
  color: "#b91c1c",
  borderRadius: "8px",
  fontSize: "0.9rem",
  fontWeight: "600"
};

const scoreBadge = (score) => {
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

const sectionHeader = (color) => ({
  fontSize: "0.9rem",
  fontWeight: "800",
  color: color,
  textTransform: "uppercase",
  letterSpacing: "1px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "15px"
});

const listContainer = {
  display: "grid",
  gap: "10px"
};

const listItem = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "0.95rem",
  color: "#475569",
  background: "#f8fafc",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #f1f5f9"
};

const adviceBox = {
  padding: "20px",
  background: "#eff6ff",
  color: "#1e40af",
  borderRadius: "12px",
  lineHeight: "1.6",
  fontSize: "0.95rem"
};

export default CV;