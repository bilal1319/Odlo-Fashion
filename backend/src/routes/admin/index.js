import { Router } from "express";

import productRoutes from "./product.routes.js"
import categoryRoutes from "./category.routes.js";
import bundleRoutes from "./bundle.routes.js";
import masterBundleRoutes from "./masterBundle.routes.js";
import collectionRoutes from "./collection.routes.js";

const router = Router();

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/bundles", bundleRoutes);
router.use("/master-bundles", masterBundleRoutes);
router.use("/collections", collectionRoutes);

export default router;
