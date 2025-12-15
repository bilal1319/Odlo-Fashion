import express from "express";
import { getCollections } from "../controllers/collections.controller.js";

const router = express.Router();

router.get("/", getCollections);

export default router;
