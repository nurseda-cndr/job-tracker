import { useEffect, useState } from "react";
import { Search, Filter, Plus, X, Trash2, Briefcase, Building2, Loader2 } from "lucide-react";

function Home() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/applications");
      const data = await res.json();

      // Gelen veriyi kontrol et (res.data.applications veya direkt data olabilir)
      const appsResult = Array.isArray(data) ? data : (data.applications || []);

      console.log("Gelen Başvurular:", appsResult);
      setApplications(appsResult);
    } catch (err) {
      console.error("Fetch hatası:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const addApplication = async () => {
    if (!company || !position) return;

    await fetch("http://localhost:5000/applications/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company, position }),
    });

    setCompany("");
    setPosition("");
    setShowAddForm(false);
    fetchApplications();
  };

  const deleteApplication = async (id) => {
    if (!window.confirm("Bu başvuruyu silmek istediğinize emin misiniz?")) return;
    await fetch(`http://localhost:5000/applications/delete/${id}`, {
      method: "DELETE",
    });
    fetchApplications();
  };

  const updateStatus = async (id, newStatus) => {
    await fetch(`http://localhost:5000/applications/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchApplications();
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "kabul edildi":
        return { color: "#166534", bg: "#dcfce7", border: "#bbf7d0" };
      case "mülakat":
        return { color: "#92400e", bg: "#fef3c7", border: "#fde68a" };
      case "reddedildi":
        return { color: "#991b1b", bg: "#fee2e2", border: "#fecaca" };
      default:
        return { color: "#1e293b", bg: "#f1f5f9", border: "#e2e8f0" };
    }
  };

  // GÜVENLİ KULLANIM
  const safeApplications = Array.isArray(applications) ? applications : [];

  const filteredApps = safeApplications.filter(
    (app) =>
      (filter === "all" || app.status?.toLowerCase() === filter.toLowerCase()) &&
      app.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div>
          <h1 style={{ color: "#0f172a", fontSize: "2rem", fontWeight: "800", margin: 0, letterSpacing: "-0.5px" }}>Başvurularım</h1>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "1rem" }}>İş arama sürecinizi profesyonelce yönetin</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={addBtn}
        >
          {showAddForm ? <X size={20} /> : <Plus size={20} />}
          {showAddForm ? "Vazgeç" : "Yeni Başvuru Ekle"}
        </button>
      </div>

      {/* ADD FORM */}
      {showAddForm && (
        <div style={addFormCard}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "1.1rem", color: "#1e293b" }}>Yeni Başvuru Bilgileri</h3>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={label}>Şirket Adı</label>
              <input
                placeholder="Örn: Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={input}
              />
            </div>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={label}>Pozisyon</label>
              <input
                placeholder="Örn: Frontend Developer"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                style={input}
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={addApplication} style={saveBtn}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* FILTERS */}
      <div style={filterBar}>
        <div style={searchWrapper}>
          <Search size={18} style={searchIcon} />
          <input
            placeholder="Şirket ismine göre ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInput}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Filter size={18} color="#64748b" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={select}
          >
            <option value="all">Tüm Durumlar</option>
            <option value="başvurdu">Başvurdu</option>
            <option value="mülakat">Mülakat</option>
            <option value="kabul edildi">Kabul Edildi</option>
            <option value="reddedildi">Reddedildi</option>
          </select>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "100px" }}>
          <Loader2 className="animate-spin" size={40} color="#3b82f6" />
        </div>
      ) : filteredApps.length === 0 ? (
        <div style={emptyState}>
          <Briefcase size={48} color="#cbd5e1" style={{ marginBottom: "15px" }} />
          <h3 style={{ color: "#1e293b", margin: "0 0 8px 0" }}>Henüz başvuru bulunamadı</h3>
          <p style={{ color: "#64748b", margin: 0 }}>Yeni bir başvuru ekleyerek başlayın.</p>
        </div>
      ) : (
        <div style={cardGrid}>
          {filteredApps.map((app) => {
            const statusStyle = getStatusStyle(app.status);
            return (
              <div key={app.id} style={appCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div style={companyIcon}>
                    <Building2 size={24} color="#3b82f6" />
                  </div>
                  <div style={{
                    ...statusBadge,
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.color,
                    borderColor: statusStyle.border
                  }}>
                    {app.status || "Başvurdu"}
                  </div>
                </div>

                <h3 style={{ fontSize: "1.15rem", color: "#1e293b", margin: "0 0 6px 0", fontWeight: "700" }}>{app.position}</h3>
                <p style={{ color: "#64748b", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.95rem" }}>
                  <Building2 size={16} /> {app.company}
                </p>

                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1, marginRight: "15px" }}>
                    <label style={{ ...label, fontSize: "0.75rem", marginBottom: "4px" }}>Durumu Güncelle</label>
                    <select
                      value={app.status?.toLowerCase() || "başvurdu"}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      style={cardSelect}
                    >
                      <option value="başvurdu">Başvurdu</option>
                      <option value="mülakat">Mülakat</option>
                      <option value="kabul edildi">Kabul Edildi</option>
                      <option value="reddedildi">Reddedildi</option>
                    </select>
                  </div>
                  <button
                    onClick={() => deleteApplication(app.id)}
                    style={deleteBtn}
                    title="Sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* STYLES */

const addBtn = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "12px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.2s",
  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)"
};

const addFormCard = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  border: "1px solid #f1f5f9",
  marginBottom: "30px"
};

const label = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: "600",
  color: "#64748b",
  marginBottom: "8px"
};

const input = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  fontSize: "0.95rem",
  outline: "none",
  boxSizing: "border-box"
};

const saveBtn = {
  padding: "12px 24px",
  backgroundColor: "#0f172a",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "700",
  cursor: "pointer"
};

const filterBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  gap: "20px",
  flexWrap: "wrap"
};

const searchWrapper = {
  position: "relative",
  flex: 1,
  minWidth: "300px"
};

const searchIcon = {
  position: "absolute",
  left: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#94a3b8"
};

const searchInput = {
  width: "100%",
  padding: "12px 14px 12px 42px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  background: "white",
  fontSize: "0.95rem",
  outline: "none",
  boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
};

const select = {
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  background: "white",
  fontSize: "0.95rem",
  outline: "none",
  cursor: "pointer"
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "25px"
};

const appCard = {
  background: "white",
  padding: "24px",
  borderRadius: "20px",
  border: "1px solid #f1f5f9",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
  transition: "all 0.3s ease"
};

const companyIcon = {
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  background: "#eff6ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const statusBadge = {
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "0.75rem",
  fontWeight: "800",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  border: "1px solid"
};

const cardSelect = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "0.85rem",
  background: "#f8fafc",
  outline: "none",
  cursor: "pointer"
};

const deleteBtn = {
  width: "40px",
  height: "40px",
  borderRadius: "10px",
  border: "none",
  background: "#fff1f2",
  color: "#ef4444",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s"
};

const emptyState = {
  textAlign: "center",
  padding: "80px 20px",
  background: "white",
  borderRadius: "24px",
  border: "2px dashed #e2e8f0"
};

export default Home;