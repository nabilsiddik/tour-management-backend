import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { divisionControllers } from "./division.controllers";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";

const router = Router()

router.post(
    "/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createDivisionSchema),
    divisionControllers.createDivision
);
router.get("/", divisionControllers.getAllDivisions);
router.get("/:slug", divisionControllers.getSingleDivision)
router.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateDivisionSchema),
    divisionControllers.updateDivision
);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), divisionControllers.deleteDivision);

export const DivisionRoutes = router