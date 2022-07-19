import express from "express";
import {
  getSlides,
  deleteSlide,
  setSlide,
  updateSlide,
} from "../controllers/Slides";
import { upload } from "../utils";
import { checkAuth } from "../controllers";
import { setValidation, updateValidation } from "../validator/slide";

const slidesRouter = express.Router();

slidesRouter.get("/", getSlides);
slidesRouter.delete("/", checkAuth, deleteSlide);
slidesRouter.post(
  "/",
  checkAuth,
  upload.single("image"),
  setValidation,
  setSlide
);
slidesRouter.put(
  "/",
  checkAuth,
  upload.single("image"),
  updateValidation,
  updateSlide
);

export { slidesRouter };
