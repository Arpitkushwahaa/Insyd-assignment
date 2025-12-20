import express from "express";
import { clerkWebhook, syncCurrentUser } from "../controllers/authcontroller.js";

const router = express.Router();

router.post("/webhook", clerkWebhook);
router.post("/sync", syncCurrentUser);

export default router;
