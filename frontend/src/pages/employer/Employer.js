import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, Users, Check, X, BarChart3, Save } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function Employer() {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/applications/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    // Temporary mock data or fetch candidates
    setCandidates([
      { id: 1, username: "Ahmet", company: "Tech A.Ş", position: "Frontend Developer", status: "Bekliyor", score: 92, note: "React konusunda tecrübeli." },
      { id: 2, username: "Ayşe", company: "Global Ltd", position: "Backend Developer", status: "Kabul Edildi", score: 85, note: "" },
      { id: 4, username: "Zeynep", company: "Tech A.Ş", position: "Frontend Developer", status: "Bekliyor", score: 68, note: "" },
      { id: 3, username: "Mehmet", company: "Global Ltd", position: "Backend Developer", status: "Reddedildi", score: 45, note: "İletişim becerileri zayıf." },
    ]);
  }, []);

  const handleNoteChange = (id, text) => {
    setNotes(prev => ({ ...prev, [id]: text }));
  };

  const saveNote = (id) => {
    setCandidates(prev =>
      prev.map(c => (c.id === id ? { ...c, note: notes[id] !== undefined ? notes[id] : c.note } : c))
    );
    alert("Not başarıyla kaydedildi!");
  };

  const getScoreColor = (score) => {
    if (!score) return "gray";
    if (score >= 80) return "#10b981"; // green
    if (score >= 50) return "#f59e0b"; // orange
    return "#ef4444"; // red
  };

  const getStatusStyle = (status) => {
    if (!status) return { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" };
    const lower = status.toLowerCase();
    if (lower === "kabul edildi") return { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" };
    if (lower === "reddedildi") return { bg: "#fee2e2", text: "#991b1b", border: "#fecaca" };
    return { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0" }; // bekliyor vs.
  };

  const updateStatus = async (id, status) => {
    if (!id) return;
    try {
      const res = await fetch("http://localhost:5000/applications/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      await res.json();

      // UI güncelle
      setCandidates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const safeCandidates = Array.isArray(candidates) ? candidates : [];

  // İstatistik Hesaplamaları
  const totalJobs = safeJobs.length;
  const totalCandidates = safeCandidates.length;
  const acceptedCount = safeCandidates.filter(c => c.status?.toLowerCase() === "kabul edildi").length;
  const pendingCount = safeCandidates.filter(c => !c.status || c.status?.toLowerCase() === "bekliyor").length;
  const acceptanceRate = totalCandidates === 0 ? 0 : Math.round((acceptedCount / totalCandidates) * 100);

  // Mock Haftalık Veri
  const weeklyData = [
    { day: "Pzt", value: 2 },
    { day: "Sal", value: 5 },
    { day: "Çar", value: 3 },
    { day: "Per", value: 7 },
    { day: "Cum", value: 4 }
  ];

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: "#2e7d32", display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px" }}>
        <LayoutDashboard size={28} /> İşveren Paneli
      </h1>

      {/* STAT KARTLARI */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "40px", flexWrap: "wrap" }}>
        <div style={statCard}>
          <div style={statTitle}>Toplam İlan</div>
          <div style={statValue}>{totalJobs}</div>
        </div>
        <div style={statCard}>
          <div style={statTitle}>Toplam Başvuru</div>
          <div style={statValue}>{totalCandidates}</div>
        </div>
        <div style={statCard}>
          <div style={statTitle}>Kabul Oranı</div>
          <div style={statValue}>%{acceptanceRate}</div>
        </div>
        <div style={statCard}>
          <div style={statTitle}>Bekleyen</div>
          <div style={statValue}>{pendingCount}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        {/* SOL KOLON: LİSTELER */}
        <div style={{ flex: "2", minWidth: "300px" }}>
          {/* İLANLAR */}
          <h2 style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
            <FileText size={22} /> İlanlarım
          </h2>
          {safeJobs.length === 0 && (
            <div style={{ textAlign: "center", marginTop: "40px", marginBottom: "40px", padding: "30px", background: "white", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
              <div style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", width: "60px", height: "60px", borderRadius: "50%", background: "#f1f5f9", marginBottom: "15px" }}>
                <FileText size={30} color="#94a3b8" />
              </div>
              <h3 style={{ margin: "0 0 8px 0", color: "#334155" }}>Henüz ilan yok</h3>
              <p style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: "0.9rem" }}>İlk ilanınızı oluşturun</p>
              <button
                onClick={() => window.location.href = "/post-job"}
                style={{
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                İlan Oluştur
              </button>
            </div>
          )}
          {safeJobs.map((job) => (
            <div key={job.id} style={card}>
              <b>{job.company}</b> - {job.title || job.position}
            </div>
          ))}

          {/* ADAYLAR */}
          <h2 style={{ marginTop: "40px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
            <Users size={22} /> Adaylar
          </h2>
          {safeCandidates.length === 0 && <p style={{ color: "#888" }}>Henüz adayınız bulunmuyor.</p>}
          {[...safeCandidates].sort((a, b) => (b.score || 0) - (a.score || 0)).map((c, i) => (
            <div
              key={c.id || i}
              style={{ ...card, transition: "box-shadow 0.3s ease, transform 0.3s ease" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.03)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#0f172a" }}>{c.username || c.name}</div>
                  <div style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "4px" }}>{c.company} - {c.position || c.job}</div>
                </div>
                {c.score && (
                  <div style={{ background: getScoreColor(c.score), color: "white", padding: "4px 10px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "bold", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                    Skor: {c.score}
                  </div>
                )}
              </div>

              {/* STATUS */}
              <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>Durum:</span>
                <span style={{
                  background: getStatusStyle(c.status).bg,
                  color: getStatusStyle(c.status).text,
                  border: `1px solid ${getStatusStyle(c.status).border}`,
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: "bold"
                }}>
                  {c.status || "Bekliyor"}
                </span>
              </div>

              {/* BUTONLAR */}
              <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => updateStatus(c.id, "Kabul Edildi")}
                  style={acceptBtn}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#16a34a"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#22c55e"}
                >
                  <Check size={16} /> Kabul Et
                </button>

                <button
                  onClick={() => updateStatus(c.id, "Reddedildi")}
                  style={rejectBtn}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#dc2626"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#ef4444"}
                >
                  <X size={16} /> Reddet
                </button>
              </div>

              {/* NOTLAR */}
              <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid #f1f5f9", paddingTop: "15px" }}>
                <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "bold" }}>Aday Notu</div>
                <textarea
                  placeholder="Bu aday hakkında not ekleyin..."
                  value={notes[c.id] !== undefined ? notes[c.id] : (c.note || "")}
                  onChange={(e) => handleNoteChange(c.id, e.target.value)}
                  style={{
                    width: "100%",
                    height: "60px",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    resize: "vertical",
                    fontSize: "0.85rem",
                    fontFamily: "inherit",
                    outline: "none"
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => saveNote(c.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "6px 12px",
                      background: "#f8fafc",
                      color: "#475569",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "0.2s"
                    }}
                  >
                    <Save size={14} /> Kaydet
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SAĞ KOLON: GRAFİK */}
        <div style={{ flex: "1", minWidth: "300px" }}>
          <div style={chartCard}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", color: "#333" }}>
              <BarChart3 size={20} /> Haftalık Başvurular
            </h3>

            <div style={{ display: "flex", alignItems: "flex-end", height: "250px", gap: "10px", paddingBottom: "10px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={weeklyData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={36} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* STYLES */
const statCard = {
  background: "white",
  padding: "25px 20px",
  borderRadius: "16px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
  flex: "1",
  minWidth: "200px",
  border: "1px solid #f1f5f9"
};

const statTitle = {
  color: "#64748b",
  fontSize: "0.85rem",
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const statValue = {
  fontSize: "2.5rem",
  fontWeight: "800",
  color: "#0f172a",
  marginTop: "10px"
};

const card = {
  background: "white",
  padding: "20px",
  marginBottom: "15px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
  border: "1px solid #f1f5f9"
};

const chartCard = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
  border: "1px solid #f1f5f9",
  position: "sticky",
  top: "30px"
};

const acceptBtn = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  cursor: "pointer",
  padding: "8px 16px",
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  transition: "all 0.2s ease"
};

const rejectBtn = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  cursor: "pointer",
  padding: "8px 16px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  transition: "all 0.2s ease"
};

export default Employer;