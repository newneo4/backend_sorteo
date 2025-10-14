import fs from "fs";
import csv from "csv-parser";
import pool from "../config/db.js";

export const importCodesFromCSV = async (csvFilePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", async () => {
        for (const row of results) {
          const { ticket_number, code } = row;
          await pool.query(
            "INSERT INTO codes (ticket_number, code) VALUES ($1, $2) ON CONFLICT (ticket_number) DO NOTHING",
            [ticket_number, code]
          );
        }
        console.log(`✅ ${results.length} códigos importados`);
        resolve();
      })
      .on("error", reject);
  });
};
