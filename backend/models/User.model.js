import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // NOTE: still plain text to match the current mock-data behaviour.
    // Before real deployment, hash this with bcrypt instead of storing raw text.
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Shape returned to the frontend — never leak the password field.
userSchema.methods.toPublicJSON = function () {
  return { id: this._id.toString(), name: this.name, email: this.email };
};

export default mongoose.model("User", userSchema);
