import express from "express";
import { getImage } from "../controllers";

const imageRouter = express.Router();

imageRouter.get("/", getImage);

export { imageRouter };
