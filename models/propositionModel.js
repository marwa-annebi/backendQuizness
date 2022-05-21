const mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment-prefix");


const propositionSchema = mongoose.Schema({
  _id_proposition: {
    type: String,
  },
  question: {

    type: mongoose.Schema.Types.ObjectId,

    // required: true,

    ref: "Question"
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

// autoIncrement.initialize(mongoose.connection);

propositionSchema.pre("deleteOne", function (next) {
  const propositionId = this.getQuery()["_id"];
  mongoose
    .model("Question")
    .update(
      {},
      { $pull: { propositions: propositionId } },
      function (err, result) {
        if (err) {
          console.log(`[error] ${err}`);
          next(err);
        } else {
          console.log("success");
          next();
        }
      }
    );
});
// propositionSchema.plugin(autoIncrement.plugin, {
//   model: "Proposition",
//   field: "_id_proposition",
//   startAt: 1,
//   incrementBy: 1,
// });

module.exports = Proposition = mongoose.model("Proposition", propositionSchema);
