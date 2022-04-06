const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
	userId: {
		type: String,
		required: true,
		unique: true,
	},
	token: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, expires: Date.now()+36000000 },
});

module.exports = Token = mongoose.model("Token", tokenSchema);