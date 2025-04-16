import mysql from 'mysql2/promise';
import {creds} from '../env.config.js';
// Pool de connexions (à créer une seule fois)
const DB = mysql.createPool({
  host: creds.host,
  user: creds.user,
  password: creds.password,
  database: creds.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Fonction query sécurisée
export const query = async (sql, params = []) => {
  try {
    const [rows] = await DB.execute(sql, params);
    return rows;
  } catch (err) {
    console.error("Erreur SQL :", err.message);
    throw err;
  }
};

export const existRow = async (sql, params = []) => {
    try {
      const [rows] = await DB.execute(sql, params);
      return rows[0]["count(*)"] > 0;
    } catch (err) {
      console.error("Erreur SQL :", err.message);
      throw err;
    }
  };

export const getCitizen = async (handle) => {
    try {
        const [rows] = await DB.execute("SELECT * FROM citizen WHERE Handle = ?", [handle]);
        if (rows.length == 0){return false}
        else {return rows[0]}
    } catch (err) {
      console.error("Erreur SQL :", err.message);
      throw err;
    }
  };

export const getOrg = async (SID) => {
    try {
        const [rows] = await DB.execute("SELECT * FROM organization WHERE SID = ?", [SID]);
        if (rows.length == 0){return false}
        else {return rows[0]}
    } catch (err) {
      console.error("Erreur SQL :", err.message);
      throw err;
    }
  };

  export const getAffiliation = async (Handle, SID) => {
    try {
        const [rows] = await DB.execute("SELECT * FROM affiliation WHERE citizenHandle = ? AND orgSID = ? AND actif = ?", [Handle, SID, 1]);
        if (rows.length == 0){return false}
        else {return rows[0]}
    } catch (err) {
      console.error("Erreur SQL :", err.message);
      throw err;
    }
  };