import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

inviteSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    fromUser: this.fromUser,
    toUser: this.toUser,
    board: this.board,
    status: this.status,
  };
};

export default mongoose.model("Invite", inviteSchema);