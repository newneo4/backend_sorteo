import express from "express";
import * as codesCtrl from "../controllers/codesController.js";

const router = express.Router();

router.post("/", codesCtrl.create);
router.post("/redeem", codesCtrl.redeem);
router.get("/winners", codesCtrl.listWinners);

export default router;
