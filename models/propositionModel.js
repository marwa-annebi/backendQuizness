const mongoose = require("mongoose");

const propositionSchema = mongoose.Schema({
  _id_proposition: {
    type: Number,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
   // required: true,
    ref: "Question",
  },
  content: {
    type: String,
    required: true,
  },
  veracity: {
    type: Boolean,
    required: true,
  },
});
module.exports = Proposition = mongoose.model("Proposition", propositionSchema);
