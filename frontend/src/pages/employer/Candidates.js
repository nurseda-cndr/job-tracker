import { useState, useEffect } from "react";
import { Users, Search, Filter, Check, X, Clock } from "lucide-react";

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Employer.js ile tutarlı mock data
    setCandidates([
      { id: 1, username: "Ahmet", company: "Tech A.Ş", position: "Frontend Developer", status: "Bekliyor", score: 92, note: "React konusunda tecrübeli." },
      { id: 2, username: "Ayşe", company: "Global Ltd", position: "Backend Developer", status: "Kabul Edildi", score: 85, note: "" },
      { id: 4, username: "Zeynep", company: "Tech A.Ş", position: "Frontend Developer", status: "Bekliyor", score: 68, note: "" },
      { id: 3, username: "Mehmet", company: "Global Ltd", position: "Backend Developer", status: "Reddedildi", score: 45, note: "İletişim becerileri zayıf." },
      { id: 5, username: "Can", company: "Startup Co", position: "Fullstack Developer", status: "Bekliyor", score: 78, note: "Hızlı öğreniyor." },
    ]);
  }, []);

  const getScoreColor = (score) => {
    if (!score) return "gray";
    if (score >= 80) return "#10b981"; // green
    if (score >= 50) return "#f59e0b"; // orange
    return "#ef4444"; // red
  };

  const getStatusStyle = (status) => {
    const lower = status?.toLowerCase();
    if (lower === "kabul edildi") return { bg: "#dcfce7", text: "#166534", border: "#bbf7d0", icon: <Check size={14} /> };
    if (lower === "reddedildi") return { bg: "#fee2e2", text: "#991b1b", border: "#fecaca", icon: <X size={14} /> };
    return { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0", icon: <Clock size={14} /> };
  };

  const updateStatus = (id, newStatus) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const updateNote = (id, newNote) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, note: newNote } : c));
  };

  const filteredCandidates = (candidates || []).filter((c) => {
    const matchesSearch = (c.username || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.company || "").toLowerCase().includes(search.toLowerCase());

    if (statusFilter === "high") return matchesSearch && c.score >= 80;
    if (statusFilter === "medium") return matchesSearch && c.score >= 50 && c.score < 80;
    if (statusFilter === "low") return matchesSearch && c.score < 50;
    return matchesSearch;
  });

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: "10px", color: "#0f172a", margin: 0 }}>
          <Users size={32} color="#3b82f6" /> Aday Yönetimi
        </h1>
        <p style={{ color: "#64748b", marginTop: "5px" }}>Tüm başvuruları görüntüleyin ve filtreleyin</p>
      </div>

      {/* FİLTRE BAR */}
      <div style={filterBar}>
        <div style={searchWrapper}>
          <Search size={18} style={searchIcon} />
          <input
            placeholder="Aday ismi veya şirket ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInput}
          />
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <Filter size={18} color="#64748b" style={{ marginRight: "5px" }} />
          {[
            { id: "all", label: "Tümü" },
            { id: "high", label: "Yüksek Skor (80+)" },
            { id: "medium", label: "Orta Skor (50-79)" },
            { id: "low", label: "Düşük Skor (<50)" }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              style={filterBtn(statusFilter === f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* LİSTE */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
        {candidates.length === 0 ? (
          <div style={emptyState}>
            <div style={emptyIconCircle}>
              <Users size={40} color="#94a3b8" />
            </div>
            <h2 style={{ color: "#1e293b", margin: "0 0 10px 0", fontSize: "1.25rem" }}>Henüz başvuru yok</h2>
            <p style={{ color: "#64748b", margin: 0, maxWidth: "300px" }}>İlan yayınladığınızda adaylar burada görünecek</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "50px", color: "#94a3b8", background: "white", borderRadius: "12px" }}>
            Arama kriterlerine uygun aday bulunamadı.
          </div>
        ) : (
          filteredCandidates.map((c) => {
            const status = getStatusStyle(c.status);
            return (
              <div
                key={c.id}
                style={candidateCard}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)"; }}
              >
                {/* ÜST KISIM */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={avatar(c.username)}>
                      {c.username.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: "700", color: "#1e293b", fontSize: "1.05rem" }}>{c.username}</div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>{c.company}</div>
                      <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{c.position}</div>
                    </div>
                  </div>

                  <div style={{
                    background: getScoreColor(c.score),
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    fontSize: "0.8rem",
                    fontWeight: "800",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}>
                    {c.score}
                  </div>
                </div>

                {/* ALT KISIM */}
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "15px", marginTop: "auto" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{
                      ...statusBadge,
                      background: status.bg,
                      color: status.text,
                      border: `1px solid ${status.border}`
                    }}>
                      {status.icon}
                      {c.status}
                    </div>
                  </div>

                  {/* NOT ALANI */}
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", marginBottom: "5px", textTransform: "uppercase" }}>Aday Notu</div>
                    <textarea
                      placeholder="Not ekleyin..."
                      value={c.note}
                      onChange={(e) => updateNote(c.id, e.target.value)}
                      style={noteInput}
                    />
                  </div>

                  {/* BUTONLAR */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => updateStatus(c.id, "Kabul Edildi")}
                      style={acceptBtn}
                    >
                      <Check size={14} /> Kabul Et
                    </button>
                    <button
                      onClick={() => updateStatus(c.id, "Reddedildi")}
                      style={rejectBtn}
                    >
                      <X size={14} /> Reddet
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* STYLES */

const filterBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "white",
  padding: "15px 20px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
  marginBottom: "25px",
  gap: "20px",
  flexWrap: "wrap"
};

const searchWrapper = {
  position: "relative",
  flex: 1,
  minWidth: "250px"
};

const searchIcon = {
  position: "absolute",
  left: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#94a3b8"
};

const searchInput = {
  width: "100%",
  padding: "10px 10px 10px 40px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "0.95rem",
  outline: "none",
  transition: "all 0.2s"
};

const filterBtn = (active) => ({
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  background: active ? "#3b82f6" : "#f1f5f9",
  color: active ? "white" : "#64748b",
  fontSize: "0.85rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease"
});

const candidateCard = {
  background: "white",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
  border: "1px solid #f1f5f9",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  flexDirection: "column"
};

const avatar = (name) => ({
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  background: "#e0f2fe",
  color: "#0369a1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.1rem",
  fontWeight: "bold"
});

const statusBadge = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "0.75rem",
  fontWeight: "700"
};

const noteInput = {
  width: "100%",
  minHeight: "60px",
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "0.85rem",
  color: "#475569",
  background: "#f8fafc",
  resize: "none",
  outline: "none",
  boxSizing: "border-box"
};

const acceptBtn = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  padding: "10px",
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "0.85rem",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.2s"
};

const rejectBtn = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  padding: "10px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "0.85rem",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.2s"
};

const emptyState = {
  gridColumn: "1 / -1",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "80px 20px",
  background: "white",
  borderRadius: "20px",
  border: "2px dashed #e2e8f0",
  textAlign: "center",
  marginTop: "20px"
};

const emptyIconCircle = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  background: "#f1f5f9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "20px"
};

export default Candidates;