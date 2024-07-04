import mongoose from "mongoose";

export const databaseConnect = (url) => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database Connected Successfully"))
    .catch(() => console.log("Database Failed to Connect"));
};
