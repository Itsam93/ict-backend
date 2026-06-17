import express from "express";
import {
  createResource,
  getResources,
  updateResource,
  deleteResource,
  viewResource,
  getMyResources,
} from "../controllers/resourceController.js";
import {
  initializeResourcePayment,
  verifyResourcePayment,
} from "../controllers/resourcePaymentController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getResources);

router.post("/pay/:id", protect, initializeResourcePayment);

router.get("/verify/:reference", verifyResourcePayment);

router.get("/my-resources", protect, getMyResources);

router.get("/view/:id", protect, viewResource);

router.post("/", protect, adminOnly, createResource);

router.put("/:id", protect, adminOnly, updateResource);

router.delete("/:id", protect, adminOnly, deleteResource);

export default router;