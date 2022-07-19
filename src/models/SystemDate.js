import { model, Schema } from "mongoose";

const SystemDateSchema = new Schema({
  date: Date,
});

SystemDateSchema.statics = {
  getSingleton: function (cb) {
    this.findOne().exec(async function (error, model) {
      if (error) {
        cb(error, null);
      } else if (model == null) {
        let model = new SystemDateModel({ date: new Date() });
        await model.save();
        cb(error, model);
      } else {
        cb(error, model);
      }
    });
  },
};

const SystemDateModel = model("SystemDate", SystemDateSchema);
export default SystemDateModel;
