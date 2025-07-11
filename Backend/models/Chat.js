const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [
    {
      sender: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      }
    }
  ],
  isTakenOver: {
    type: Boolean,
    default: false,
  },
  esclateToHuman: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Chat", chatSchema);
