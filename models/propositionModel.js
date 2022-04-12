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

adminSchema.plugin(AutoIncrement, { id: "order_seq", inc_field: "_id_proposition" });

module.exports = Proposition = mongoose.model("Proposition", propositionSchema);
