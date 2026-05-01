const sql = require("mssql");

const config = {
  server: "localhost",
  database: "JobTrackerDB",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  authentication: {
    type: "ntlm",
    options: {
      domain: "", 
      userName: "Excalibur", 
      password: "25nur45", 
    },
  },
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log("SQL Server connected successfully");
  } catch (err) {
    console.log("DB bağlantı hatası ", err);
  }
};

module.exports = { sql, connectDB };