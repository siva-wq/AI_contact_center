const Mongo = require("mongoose");

const IssueSchema = new Mongo.Schema({
  userId: {
    type: Mongo.Schema.Types.ObjectId, 
    ref: "User",
    required:true
  },
  Issue: {
    type: String,
    required: true
  },
  istatus: {
    type: Boolean,
    default: false,
    required: true
  },
  
});

module.exports = Mongo.model("Issue", IssueSchema);
