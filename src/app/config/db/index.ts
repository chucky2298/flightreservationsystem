import Mongoose from "mongoose";
import config from "../var/index";

const init = () => {
  return new Promise<void>((resolve, reject) => {
    Mongoose.connect(config.databaseUrl)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

export default init;
