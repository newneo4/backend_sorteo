import pool from "../config/db.js";

export const createTableCodes = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS codes (
      id SERIAL PRIMARY KEY,
      ticket_number VARCHAR(50) UNIQUE NOT NULL,
      code VARCHAR(100) NOT NULL,
      used BOOLEAN DEFAULT false,
      winner BOOLEAN DEFAULT false
    );
  `;
  await pool.query(query);
};

export const createCode = async ({ ticket_number, code }) => {
  const q = `INSERT INTO codes (ticket_number, code) VALUES ($1, $2) RETURNING *`;
  const { rows } = await pool.query(q, [ticket_number, code]);
  return rows[0];
};

export const getCodeById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM codes WHERE id = $1", [id]);
  return rows[0];
};

export const getCodeByCodeOrTicket = async ({ code, ticket_number }) => {
  const q = `SELECT * FROM codes WHERE code = $1 OR ticket_number = $2 LIMIT 1`;
  const { rows } = await pool.query(q, [code, ticket_number]);
  return rows[0];
};

export const markUsed = async (id) => {
  const q = `UPDATE codes SET used = TRUE WHERE id = $1 RETURNING *`;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};

export const setWinner = async (id) => {
  const q = `UPDATE codes SET winner = TRUE WHERE id = $1 RETURNING *`;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};

export const listWinners = async () => {
  const { rows } = await pool.query("SELECT * FROM codes WHERE winner = TRUE");
  return rows;
};
