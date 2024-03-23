const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: [true, "roomCode required"],
    },
    username: {
      type: String,
      required: [true, "username required"],
    },
    message: {
      type: String,
      required: [true, "message required"],
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);

module.exports = Message;
