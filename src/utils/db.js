import mongoose from "mongoose";
import colors from "colors/safe";

let retryCount = 0;
const MAX_RETRIES = 2;
export const connect = async function () {
  try {
    await mongoose
      .connect(process.env.DATABASE_URL, {
        serverSelectionTimeoutMS: 1000,
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (error) {
    console.log(colors.red("Couldn't connect to database"));
    console.error(colors.red(error));

    if (retryCount >= MAX_RETRIES) {
      process.exit();
    } else {
      retryCount += 1;
      console.error(
        "Failed to connect to mongo on startup - retrying in 2 sec",
        error
      );
      setTimeout(connect, 2000);
    }
  }
};
