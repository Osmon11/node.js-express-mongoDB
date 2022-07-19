import { validationResult } from "express-validator";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
import { SlidesModel, ImageModel } from "../models";

const imageUrlSplitter = "?imageId=";

export const getSlides = async (req, res) => {
  try {
    let slides = [];
    if (Boolean(req.query.id)) {
      slides = await SlidesModel.find({ _id: req.query.id }).exec();
    } else {
      slides = await SlidesModel.find();
    }
    return res.send(slides);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteSlide = async (req, res) => {
  try {
    let slide = await SlidesModel.findOne({ _id: req.query.id });
    await ImageModel.deleteOne({
      id: slide.imageUrl.split(imageUrlSplitter)[1],
    });
    await SlidesModel.deleteOne({ _id: slide.id });

    let slides = await SlidesModel.find();
    res.send(slides);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const setSlide = async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const url = `${req.protocol}://${req.get("host")}`;
    const file = req.file;
    try {
      let data = fs.readFileSync(file.path);

      if (data.length) {
        await new ImageModel({
          id: file.filename,
          type: file.mimetype,
          data,
        }).save();
        await new SlidesModel({
          imageName: file.originalname,
          imageUrl: `${url}/image${imageUrlSplitter}${file.filename}`,
          title: req.body.title,
          subtitle: req.body.subtitle,
        }).save();
        let slides = await SlidesModel.find();
        res.send(slides);
      } else {
        res.status(400).json({ error: "Не удалось прочитать image" });
      }
    } catch (err) {
      res.status(400).send(err);
    } finally {
      const unlinkAsync = promisify(fs.unlink);
      await unlinkAsync(file.path);
    }
  } else {
    res.status(400).json(errors.array());
  }
};

export const updateSlide = async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const url = req.protocol + "://" + req.get("host");
    const file = req.file;

    let data = "",
      updateData = { title: req.body.title, subtitle: req.body.subtitle };
    if (file) {
      data = fs.readFileSync(file.path);
    }
    if (data.length) {
      await ImageModel.updateOne(
        { id: req.body.imageUrl.split(imageUrlSplitter)[1] },
        {
          type: file.mimetype,
          data,
        }
      );
      updateData.imageName = file.originalname;
    }

    await SlidesModel.updateOne({ _id: req.query.id }, updateData);
    let slides = await SlidesModel.find();
    res.send(slides);
  } else {
    res.status(400).json(errors.array());
  }
};
