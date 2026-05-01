console.log("ROUTES AKTİF 🚀");

const express = require("express");
const router = express.Router();

const { sql } = require("../config/db");

const multer = require("multer");
const pdf = require("pdf-parse");
const fs = require("fs");

const OpenAI = require("openai");
require("dotenv").config();

const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// BAŞVURU EKLE
router.post("/add", async (req, res) => {
  const { company, position, status } = req.body;

  try {
    const request = new sql.Request();

    await request
      .input("company", sql.NVarChar(100), company)
      .input("position", sql.NVarChar(100), position)
      .input("status", sql.NVarChar(50), status || "applied")
      .query(`
        INSERT INTO Applications (company, position, status)
        VALUES (@company, @position, @status)
      `);

    res.json({ message: "Başvuru eklendi 🎉" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TÜM BAŞVURULARI GETİR
router.get("/", async (req, res) => {
  try {
    const result = await new sql.Request().query(`
      SELECT * FROM Applications 
      ORDER BY created_at DESC
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// STATUS GÜNCELLE
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const request = new sql.Request();

    await request
      .input("id", sql.Int, id)
      .input("status", sql.NVarChar(50), status)
      .query(`
        UPDATE Applications
        SET status = @status
        WHERE id = @id
      `);

    res.json({ message: "Status güncellendi 🔄" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ID’ye göre başvuru sil
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();

    await request
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM Applications
        WHERE id = @id
      `);

    res.json({ message: "Başvuru silindi 🗑️" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BASİT AI (ESKİ)
router.get("/suggestions", async (req, res) => {
  try {
    const result = await new sql.Request().query(
      "SELECT * FROM Applications"
    );

    const applications = result.recordset;

    let suggestions = [];

    applications.forEach((app) => {
      const position = app.position.toLowerCase();

      if (position.includes("backend")) {
        suggestions.push("Backend Developer - Amazon");
        suggestions.push("Node.js Developer - Netflix");
        suggestions.push("API Developer - Spotify");
      }

      if (position.includes("frontend")) {
        suggestions.push("Frontend Developer - Google");
        suggestions.push("React Developer - Meta");
        suggestions.push("UI Developer - Airbnb");
      }

      if (position.includes("full")) {
        suggestions.push("Fullstack Developer - Microsoft");
        suggestions.push("Fullstack Engineer - LinkedIn");
      }
    });

    const uniqueSuggestions = [...new Set(suggestions)];

    res.json(uniqueSuggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GERÇEK AI (OPENAI)
router.get("/ai-suggestions", async (req, res) => {
  try {
    const result = await new sql.Request().query(
      "SELECT * FROM Applications"
    );
    const profileText = `
    Kullanıcı:
    - İsim: ${userProfile.name}
    - Skills: ${userProfile.skills}
    - İlgi alanları: ${userProfile.interests}
    - Deneyim: ${userProfile.experience}
`   ;

    const applications = result.recordset;

    const text = applications
      .map((a) => `${a.company} - ${a.position} (${a.status})`)
      .join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a career AI assistant.

User profile:
${profileText}

Applications:
${text}

Give:
- Best job roles
- Suitable companies
- Salary estimation
- Career advice

Answer in Turkish.
          `,
        },

        {
          role: "user",
          content: `Başvurularım:\n${text}`,
        },
      ],
    });

    const aiText = response.choices[0].message.content;

    res.json({ suggestions: aiText });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// KULLANICI BİLGİLERİ (GEÇİCİ - MEMORY)
let userProfile = {
  name: "",
  skills: "",
  interests: "",
  experience: "",
};

// PROFİL KAYDET
router.post("/profile", (req, res) => {
  userProfile = req.body;
  res.json({ message: "Profil kaydedildi " });
});

// PROFİL GETİR
router.get("/profile", (req, res) => {
  res.json(userProfile);
});

router.post("/upload-cv", upload.single("cv"), async (req, res) => {
  try {
    const fs = require("fs");
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);
    const cvText = data.text;

    // AI Analizi (Opsiyonel: Eğer jobText varsa analiz yap, yoksa sadece metni döndür)
    const { jobText } = req.body;

    if (jobText) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
              You are an expert HR systems analyst. 
              Analyze the provided CV text against the Job Description.
              Return ONLY valid JSON:
              {
                "score": number (0-100),
                "strengths": ["string"],
                "weaknesses": ["string"],
                "advice": "string"
              }
              Answer in Turkish.
            `,
          },
          {
            role: "user",
            content: `CV Text: ${cvText}\n\nJob Description: ${jobText}`,
          },
        ],
      });
      const aiResult = JSON.parse(response.choices[0].message.content);
      return res.json({ result: aiResult, text: cvText });
    }

    res.json({ text: cvText });

  } catch (err) {
    console.error("CV Upload Error:", err);
    res.status(500).json({ error: "CV analiz edilemedi: " + err.message });
  }
});

router.post("/analyze-job", async (req, res) => {
  try {
    const { jobText } = req.body;

    const result = await new sql.Request().query(
      "SELECT * FROM Applications"
    );

    const applications = result.recordset;

    const userText = applications
      .map((a) => `${a.company} - ${a.position}`)
      .join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an AI career analyzer.

Compare user experience with job description.

Return ONLY JSON:

{
  "score": 0,
  "matching_skills": [],
  "missing_skills": [],
  "advice": ""
}

Score must be between 0-100.
          `,
        },
        {
          role: "user",
          content: `
User background:
${userText}

Job description:
${jobText}
          `,
        },
      ],
    });

    const aiText = response.choices[0].message.content;

    res.json({ result: aiText });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    await new sql.Request()
      .input("username", sql.NVarChar, username)
      .input("password", sql.NVarChar, password)
      .input("role", sql.NVarChar, role)
      .query(`
        INSERT INTO Users (username, password, role)
        VALUES (@username, @password, @role)
      `);

    res.json({ message: "Kayıt başarılı" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const request = new sql.Request();

    const result = await request
      .input("username", sql.NVarChar, username)
      .query("SELECT * FROM Users WHERE username = @username");

    const user = result.recordset[0];

    // ❌ kullanıcı yok
    if (!user) {
      return res.status(401).json({ error: "Kullanıcı bulunamadı" });
    }

    // 🔥 DEBUG (bir kere bak)
    console.log("DB ŞİFRE:", user.password);
    console.log("GELEN ŞİFRE:", password);

    // ✅ GÜVENLİ KARŞILAŞTIRMA
    if (String(user.password).trim() !== String(password).trim()) {
      return res.status(401).json({ error: "Şifre yanlış" });
    }

    // ✅ ROL KONTROLÜ
    if (String(user.role).trim().toLowerCase() !== String(role).trim().toLowerCase()) {
      return res.status(401).json({ error: "Yanlış kullanıcı tipi" });
    }

    // ✅ giriş
    res.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/ai-candidates", async (req, res) => {
  const { job } = req.body;

  const prompt = `
You are an HR AI assistant.

Job description:
${job}

Give top 3 candidate profiles.

For each candidate:
- Name
- Match percentage
- Missing skills

Answer in Turkish.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      result: response.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ error: "AI hatası" });
  }
});

router.post("/analyze-cv", (req, res) => {
  const { cvText, jobText } = req.body;

  if (!cvText || !jobText) {
    return res.status(400).json({ error: "Eksik veri" });
  }

  // 🔥 basit keyword split
  const cvWords = cvText.toLowerCase().split(" ");
  const jobWords = jobText.toLowerCase().split(" ");

  let matchCount = 0;

  jobWords.forEach(word => {
    if (cvWords.includes(word)) {
      matchCount++;
    }
  });

  const score = Math.round((matchCount / jobWords.length) * 100);

  res.json({
    score,
    message:
      score > 70
        ? "🔥 Çok iyi eşleşme"
        : score > 40
          ? "⚡ Orta seviye uyum"
          : "❌ Düşük uyum",
  });
});



router.post("/ai-comment", async (req, res) => {
  const { cvText, jobText } = req.body;

  const prompt = `
Sen bir insan kaynakları uzmanısın.

Aşağıdaki CV ve iş ilanını analiz et:

CV:
${cvText}

İlan:
${jobText}

Adayın güçlü yönlerini, eksiklerini ve genel uyumunu kısa ve net şekilde açıkla.
Cevabı Türkçe yaz.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      comment: response.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ error: "AI yorum hatası" });
  }
});

router.post("/match-candidates", (req, res) => {
  const { jobText, cvs } = req.body;

  if (!jobText || !cvs) {
    return res.status(400).json({ error: "Eksik veri" });
  }

  const jobWords = jobText.toLowerCase().split(" ");

  const results = cvs.map((cv) => {
    const cvWords = cv.text.toLowerCase().split(" ");

    let match = 0;

    jobWords.forEach((word) => {
      if (cvWords.includes(word)) {
        match++;
      }
    });

    const score = Math.round((match / jobWords.length) * 100);

    return {
      name: cv.name,
      score,
    };
  });

  // 🔥 en iyiye göre sırala
  results.sort((a, b) => b.score - a.score);

  res.json({ results });
});

router.post("/ai-match", async (req, res) => {
  const { jobText, cvs } = req.body;

  const prompt = `
Sen bir insan kaynakları uzmanısın.

İş ilanı:
${jobText}

Adaylar:
${cvs.map(c => `${c.name}: ${c.text}`).join("\n")}

Her aday için aşağıdaki formatta JSON döndür:

[
  {
    "name": "Ahmet",
    "score": 85,
    "comment": "Kısa açıklama"
  }
]

SADECE JSON DÖN, BAŞKA HİÇBİR ŞEY YAZMA.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content;

    // 🔥 JSON parse
    const parsed = JSON.parse(text);

    res.json({ results: parsed });

  } catch (err) {
    res.status(500).json({ error: "AI JSON hatası" });
  }
});

// 🔥 ADAYLARI GETİR
router.get("/candidates", async (req, res) => {
  try {
    const request = new sql.Request();

    const result = await request.query(`
      SELECT 
        username AS name,
        'Frontend Developer' AS job,
        CAST(RAND(CHECKSUM(NEWID())) * 40 + 60 AS INT) AS score
      FROM Users
      WHERE role = 'seeker'
    `);

    res.json(result.recordset);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 İLAN EKLE
router.post("/post-job", async (req, res) => {
  const { company, position } = req.body;

  try {
    const request = new sql.Request();

    await request
      .input("company", sql.NVarChar(100), company)
      .input("position", sql.NVarChar(100), position)
      .query(`
        INSERT INTO Jobs (company, position)
        VALUES (@company, @position)
      `);

    res.json({ message: "İlan eklendi" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/jobs", async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query("SELECT * FROM Jobs");

    res.json(result.recordset);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 BAŞVUR
router.post("/apply", async (req, res) => {
  const { userId, jobId } = req.body;

  try {
    const request = new sql.Request();

    await request
      .input("userId", sql.Int, userId)
      .input("jobId", sql.Int, jobId)
      .query(`
        INSERT INTO Applications (userId, jobId)
        VALUES (@userId, @jobId)
      `);

    res.json({ message: "Başvuru yapıldı" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 STATUS GÜNCELLE
router.put("/status", async (req, res) => {
  const { id, status } = req.body;

  try {
    const request = new sql.Request();

    await request
      .input("id", sql.Int, id)
      .input("status", sql.NVarChar(50), status)
      .query(`
        UPDATE Applications
        SET status = @status
        WHERE id = @id
      `);

    res.json({ message: "Güncellendi" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// EN SON
module.exports = router;