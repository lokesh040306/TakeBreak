import express from "express";
import { askAI } from "./ai.service.js";

const router = express.Router();

router.get("/test", async (req, res) => {
  try {
    const reply = await askAI(
      "test-room",
      "Explain recursion simply"
    );

    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;
