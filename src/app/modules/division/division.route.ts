import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { divisionControllers } from "./division.controllers";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";
import { multerUpload } from "../../config/multer.config";

const divisionRouter = Router()

divisionRouter.post(
    "/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single('file'),
    validateRequest(createDivisionSchema),
    divisionControllers.createDivision
);
divisionRouter.get("/", divisionControllers.getAllDivisions);
divisionRouter.get("/:slug", divisionControllers.getSingleDivision)
divisionRouter.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"),
    validateRequest(updateDivisionSchema),
    divisionControllers.updateDivision
);
divisionRouter.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), divisionControllers.deleteDivision);

export default divisionRouter