import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

memberSchema.methods.toPublicJSON = function () {
  return { id: this._id.toString(), name: this.name, email: this.email };
};

export default mongoose.model("Member", memberSchema);
