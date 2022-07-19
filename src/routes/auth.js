import express from "express";
import { authUser, registrationUser } from "../controllers";
import { authValidation, registrationValidation } from "../validator";

const authRouter = express.Router();

authRouter.post("/login", authValidation, authUser);
authRouter.post("/registration", registrationValidation, registrationUser);

export { authRouter };
