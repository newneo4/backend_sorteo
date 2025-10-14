import pool from '../config/db.js';

export const createTableAwards = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS awards (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      winner_ticket VARCHAR(50) REFERENCES codes(ticket_number),
      awarded BOOLEAN DEFAULT false
    );
  `;
  await pool.query(query);
};

export const createAward = async ({ name }) => {
  const q = `INSERT INTO awards (name) VALUES ($1) RETURNING *`;
  const { rows } = await pool.query(q, [name]);
  return rows[0];
};

export const getAwardById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM awards WHERE id = $1', [id]);
  return rows[0];
};

export const assignAwardToCode = async ({ awardId, ticketNumber }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const updCode = await client.query(
      'UPDATE codes SET winner = TRUE WHERE ticket_number = $1 RETURNING *',
      [ticketNumber]
    );
    if (updCode.rowCount === 0) throw new Error('Ticket no existe');

    const updAward = await client.query(
      'UPDATE awards SET winner_ticket = $1, awarded = TRUE WHERE id = $2 RETURNING *',
      [ticketNumber, awardId]
    );

    console.log(updAward, awardId)

    if (updAward.rowCount === 0) throw new Error('Premio no existe');

    await client.query('COMMIT');
    return { award: updAward.rows[0], code: updCode.rows[0] };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const listAwards = async () => {
  const { rows } = await pool.query('SELECT * FROM awards ORDER BY id');
  return rows;
};
