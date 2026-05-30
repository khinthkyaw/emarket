import { Router } from "express";
import { createAdminProduct, deleteAdminProduct, getImageKitAuth, listAdminProduts, requireAdmin, updateAdminProduct } from "../controllers/adminController";

const router = Router();

router.use(requireAdmin);

router.get("/imagekit/auth", getImageKitAuth);
router.get("/products", listAdminProduts);
router.post("/products", createAdminProduct);
router.patch("/products/:id", updateAdminProduct);
router.delete("/products/:id", deleteAdminProduct);

export default router; 