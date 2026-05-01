import { useState } from "react";
import { Plus, Building2, MapPin, Briefcase, CheckCircle2, Info, Loader2, ArrowLeft, Eye, Banknote } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PostJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    workType: "Remote",
    experience: "Mid",
    salary: "",
    description: "",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addJob = async () => {
    if (!formData.company || !formData.position) {
      alert("Şirket ve Pozisyon alanları zorunludur.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/applications/post-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      await res.json();

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/employer");
      }, 2000);

      setFormData({
        company: "",
        position: "",
        location: "",
        workType: "Remote",
        experience: "Mid",
        salary: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (name) => ({
    ...input,
    borderColor: focusedField === name ? "#3b82f6" : "#cbd5e1",
    boxShadow: focusedField === name ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "none",
  });

  const getInputWithIconStyle = (name) => ({
    ...getInputStyle(name),
    paddingLeft: "40px",
  });

  return (
    <div style={{ padding: "40px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <button
        onClick={() => navigate("/employer")}
        style={backBtn}
      >
        <ArrowLeft size={18} /> Dashboard'a Dön
      </button>

      <div style={{ display: "flex", gap: "40px", maxWidth: "1200px", margin: "0 auto", alignItems: "flex-start" }}>
        {/* FORM SECTION */}
        <div style={{ ...card, flex: 1.2 }}>
          <div style={headerSection}>
            <div style={iconCircle}>
              <Plus size={24} color="white" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#0f172a" }}>Yeni İlan Oluştur</h1>
              <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "14px" }}>Yeni bir iş ilanı oluşturun ve en uygun adayları bulun</p>
            </div>
          </div>

          {success && (
            <div style={successAlert}>
              <CheckCircle2 size={20} />
              İlanınız başarıyla yayınlandı! Dashboard'a yönlendiriliyorsunuz...
            </div>
          )}

          <div style={section}>
            <div style={sectionHeader}>
              <Building2 size={18} color="#3b82f6" />
              <span style={sectionTitle}>Genel Bilgiler</span>
            </div>

            <div style={formGroup}>
              <label style={label}>Şirket Adı <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={inputWrapper}>
                <Building2 size={18} style={inputIcon} />
                <input
                  name="company"
                  placeholder="Örn: Tech A.Ş"
                  value={formData.company}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("company")}
                  onBlur={() => setFocusedField(null)}
                  style={getInputWithIconStyle("company")}
                />
              </div>
            </div>

            <div style={formGroup}>
              <label style={label}>Pozisyon <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={inputWrapper}>
                <Briefcase size={18} style={inputIcon} />
                <input
                  name="position"
                  placeholder="Örn: Senior Frontend Developer"
                  value={formData.position}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("position")}
                  onBlur={() => setFocusedField(null)}
                  style={getInputWithIconStyle("position")}
                />
              </div>
            </div>
          </div>

          <div style={section}>
            <div style={sectionHeader}>
              <Info size={18} color="#3b82f6" />
              <span style={sectionTitle}>İş Detayları</span>
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ ...formGroup, flex: 1 }}>
                <label style={label}>Lokasyon</label>
                <div style={inputWrapper}>
                  <MapPin size={18} style={inputIcon} />
                  <input
                    name="location"
                    placeholder="Örn: İstanbul"
                    value={formData.location}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("location")}
                    onBlur={() => setFocusedField(null)}
                    style={getInputWithIconStyle("location")}
                  />
                </div>
              </div>

              <div style={{ ...formGroup, flex: 1 }}>
                <label style={label}>Çalışma Tipi</label>
                <select
                  name="workType"
                  value={formData.workType}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("workType")}
                  onBlur={() => setFocusedField(null)}
                  style={getInputStyle("workType")}
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Ofis">Ofis</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ ...formGroup, flex: 1 }}>
                <label style={label}>Deneyim Seviyesi</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("experience")}
                  onBlur={() => setFocusedField(null)}
                  style={getInputStyle("experience")}
                >
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>

              <div style={{ ...formGroup, flex: 1 }}>
                <label style={label}>Maaş Aralığı</label>
                <input
                  name="salary"
                  placeholder="Örn: 80K - 120K"
                  value={formData.salary}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("salary")}
                  onBlur={() => setFocusedField(null)}
                  style={getInputStyle("salary")}
                />
              </div>
            </div>

            <div style={formGroup}>
              <label style={label}>İş Açıklaması</label>
              <textarea
                name="description"
                placeholder="İşin gereksinimlerini, sorumlulukları ve yan hakları buraya yazın..."
                value={formData.description}
                onChange={handleChange}
                onFocus={() => setFocusedField("description")}
                onBlur={() => setFocusedField(null)}
                style={{ ...textarea, borderColor: focusedField === "description" ? "#3b82f6" : "#cbd5e1" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={() => navigate("/employer")}
              style={cancelBtn}
            >
              Vazgeç
            </button>
            <button
              onClick={addJob}
              disabled={loading}
              style={{ ...button, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer", flex: 2 }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(0)"; } }}
            >
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <Loader2 className="animate-spin" size={20} />
                  Yayınlanıyor...
                </div>
              ) : (
                "İlan Yayınla"
              )}
            </button>
          </div>
        </div>

        {/* PREVIEW SECTION */}
        <div style={{ ...card, flex: 0.8, position: "sticky", top: "40px", background: "#f1f5f9", borderColor: "#e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Eye size={20} color="#64748b" />
            <span style={{ fontWeight: "700", color: "#64748b", textTransform: "uppercase", fontSize: "0.85rem" }}>Önizleme</span>
          </div>

          <div style={previewCard}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
              <div style={{ background: "#3b82f6", color: "white", padding: "4px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700" }}>
                {formData.workType}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Yeni İlan</div>
            </div>

            <h3 style={{ margin: "0 0 5px 0", color: "#0f172a" }}>{formData.position || "Pozisyon Başlığı"}</h3>
            <p style={{ margin: "0 0 15px 0", color: "#64748b", fontSize: "0.9rem", fontWeight: "600" }}>{formData.company || "Şirket Adı"}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid #f1f5f9", paddingTop: "15px" }}>
              <div style={previewItem}>
                <MapPin size={14} color="#94a3b8" />
                <span>{formData.location || "Lokasyon Belirtilmedi"}</span>
              </div>
              <div style={previewItem}>
                <Briefcase size={14} color="#94a3b8" />
                <span>{formData.experience} Seviye</span>
              </div>
              {formData.salary && (
                <div style={{ ...previewItem, color: "#16a34a", fontWeight: "600" }}>
                  <Banknote size={14} /> {formData.salary}
                </div>
              )}
            </div>

            <div style={{ marginTop: "20px" }}>
              <p style={{ fontSize: "0.85rem", color: "#64748b", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.6" }}>
                {formData.description || "İş açıklaması burada görünecek..."}
              </p>
            </div>
          </div>

          <p style={{ fontSize: "0.75rem", color: "#94a3b8", textAlign: "center", marginTop: "20px" }}>
            * Bu bir önizlemedir. İlan yayınlandığında adaylar bu şekilde görecektir.
          </p>
        </div>
      </div>
    </div>
  );
}

const card = {
  background: "white",
  padding: "40px",
  borderRadius: "20px",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
  border: "1px solid #f1f5f9",
  transition: "all 0.3s ease"
};

const headerSection = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  marginBottom: "35px",
  paddingBottom: "25px",
  borderBottom: "1px solid #f1f5f9"
};

const iconCircle = {
  width: "50px",
  height: "50px",
  borderRadius: "14px",
  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 16px rgba(34, 197, 94, 0.2)"
};

const section = {
  marginBottom: "35px"
};

const sectionHeader = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px"
};

