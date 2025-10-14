import express from "express";
import dotenv from "dotenv";
import { createTableCodes } from "./models/codesModel.js";
import { createTableAwards } from "./models/awardsModel.js";
import { importCodesFromCSV } from "./utils/csvImporter.js";
import cors from "cors";

import codesRoutes from "./routess/codes.js";
import awardsRoutes from "./routess/awards.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

async function init() {
  try {
    //console.log("🧩 Inicializando base de datos...");
    //await createTableCodes();
    //await createTableAwards();

    //console.log("📥 Importando códigos desde CSV...");
    // await importCodesFromCSV("./codes.csv");

    app.use("/codes", codesRoutes);
    app.use("/awards", awardsRoutes);
    app.get("/", (req, res) => res.send("Servidor funcionando 🚀"));

    const PORT = process.env.PORT || 3000;
    const HOST = "0.0.0.0";

    app.listen(PORT, HOST, () =>
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

init();
