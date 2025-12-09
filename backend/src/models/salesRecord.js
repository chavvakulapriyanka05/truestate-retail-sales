import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    collection: "sales",
  }
);

export default mongoose.model("Sale", salesSchema);
