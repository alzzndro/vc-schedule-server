import { Router } from "express";
import v1Routes from "./v1/index.js";
// import v2Routes from "./v2"
const router = Router();
router.use("/v1", v1Routes);
// router.use("/v2", v2Routes)
export default router;
//# sourceMappingURL=index.js.map