const sectionTitle = {
  fontSize: "0.9rem",
  fontWeight: "800",
  color: "#334155",
  textTransform: "uppercase",
  letterSpacing: "1px"
};

const successAlert = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "16px",
  background: "#dcfce7",
  color: "#166534",
  borderRadius: "12px",
  marginBottom: "25px",
  fontWeight: "600",
  border: "1px solid #bbf7d0",
  fontSize: "0.95rem",
  animation: "slideIn 0.3s ease"
};

const formGroup = {
  marginBottom: "20px",
};

const label = {
  display: "block",
  marginBottom: "8px",
  fontSize: "0.85rem",
  fontWeight: "600",
  color: "#64748b"
};

const inputWrapper = {
  position: "relative",
  display: "flex",
  alignItems: "center"
};

const inputIcon = {
  position: "absolute",
  left: "14px",
  color: "#94a3b8"
};

const input = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "2px solid #e2e8f0",
  fontSize: "0.95rem",
  color: "#1e293b",
  boxSizing: "border-box",
  outline: "none",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  backgroundColor: "#ffffff"
};

const textarea = {
  ...input,
  height: "150px",
  resize: "none",
  fontFamily: "inherit",
  lineHeight: "1.6"
};

const button = {
  padding: "16px",
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: "14px",
  fontSize: "1rem",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 4px 6px -1px rgba(34, 197, 94, 0.2)"
};

const cancelBtn = {
  padding: "16px",
  background: "#f8fafc",
  color: "#64748b",
  border: "2px solid #e2e8f0",
  borderRadius: "14px",
  fontSize: "1rem",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.2s ease",
  flex: 1
};

const backBtn = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "none",
  border: "none",
  color: "#64748b",
  cursor: "pointer",
  fontSize: "0.95rem",
  fontWeight: "600",
  marginBottom: "25px",
  padding: "0",
  marginLeft: "calc(50% - 600px)"
};

const previewCard = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  border: "1px solid #e2e8f0"
};

const previewItem = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "0.85rem",
  color: "#64748b"
};

export default PostJob;