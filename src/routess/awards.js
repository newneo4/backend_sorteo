import express from "express";
import * as awardsCtrl from "../controllers/awardsController.js"; 

const router = express.Router();

router.post("/", awardsCtrl.create);
router.post("/assign", awardsCtrl.assign);
router.get("/", awardsCtrl.list);

export default router;