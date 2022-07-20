import moment from "moment";
import { Schema, model } from "mongoose";

export const ImageSchema = Schema({
  id: String,
  type: String,
  data: Buffer,
  createdAt: {
    type: String,
    default: moment().format("DD.MM.YYYY hh:mm:ss"),
  },
});

export const ImageModel = model("image", ImageSchema);

//  await new ImageModel({
//    type: req.file.mimetype,
//    data: fs.readFileSync(path.join(`${__dirname}/public/${req.file.filename}`)),
//  }).save();
